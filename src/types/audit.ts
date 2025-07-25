export type AuditEventType = 
  | 'user.created' | 'user.updated' | 'user.deleted'
  | 'project.created' | 'project.updated' | 'project.deleted'
  | 'task.created' | 'task.updated' | 'task.deleted'
  | 'approval.created' | 'approval.approved' | 'approval.rejected'
  | 'file.uploaded' | 'file.downloaded' | 'file.deleted'
  | 'auth.login' | 'auth.logout' | 'auth.failed'
  | 'system.error' | 'system.warning' | 'system.info';

export type EventStatus = 'pending' | 'processing' | 'delivered' | 'failed' | 'retrying';

export interface AuditEvent {
  id: string;
  eventType: AuditEventType;
  entityType: string;
  entityId: string;
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  changes?: Record<string, any>;
  metadata?: Record<string, any>;
  timestamp: string;
  correlationId?: string;
}

export interface EventOutbox {
  id: string;
  eventId: string;
  eventType: AuditEventType;
  payload: Record<string, any>;
  destination: string;
  status: EventStatus;
  retryCount: number;
  maxRetries: number;
  nextRetryAt?: string;
  createdAt: string;
  updatedAt: string;
  processedAt?: string;
  errorMessage?: string;
}

export interface AuditQuery {
  eventTypes?: AuditEventType[];
  entityType?: string;
  entityId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface AuditStats {
  totalEvents: number;
  recentEvents: number;
  failedEvents: number;
  eventsByType: Record<AuditEventType, number>;
  topUsers: { userId: string; count: number }[];
}

export interface CreateAuditEvent {
  eventType: AuditEventType;
  entityType: string;
  entityId: string;
  changes?: Record<string, any>;
  metadata?: Record<string, any>;
  correlationId?: string;
}