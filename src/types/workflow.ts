/**
 * Workflow Types - أنواع تصميم وتشغيل Workflow
 * Sprint 2: Workflow Design Layer
 */

import type { BoardPosition, BoardSize } from './board-model';

// ============= Workflow Definition =============

export interface WorkflowDefinition {
  id: string;
  name: string;
  description?: string;
  version: number;
  nodes: WorkflowNodeData[];
  edges: WorkflowEdgeData[];
  variables?: WorkflowVariable[];
  triggers?: WorkflowTrigger[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  status: 'draft' | 'active' | 'archived';
  frameId?: string; // ربط بإطار في اللوحة
}

// ============= Workflow Node =============

export type WorkflowNodeType = 
  | 'start'
  | 'end'
  | 'process_step'
  | 'task_stage'
  | 'decision'
  | 'parallel'
  | 'merge'
  | 'timer'
  | 'notification'
  | 'approval'
  | 'subprocess';

export interface WorkflowNodeData {
  id: string;
  type: WorkflowNodeType;
  label: string;
  description?: string;
  position: BoardPosition;
  size?: BoardSize;
  
  // التكوين حسب النوع
  config?: WorkflowNodeConfig;
  
  // للـ Hybrid: كانبان مصغر داخل node
  tasks?: WorkflowTask[];
  
  // شروط الدخول والخروج
  entryConditions?: WorkflowCondition[];
  exitConditions?: WorkflowCondition[];
  
  // إجراءات التنفيذ
  onEnterActions?: WorkflowAction[];
  onExitActions?: WorkflowAction[];
  
  // التعيين والمواعيد
  assignees?: string[];
  assigneeType?: 'user' | 'role' | 'department' | 'dynamic';
  dueDate?: string;
  dueDuration?: number; // بالدقائق
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  
  // الربط بعناصر اللوحة
  linkedElementIds?: string[];
  linkedDocumentIds?: string[];
  
  // النمط
  style?: WorkflowNodeStyle;
  
  // البيانات الوصفية
  metadata?: Record<string, unknown>;
}

export interface WorkflowNodeConfig {
  // للـ decision
  decisionType?: 'exclusive' | 'inclusive';
  
  // للـ timer
  timerType?: 'delay' | 'date' | 'cron';
  timerValue?: string;
  
  // للـ approval
  approvalType?: 'single' | 'all' | 'majority' | 'any';
  approvers?: string[];
  
  // للـ notification
  notificationType?: 'email' | 'sms' | 'push' | 'slack';
  notificationTemplate?: string;
  
  // للـ subprocess
  subprocessId?: string;
  
  // للـ parallel
  parallelPaths?: number;
}

export interface WorkflowNodeStyle {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  textColor?: string;
  iconName?: string;
  iconColor?: string;
}

// ============= Workflow Edge =============

export type WorkflowEdgeType = 
  | 'sequence'
  | 'conditional'
  | 'default'
  | 'exception';

export interface WorkflowEdgeData {
  id: string;
  type: WorkflowEdgeType;
  fromNodeId: string;
  toNodeId: string;
  fromAnchor?: 'top' | 'bottom' | 'left' | 'right';
  toAnchor?: 'top' | 'bottom' | 'left' | 'right';
  
  // التسمية
  label?: string;
  
  // الشروط (للـ conditional)
  conditions?: WorkflowCondition[];
  conditionLogic?: 'and' | 'or';
  
  // الإجراءات عند الانتقال
  actions?: WorkflowAction[];
  
  // أولوية الفحص (للـ decision nodes)
  priority?: number;
  
  // مسار الخط
  path?: WorkflowEdgePath;
  
  // النمط
  style?: WorkflowEdgeStyle;
}

export interface WorkflowEdgePath {
  type: 'straight' | 'orthogonal' | 'curved';
  points?: BoardPosition[];
  controlPoints?: BoardPosition[];
}

export interface WorkflowEdgeStyle {
  strokeColor?: string;
  strokeWidth?: number;
  strokeDash?: string;
  arrowStart?: boolean;
  arrowEnd?: boolean;
  animated?: boolean;
}

// ============= Workflow Condition =============

export type ConditionOperator = 
  | 'eq' | 'neq' 
  | 'gt' | 'gte' | 'lt' | 'lte'
  | 'contains' | 'not_contains'
  | 'starts_with' | 'ends_with'
  | 'is_empty' | 'is_not_empty'
  | 'in' | 'not_in'
  | 'matches'; // regex

export interface WorkflowCondition {
  id: string;
  type: 'field' | 'expression' | 'document_status' | 'task_status' | 'user_role' | 'custom';
  
  // للـ field
  field?: string;
  operator?: ConditionOperator;
  value?: unknown;
  
  // للـ expression
  expression?: string;
  
  // للـ document_status
  documentId?: string;
  documentStatus?: 'draft' | 'pending' | 'approved' | 'rejected';
  
  // للـ task_status
  taskId?: string;
  taskStatus?: 'todo' | 'in_progress' | 'done';
  
  // للـ user_role
  userRole?: string;
  
  // نفي الشرط
  negate?: boolean;
}

// ============= Workflow Action =============

export type WorkflowActionType = 
  | 'notify'
  | 'assign'
  | 'update_field'
  | 'create_task'
  | 'complete_task'
  | 'set_variable'
  | 'call_api'
  | 'send_email'
  | 'delay'
  | 'log'
  | 'custom';

export interface WorkflowAction {
  id: string;
  type: WorkflowActionType;
  name?: string;
  
  config: WorkflowActionConfig;
  
  // التنفيذ المشروط
  condition?: WorkflowCondition;
  
  // معالجة الأخطاء
  onError?: 'ignore' | 'retry' | 'fail';
  retryCount?: number;
  retryDelay?: number;
}

export interface WorkflowActionConfig {
  // notify / send_email
  recipients?: string[];
  template?: string;
  subject?: string;
  body?: string;
  
  // assign
  assignees?: string[];
  assigneeType?: 'user' | 'role' | 'department';
  
  // update_field / set_variable
  fieldName?: string;
  fieldValue?: unknown;
  
  // create_task
  taskTitle?: string;
  taskDescription?: string;
  taskAssignee?: string;
  taskDueDate?: string;
  
  // call_api
  apiUrl?: string;
  apiMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  apiHeaders?: Record<string, string>;
  apiBody?: unknown;
  
  // delay
  delayMinutes?: number;
  
  // log
  logMessage?: string;
  logLevel?: 'info' | 'warning' | 'error';
  
  // custom
  customHandler?: string;
  customParams?: Record<string, unknown>;
}

// ============= Workflow Task (Hybrid) =============

export interface WorkflowTask {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: string;
  dueDate?: string;
  completedAt?: string;
  completedBy?: string;
  checklist?: WorkflowTaskChecklistItem[];
  attachments?: string[];
  comments?: WorkflowTaskComment[];
  order: number;
}

export interface WorkflowTaskChecklistItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface WorkflowTaskComment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

// ============= Workflow Variable =============

export interface WorkflowVariable {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
  defaultValue?: unknown;
  description?: string;
  scope: 'workflow' | 'instance';
}

// ============= Workflow Trigger =============

export type WorkflowTriggerType = 
  | 'manual'
  | 'schedule'
  | 'event'
  | 'webhook'
  | 'document_upload'
  | 'form_submit';

export interface WorkflowTrigger {
  id: string;
  type: WorkflowTriggerType;
  name?: string;
  enabled: boolean;
  
  config: WorkflowTriggerConfig;
}

export interface WorkflowTriggerConfig {
  // schedule
  cronExpression?: string;
  
  // event
  eventName?: string;
  eventSource?: string;
  
  // webhook
  webhookUrl?: string;
  webhookSecret?: string;
  
  // document_upload
  documentTypes?: string[];
  
  // form_submit
  formId?: string;
}

// ============= Helper Functions =============

export const createWorkflowNode = (
  type: WorkflowNodeType,
  position: BoardPosition,
  label?: string
): WorkflowNodeData => ({
  id: `node-${Date.now()}`,
  type,
  label: label || getDefaultNodeLabel(type),
  position,
  size: getDefaultNodeSize(type),
  style: getDefaultNodeStyle(type)
});

export const createWorkflowEdge = (
  fromNodeId: string,
  toNodeId: string,
  type: WorkflowEdgeType = 'sequence'
): WorkflowEdgeData => ({
  id: `edge-${Date.now()}`,
  type,
  fromNodeId,
  toNodeId,
  style: getDefaultEdgeStyle(type)
});

export const getDefaultNodeLabel = (type: WorkflowNodeType): string => {
  const labels: Record<WorkflowNodeType, string> = {
    start: 'بداية',
    end: 'نهاية',
    process_step: 'خطوة',
    task_stage: 'مرحلة المهام',
    decision: 'قرار',
    parallel: 'تفرع',
    merge: 'دمج',
    timer: 'مؤقت',
    notification: 'إشعار',
    approval: 'موافقة',
    subprocess: 'عملية فرعية'
  };
  return labels[type];
};

export const getDefaultNodeSize = (type: WorkflowNodeType): BoardSize => {
  switch (type) {
    case 'start':
    case 'end':
      return { width: 60, height: 60 };
    case 'decision':
      return { width: 80, height: 80 };
    case 'task_stage':
      return { width: 280, height: 200 };
    default:
      return { width: 180, height: 80 };
  }
};

export const getDefaultNodeStyle = (type: WorkflowNodeType): WorkflowNodeStyle => {
  const styles: Record<WorkflowNodeType, WorkflowNodeStyle> = {
    start: {
      backgroundColor: '#10B981',
      borderColor: '#059669',
      borderRadius: 30,
      textColor: '#FFFFFF',
      iconName: 'Play'
    },
    end: {
      backgroundColor: '#EF4444',
      borderColor: '#DC2626',
      borderRadius: 30,
      textColor: '#FFFFFF',
      iconName: 'Square'
    },
    process_step: {
      backgroundColor: '#3B82F6',
      borderColor: '#2563EB',
      borderRadius: 8,
      textColor: '#FFFFFF',
      iconName: 'Cog'
    },
    task_stage: {
      backgroundColor: '#8B5CF6',
      borderColor: '#7C3AED',
      borderRadius: 12,
      textColor: '#FFFFFF',
      iconName: 'CheckSquare'
    },
    decision: {
      backgroundColor: '#F59E0B',
      borderColor: '#D97706',
      borderRadius: 0,
      textColor: '#FFFFFF',
      iconName: 'HelpCircle'
    },
    parallel: {
      backgroundColor: '#6366F1',
      borderColor: '#4F46E5',
      borderRadius: 4,
      textColor: '#FFFFFF',
      iconName: 'GitBranch'
    },
    merge: {
      backgroundColor: '#6366F1',
      borderColor: '#4F46E5',
      borderRadius: 4,
      textColor: '#FFFFFF',
      iconName: 'GitMerge'
    },
    timer: {
      backgroundColor: '#EC4899',
      borderColor: '#DB2777',
      borderRadius: 8,
      textColor: '#FFFFFF',
      iconName: 'Clock'
    },
    notification: {
      backgroundColor: '#14B8A6',
      borderColor: '#0D9488',
      borderRadius: 8,
      textColor: '#FFFFFF',
      iconName: 'Bell'
    },
    approval: {
      backgroundColor: '#F97316',
      borderColor: '#EA580C',
      borderRadius: 8,
      textColor: '#FFFFFF',
      iconName: 'ThumbsUp'
    },
    subprocess: {
      backgroundColor: '#64748B',
      borderColor: '#475569',
      borderRadius: 8,
      textColor: '#FFFFFF',
      iconName: 'Layers'
    }
  };
  return styles[type];
};

export const getDefaultEdgeStyle = (type: WorkflowEdgeType): WorkflowEdgeStyle => {
  switch (type) {
    case 'conditional':
      return {
        strokeColor: '#F59E0B',
        strokeWidth: 2,
        arrowEnd: true,
        animated: false
      };
    case 'default':
      return {
        strokeColor: '#6B7280',
        strokeWidth: 2,
        strokeDash: '5,5',
        arrowEnd: true
      };
    case 'exception':
      return {
        strokeColor: '#EF4444',
        strokeWidth: 2,
        strokeDash: '3,3',
        arrowEnd: true
      };
    default:
      return {
        strokeColor: '#374151',
        strokeWidth: 2,
        arrowEnd: true
      };
  }
};

// ============= Workflow Validation =============

export interface WorkflowValidationResult {
  valid: boolean;
  errors: WorkflowValidationError[];
  warnings: WorkflowValidationWarning[];
}

export interface WorkflowValidationError {
  code: string;
  message: string;
  nodeId?: string;
  edgeId?: string;
}

export interface WorkflowValidationWarning {
  code: string;
  message: string;
  nodeId?: string;
  edgeId?: string;
}

export const validateWorkflow = (workflow: WorkflowDefinition): WorkflowValidationResult => {
  const errors: WorkflowValidationError[] = [];
  const warnings: WorkflowValidationWarning[] = [];
  
  // التحقق من وجود عقدة بداية
  const startNodes = workflow.nodes.filter(n => n.type === 'start');
  if (startNodes.length === 0) {
    errors.push({ code: 'NO_START', message: 'يجب وجود عقدة بداية واحدة على الأقل' });
  } else if (startNodes.length > 1) {
    warnings.push({ code: 'MULTIPLE_START', message: 'يوجد أكثر من عقدة بداية' });
  }
  
  // التحقق من وجود عقدة نهاية
  const endNodes = workflow.nodes.filter(n => n.type === 'end');
  if (endNodes.length === 0) {
    errors.push({ code: 'NO_END', message: 'يجب وجود عقدة نهاية واحدة على الأقل' });
  }
  
  // التحقق من الروابط
  workflow.edges.forEach(edge => {
    const fromNode = workflow.nodes.find(n => n.id === edge.fromNodeId);
    const toNode = workflow.nodes.find(n => n.id === edge.toNodeId);
    
    if (!fromNode) {
      errors.push({
        code: 'INVALID_EDGE_SOURCE',
        message: `الرابط يشير إلى عقدة مصدر غير موجودة`,
        edgeId: edge.id
      });
    }
    
    if (!toNode) {
      errors.push({
        code: 'INVALID_EDGE_TARGET',
        message: `الرابط يشير إلى عقدة هدف غير موجودة`,
        edgeId: edge.id
      });
    }
  });
  
  // التحقق من العقد المعزولة
  workflow.nodes.forEach(node => {
    if (node.type === 'start') return;
    
    const hasIncoming = workflow.edges.some(e => e.toNodeId === node.id);
    if (!hasIncoming) {
      warnings.push({
        code: 'ISOLATED_NODE',
        message: `العقدة "${node.label}" لا تملك روابط واردة`,
        nodeId: node.id
      });
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};
