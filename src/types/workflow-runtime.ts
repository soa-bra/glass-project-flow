/**
 * أنواع تشغيل Workflow في الوقت الفعلي
 * تدعم تتبع حالة كل عقدة وتسجيل الأحداث
 */

export type NodeRuntimeStatus = 
  | 'idle'        // لم تبدأ بعد
  | 'pending'     // في الانتظار (شروط الدخول)
  | 'active'      // قيد التنفيذ
  | 'completed'   // اكتملت بنجاح
  | 'blocked'     // محظورة (شرط فشل)
  | 'skipped'     // تم تخطيها
  | 'error';      // حدث خطأ

export type WorkflowRuntimeStatus = 
  | 'idle'
  | 'running'
  | 'paused'
  | 'completed'
  | 'error';

export interface NodeRuntimeState {
  nodeId: string;
  status: NodeRuntimeStatus;
  enteredAt?: string;
  exitedAt?: string;
  error?: string;
  retryCount: number;
  data: Record<string, unknown>;
}

export interface WorkflowInstance {
  id: string;
  workflowId: string;
  status: WorkflowRuntimeStatus;
  currentNodeIds: string[];         // العقد النشطة حالياً (دعم التوازي)
  nodeStates: Record<string, NodeRuntimeState>;
  variables: Record<string, unknown>;
  startedAt?: string;
  pausedAt?: string;
  completedAt?: string;
  error?: string;
  logs: WorkflowLogEvent[];
}

export type LogEventType = 
  | 'workflow_started'
  | 'workflow_paused'
  | 'workflow_resumed'
  | 'workflow_completed'
  | 'workflow_error'
  | 'node_entered'
  | 'node_exited'
  | 'node_error'
  | 'node_skipped'
  | 'condition_evaluated'
  | 'action_executed'
  | 'action_failed'
  | 'variable_updated'
  | 'transition_taken';

export interface WorkflowLogEvent {
  id: string;
  timestamp: string;
  type: LogEventType;
  nodeId?: string;
  message: string;
  details?: Record<string, unknown>;
  level: 'info' | 'warn' | 'error' | 'debug';
}

export interface WorkflowTransition {
  from: string;
  to: string;
  edgeId: string;
  condition?: string;
  takenAt: string;
}

export interface ConditionContext {
  variables: Record<string, unknown>;
  nodeStates: Record<string, NodeRuntimeState>;
  currentNode: NodeRuntimeState;
  previousNode?: NodeRuntimeState;
}

export interface ActionContext extends ConditionContext {
  updateVariable: (key: string, value: unknown) => void;
  log: (message: string, level?: 'info' | 'warn' | 'error') => void;
}

export interface WorkflowEngineConfig {
  maxRetries: number;
  retryDelay: number;
  timeout: number;
  autoAdvance: boolean;
  stepDelay: number;
}

export const defaultEngineConfig: WorkflowEngineConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 30000,
  autoAdvance: true,
  stepDelay: 500
};

// Helper لإنشاء حالة عقدة جديدة
export function createNodeState(nodeId: string): NodeRuntimeState {
  return {
    nodeId,
    status: 'idle',
    retryCount: 0,
    data: {}
  };
}

// Helper لإنشاء مثيل workflow جديد
export function createWorkflowInstance(
  workflowId: string,
  nodeIds: string[]
): WorkflowInstance {
  const nodeStates: Record<string, NodeRuntimeState> = {};
  nodeIds.forEach(id => {
    nodeStates[id] = createNodeState(id);
  });

  return {
    id: `wf-run-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    workflowId,
    status: 'idle',
    currentNodeIds: [],
    nodeStates,
    variables: {},
    logs: []
  };
}

// Helper لإنشاء حدث سجل
export function createLogEvent(
  type: LogEventType,
  message: string,
  options: Partial<Omit<WorkflowLogEvent, 'id' | 'timestamp' | 'type' | 'message'>> = {}
): WorkflowLogEvent {
  return {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    type,
    message,
    level: options.level || 'info',
    ...options
  };
}
