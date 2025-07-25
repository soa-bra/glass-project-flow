export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';
export type ApprovalType = 'expense' | 'project' | 'contract' | 'hr' | 'legal' | 'asset';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface ApprovalRule {
  id: string;
  entityType: ApprovalType;
  condition: Record<string, any>;
  requiredApprovers: number;
  approverRoles: string[];
  timeoutMinutes?: number;
  escalationRoles?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalRequest {
  id: string;
  entityType: ApprovalType;
  entityId: string;
  requesterId: string;
  status: ApprovalStatus;
  priority: Priority;
  data: Record<string, any>;
  context?: Record<string, any>;
  ruleId: string;
  requiredApprovers: number;
  currentLevel: number;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  approvers: ApprovalAction[];
}

export interface ApprovalAction {
  id: string;
  requestId: string;
  approverId: string;
  action: 'approved' | 'rejected' | 'delegated';
  level: number;
  comments?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface ApprovalDashboardStats {
  pending: number;
  approved: number;
  rejected: number;
  overdue: number;
  myPending: number;
}

export interface CreateApprovalRequest {
  entityType: ApprovalType;
  entityId: string;
  data: Record<string, any>;
  priority?: Priority;
  context?: Record<string, any>;
}