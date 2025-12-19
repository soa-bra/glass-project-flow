/**
 * محرك تشغيل Workflow الرئيسي
 * يدير دورة حياة التنفيذ والانتقالات بين العقد
 */

import type { 
  WorkflowInstance, 
  NodeRuntimeState,
  WorkflowEngineConfig,
  ConditionContext,
  ActionContext,
  WorkflowLogEvent,
  NodeRuntimeStatus
} from '@/types/workflow-runtime';
import type { 
  WorkflowDefinition, 
  WorkflowNodeData, 
  WorkflowEdgeData 
} from '@/types/workflow';
import { 
  createWorkflowInstance, 
  createLogEvent, 
  defaultEngineConfig 
} from '@/types/workflow-runtime';
import { evaluateEntryConditions, evaluateEdgeCondition } from './conditions';
import { executeActions } from './actions';
import { workflowScheduler } from './scheduler';

export type WorkflowEventCallback = (event: WorkflowLogEvent) => void;

export interface WorkflowEngineInstance {
  instance: WorkflowInstance;
  definition: WorkflowDefinition;
  config: WorkflowEngineConfig;
  onEvent?: WorkflowEventCallback;
}

class WorkflowEngine {
  private instances: Map<string, WorkflowEngineInstance> = new Map();

  /**
   * بدء تشغيل workflow
   */
  async start(
    definition: WorkflowDefinition,
    config: Partial<WorkflowEngineConfig> = {},
    onEvent?: WorkflowEventCallback
  ): Promise<WorkflowInstance> {
    const nodeIds = definition.nodes.map(n => n.id);
    const instance = createWorkflowInstance(definition.id, nodeIds);
    
    const engineInstance: WorkflowEngineInstance = {
      instance,
      definition,
      config: { ...defaultEngineConfig, ...config },
      onEvent
    };
    
    this.instances.set(instance.id, engineInstance);
    
    // تسجيل البدء
    this.log(instance.id, 'workflow_started', 'بدأ تشغيل Workflow');
    
    // تحديث الحالة
    instance.status = 'running';
    instance.startedAt = new Date().toISOString();
    
    // البحث عن عقدة البداية
    const startNode = definition.nodes.find(n => n.type === 'start');
    
    if (!startNode) {
      this.log(instance.id, 'workflow_error', 'لم يتم العثور على عقدة البداية', {
        level: 'error'
      });
      instance.status = 'error';
      instance.error = 'لم يتم العثور على عقدة البداية';
      return instance;
    }
    
    // دخول عقدة البداية
    await this.enterNode(instance.id, startNode.id);
    
    // التقدم تلقائياً إذا كان مفعلاً
    if (engineInstance.config.autoAdvance) {
      await this.autoAdvance(instance.id);
    }
    
    return instance;
  }

  /**
   * إيقاف مؤقت
   */
  pause(instanceId: string): boolean {
    const engine = this.instances.get(instanceId);
    if (!engine || engine.instance.status !== 'running') return false;
    
    engine.instance.status = 'paused';
    engine.instance.pausedAt = new Date().toISOString();
    
    workflowScheduler.cancelWorkflow(instanceId);
    
    this.log(instanceId, 'workflow_paused', 'تم إيقاف Workflow مؤقتاً');
    
    return true;
  }

  /**
   * استئناف
   */
  async resume(instanceId: string): Promise<boolean> {
    const engine = this.instances.get(instanceId);
    if (!engine || engine.instance.status !== 'paused') return false;
    
    engine.instance.status = 'running';
    engine.instance.pausedAt = undefined;
    
    this.log(instanceId, 'workflow_resumed', 'تم استئناف Workflow');
    
    if (engine.config.autoAdvance) {
      await this.autoAdvance(instanceId);
    }
    
    return true;
  }

  /**
   * خطوة واحدة
   */
  async step(instanceId: string): Promise<boolean> {
    const engine = this.instances.get(instanceId);
    if (!engine) return false;
    
    const { instance, definition } = engine;
    
    if (instance.status !== 'running' && instance.status !== 'paused') {
      return false;
    }
    
    // معالجة كل عقدة نشطة
    for (const nodeId of [...instance.currentNodeIds]) {
      const nodeState = instance.nodeStates[nodeId];
      
      if (nodeState.status === 'active') {
        // البحث عن الحواف الخارجة (استخدام source بدلاً من from)
        const outEdges = definition.edges.filter(e => e.source === nodeId);
        
        // محاولة الانتقال
        await this.tryTransition(instanceId, nodeId, outEdges);
      }
    }
    
    return true;
  }

  /**
   * إعادة تعيين
   */
  reset(instanceId: string): WorkflowInstance | null {
    const engine = this.instances.get(instanceId);
    if (!engine) return null;
    
    // إلغاء المهام المجدولة
    workflowScheduler.cancelWorkflow(instanceId);
    
    // إعادة تعيين الحالات
    const { instance, definition } = engine;
    
    instance.status = 'idle';
    instance.currentNodeIds = [];
    instance.startedAt = undefined;
    instance.pausedAt = undefined;
    instance.completedAt = undefined;
    instance.error = undefined;
    instance.variables = {};
    instance.logs = [];
    
    // إعادة تعيين حالات العقد
    for (const node of definition.nodes) {
      instance.nodeStates[node.id] = {
        nodeId: node.id,
        status: 'idle',
        retryCount: 0,
        data: {}
      };
    }
    
    return instance;
  }

  /**
   * إيقاف كامل
   */
  stop(instanceId: string): boolean {
    const engine = this.instances.get(instanceId);
    if (!engine) return false;
    
    workflowScheduler.cancelWorkflow(instanceId);
    this.log(instanceId, 'workflow_completed', 'تم إيقاف Workflow');
    
    engine.instance.status = 'completed';
    engine.instance.completedAt = new Date().toISOString();
    
    return true;
  }

  /**
   * دخول عقدة
   */
  async enterNode(instanceId: string, nodeId: string): Promise<boolean> {
    const engine = this.instances.get(instanceId);
    if (!engine) return false;
    
    const { instance, definition } = engine;
    const node = definition.nodes.find(n => n.id === nodeId);
    const nodeState = instance.nodeStates[nodeId];
    
    if (!node || !nodeState) return false;
    
    // التحقق من شروط الدخول
    const context = this.createConditionContext(instance, nodeState);
    const { passed, failedConditions } = evaluateEntryConditions(
      node.entryConditions,
      context
    );
    
    if (!passed) {
      nodeState.status = 'blocked';
      this.log(instanceId, 'condition_evaluated', 
        `عقدة ${node.label} محظورة: شروط الدخول لم تتحقق`, {
          nodeId,
          details: { failedConditions }
        }
      );
      return false;
    }
    
    // تحديث الحالة
    nodeState.status = 'active';
    nodeState.enteredAt = new Date().toISOString();
    
    if (!instance.currentNodeIds.includes(nodeId)) {
      instance.currentNodeIds.push(nodeId);
    }
    
    this.log(instanceId, 'node_entered', `دخول عقدة: ${node.label}`, { nodeId });
    
    // تنفيذ إجراءات الدخول
    if (node.onEnterActions) {
      const actionContext = this.createActionContext(instance, nodeState);
      await executeActions(node.onEnterActions, actionContext);
    }
    
    // التحقق من نوع العقدة
    if (node.type === 'end') {
      await this.completeWorkflow(instanceId);
    }
    
    return true;
  }

  /**
   * خروج من عقدة
   */
  async exitNode(instanceId: string, nodeId: string): Promise<void> {
    const engine = this.instances.get(instanceId);
    if (!engine) return;
    
    const { instance, definition } = engine;
    const node = definition.nodes.find(n => n.id === nodeId);
    const nodeState = instance.nodeStates[nodeId];
    
    if (!node || !nodeState) return;
    
    // تنفيذ إجراءات الخروج
    if (node.onExitActions) {
      const actionContext = this.createActionContext(instance, nodeState);
      await executeActions(node.onExitActions, actionContext);
    }
    
    // تحديث الحالة
    nodeState.status = 'completed';
    nodeState.exitedAt = new Date().toISOString();
    
    // إزالة من العقد النشطة
    instance.currentNodeIds = instance.currentNodeIds.filter(id => id !== nodeId);
    
    this.log(instanceId, 'node_exited', `خروج من عقدة: ${node.label}`, { nodeId });
  }

  /**
   * محاولة الانتقال
   */
  async tryTransition(
    instanceId: string,
    fromNodeId: string,
    edges: WorkflowEdgeData[]
  ): Promise<boolean> {
    const engine = this.instances.get(instanceId);
    if (!engine) return false;
    
    const { instance, definition } = engine;
    const fromNode = definition.nodes.find(n => n.id === fromNodeId);
    
    if (!fromNode) return false;
    
    // للعقد الشرطية (decision)، نقيّم كل حافة
    if (fromNode.type === 'decision') {
      for (const edge of edges) {
        const context = this.createConditionContext(
          instance, 
          instance.nodeStates[fromNodeId]
        );
        
        // استخدام conditions بدلاً من condition
        const condExpr = edge.conditions?.[0]?.value as string | undefined;
        if (evaluateEdgeCondition(condExpr, context)) {
          await this.transition(instanceId, fromNodeId, edge.target, edge.id);
          return true;
        }
      }
      
      // لم يتحقق أي شرط
      this.log(instanceId, 'condition_evaluated', 
        'لم يتحقق أي شرط انتقال', { nodeId: fromNodeId, level: 'warn' });
      return false;
    }
    
    // للعقد العادية، الانتقال للحافة الأولى
    if (edges.length > 0) {
      const edge = edges[0];
      await this.transition(instanceId, fromNodeId, edge.target, edge.id);
      return true;
    }
    
    return false;
  }

  /**
   * تنفيذ انتقال
   */
  async transition(
    instanceId: string,
    fromNodeId: string,
    toNodeId: string,
    edgeId: string
  ): Promise<void> {
    const engine = this.instances.get(instanceId);
    if (!engine) return;
    
    const { definition } = engine;
    const edge = definition.edges.find(e => e.id === edgeId);
    
    // تنفيذ إجراءات الحافة
    if (edge?.actions) {
      const actionContext = this.createActionContext(
        engine.instance,
        engine.instance.nodeStates[fromNodeId]
      );
      await executeActions(edge.actions, actionContext);
    }
    
    this.log(instanceId, 'transition_taken', 
      `انتقال من ${fromNodeId} إلى ${toNodeId}`, {
        details: { fromNodeId, toNodeId, edgeId }
      }
    );
    
    // خروج من العقدة الحالية
    await this.exitNode(instanceId, fromNodeId);
    
    // دخول العقدة الجديدة
    await this.enterNode(instanceId, toNodeId);
  }

  /**
   * التقدم التلقائي
   */
  private async autoAdvance(instanceId: string): Promise<void> {
    const engine = this.instances.get(instanceId);
    if (!engine) return;
    
    const { instance, config } = engine;
    
    while (
      instance.status === 'running' && 
      instance.currentNodeIds.length > 0
    ) {
      // تأخير بين الخطوات
      if (config.stepDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, config.stepDelay));
      }
      
      const advanced = await this.step(instanceId);
      
      if (!advanced) {
        // لا يمكن التقدم أكثر
        break;
      }
    }
  }

  /**
   * إكمال workflow
   */
  private async completeWorkflow(instanceId: string): Promise<void> {
    const engine = this.instances.get(instanceId);
    if (!engine) return;
    
    engine.instance.status = 'completed';
    engine.instance.completedAt = new Date().toISOString();
    
    this.log(instanceId, 'workflow_completed', 'اكتمل Workflow بنجاح');
    
    // تنظيف
    workflowScheduler.cancelWorkflow(instanceId);
  }

  /**
   * إنشاء سياق الشروط
   */
  private createConditionContext(
    instance: WorkflowInstance,
    currentNodeState: NodeRuntimeState
  ): ConditionContext {
    return {
      variables: instance.variables,
      nodeStates: instance.nodeStates,
      currentNode: currentNodeState
    };
  }

  /**
   * إنشاء سياق الإجراءات
   */
  private createActionContext(
    instance: WorkflowInstance,
    currentNodeState: NodeRuntimeState
  ): ActionContext {
    return {
      variables: instance.variables,
      nodeStates: instance.nodeStates,
      currentNode: currentNodeState,
      updateVariable: (key, value) => {
        instance.variables[key] = value;
        this.log(instance.id, 'variable_updated', `تحديث متغير: ${key}`, {
          details: { key, value }
        });
      },
      log: (message, level = 'info') => {
        this.log(instance.id, 'action_executed', message, { level });
      }
    };
  }

  /**
   * تسجيل حدث
   */
  private log(
    instanceId: string,
    type: WorkflowLogEvent['type'],
    message: string,
    options: Partial<Omit<WorkflowLogEvent, 'id' | 'timestamp' | 'type' | 'message'>> = {}
  ): void {
    const engine = this.instances.get(instanceId);
    if (!engine) return;
    
    const event = createLogEvent(type, message, options);
    engine.instance.logs.push(event);
    
    // إرسال للمستمعين
    engine.onEvent?.(event);
  }

  /**
   * الحصول على مثيل
   */
  getInstance(instanceId: string): WorkflowInstance | null {
    return this.instances.get(instanceId)?.instance || null;
  }

  /**
   * تحديث متغير
   */
  updateVariable(instanceId: string, key: string, value: unknown): void {
    const engine = this.instances.get(instanceId);
    if (!engine) return;
    
    engine.instance.variables[key] = value;
    this.log(instanceId, 'variable_updated', `تحديث متغير: ${key}`, {
      details: { key, value }
    });
  }

  /**
   * تعيين حالة عقدة يدوياً
   */
  setNodeStatus(
    instanceId: string, 
    nodeId: string, 
    status: NodeRuntimeStatus
  ): void {
    const engine = this.instances.get(instanceId);
    if (!engine) return;
    
    const nodeState = engine.instance.nodeStates[nodeId];
    if (nodeState) {
      nodeState.status = status;
    }
  }
}

// Singleton
export const workflowEngine = new WorkflowEngine();
