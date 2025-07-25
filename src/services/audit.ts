import type { 
  AuditEvent, 
  EventOutbox, 
  AuditQuery, 
  AuditStats, 
  CreateAuditEvent,
  AuditEventType 
} from '@/types/audit';

// Mock data for development
const mockAuditEvents: AuditEvent[] = [
  {
    id: '1',
    eventType: 'project.created',
    entityType: 'project',
    entityId: 'proj-001',
    userId: 'user-1',
    sessionId: 'session-123',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0...',
    changes: { name: 'New Project', status: 'active' },
    metadata: { source: 'web_app' },
    timestamp: new Date().toISOString(),
    correlationId: 'corr-001'
  }
];

const mockEventOutbox: EventOutbox[] = [];

export class AuditService {
  // Mock implementation - replace with actual API calls when Supabase is integrated
  
  async logEvent(event: CreateAuditEvent): Promise<AuditEvent> {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const auditEvent: AuditEvent = {
      id: Date.now().toString(),
      ...event,
      userId: 'current-user', // TODO: Get from auth context
      sessionId: 'session-' + Date.now(),
      ipAddress: '127.0.0.1', // TODO: Get actual IP
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };

    mockAuditEvents.push(auditEvent);
    
    // Add to outbox for external systems
    await this.addToOutbox(auditEvent);
    
    return auditEvent;
  }

  async queryEvents(query: AuditQuery): Promise<AuditEvent[]> {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 100));
    
    let filtered = [...mockAuditEvents];
    
    if (query.eventTypes?.length) {
      filtered = filtered.filter(event => query.eventTypes!.includes(event.eventType));
    }
    
    if (query.entityType) {
      filtered = filtered.filter(event => event.entityType === query.entityType);
    }
    
    if (query.entityId) {
      filtered = filtered.filter(event => event.entityId === query.entityId);
    }
    
    if (query.userId) {
      filtered = filtered.filter(event => event.userId === query.userId);
    }
    
    if (query.startDate) {
      filtered = filtered.filter(event => event.timestamp >= query.startDate!);
    }
    
    if (query.endDate) {
      filtered = filtered.filter(event => event.timestamp <= query.endDate!);
    }
    
    // Apply pagination
    const offset = query.offset || 0;
    const limit = query.limit || 50;
    
    return filtered
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(offset, offset + limit);
  }

  async getStats(): Promise<AuditStats> {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const eventsByType = mockAuditEvents.reduce((acc, event) => {
      acc[event.eventType] = (acc[event.eventType] || 0) + 1;
      return acc;
    }, {} as Record<AuditEventType, number>);
    
    const userCounts = mockAuditEvents.reduce((acc, event) => {
      if (event.userId) {
        acc[event.userId] = (acc[event.userId] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    const topUsers = Object.entries(userCounts)
      .map(([userId, count]) => ({ userId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const recentEvents = mockAuditEvents.filter(event => 
      new Date(event.timestamp) > oneDayAgo
    ).length;
    
    return {
      totalEvents: mockAuditEvents.length,
      recentEvents,
      failedEvents: mockEventOutbox.filter(event => event.status === 'failed').length,
      eventsByType,
      topUsers
    };
  }

  private async addToOutbox(event: AuditEvent): Promise<void> {
    // TODO: Replace with actual API call
    const outboxEvent: EventOutbox = {
      id: Date.now().toString(),
      eventId: event.id,
      eventType: event.eventType,
      payload: {
        ...event,
        // Add any transformation needed for external systems
      },
      destination: 'external_webhook', // TODO: Configure destinations
      status: 'pending',
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockEventOutbox.push(outboxEvent);
  }

  async processOutboxEvents(): Promise<void> {
    // TODO: Replace with actual API call and implement as background job
    const pendingEvents = mockEventOutbox.filter(event => 
      event.status === 'pending' || 
      (event.status === 'retrying' && event.nextRetryAt && new Date(event.nextRetryAt) <= new Date())
    );
    
    for (const event of pendingEvents) {
      try {
        event.status = 'processing';
        
        // TODO: Send to actual external system
        await this.sendToExternalSystem(event);
        
        event.status = 'delivered';
        event.processedAt = new Date().toISOString();
        event.updatedAt = new Date().toISOString();
        
      } catch (error) {
        event.retryCount++;
        event.errorMessage = error instanceof Error ? error.message : 'Unknown error';
        event.updatedAt = new Date().toISOString();
        
        if (event.retryCount >= event.maxRetries) {
          event.status = 'failed';
        } else {
          event.status = 'retrying';
          // Exponential backoff
          const retryDelayMs = Math.pow(2, event.retryCount) * 60000; // 1min, 2min, 4min, etc.
          event.nextRetryAt = new Date(Date.now() + retryDelayMs).toISOString();
        }
      }
    }
  }

  private async sendToExternalSystem(event: EventOutbox): Promise<void> {
    // TODO: Implement actual webhook/API calls to external systems
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate API call
    
    // For development, just log to console
    console.log('Sending event to external system:', event);
    
    // Simulate random failures for testing
    if (Math.random() < 0.1) {
      throw new Error('External system unavailable');
    }
  }

  // Convenience method for common event types
  async logUserAction(action: string, entityType: string, entityId: string, changes?: Record<string, any>): Promise<AuditEvent> {
    return this.logEvent({
      eventType: `user.${action}` as AuditEventType,
      entityType,
      entityId,
      changes,
      metadata: { source: 'user_action' }
    });
  }

  async logSystemEvent(eventType: AuditEventType, entityType: string, entityId: string, metadata?: Record<string, any>): Promise<AuditEvent> {
    return this.logEvent({
      eventType,
      entityType,
      entityId,
      metadata: { source: 'system', ...metadata }
    });
  }
}

export const auditService = new AuditService();