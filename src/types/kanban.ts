export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface WIPLimit {
  id: string;
  boardId: string;
  status: TaskStatus;
  limit: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SLARule {
  id: string;
  boardId: string;
  taskType?: string;
  priority: TaskPriority;
  statusTransitions: {
    from: TaskStatus;
    to: TaskStatus;
    maxMinutes: number;
  }[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  projectId: string;
  boardId: string;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  movedAt: string;
  slaViolations: SLAViolation[];
}

export interface SLAViolation {
  id: string;
  taskId: string;
  ruleId: string;
  fromStatus: TaskStatus;
  toStatus: TaskStatus;
  expectedMinutes: number;
  actualMinutes: number;
  isResolved: boolean;
  createdAt: string;
  resolvedAt?: string;
}

export interface KanbanBoard {
  id: string;
  name: string;
  projectId: string;
  columns: KanbanColumn[];
  wipLimits: WIPLimit[];
  slaRules: SLARule[];
  createdAt: string;
  updatedAt: string;
}

export interface KanbanColumn {
  id: string;
  status: TaskStatus;
  title: string;
  order: number;
  tasks: KanbanTask[];
  wipLimit?: WIPLimit;
}

export interface WIPViolation {
  status: TaskStatus;
  currentCount: number;
  limit: number;
  canAdd: boolean;
}

export interface KanbanMetrics {
  totalTasks: number;
  wipViolations: WIPViolation[];
  slaViolations: number;
  averageCycleTime: number;
  throughput: number;
}