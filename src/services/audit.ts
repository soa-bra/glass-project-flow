/**
 * Legacy Audit Service Bridge — يحوّل الواجهة القديمة إلى `central/audit.service.ts`
 * الذي يكتب/يقرأ من جدول `public.audit_events` الحقيقي.
 *
 * تم إزالة `mockAuditEvents` (P3 — DoD: لا mock في production).
 */
import type {
  AuditEvent,
  AuditQuery,
  AuditStats,
  CreateAuditEvent,
  AuditEventType,
} from '@/types/audit';
import { AuditService as CentralAudit } from '@/services/central/audit.service';

type CentralRow = Awaited<ReturnType<typeof CentralAudit.query>>[number];

const toLegacy = (row: CentralRow): AuditEvent => ({
  id: row.id,
  eventType: (row.action as AuditEventType) ?? 'system.info',
  entityType: row.resource_type,
  entityId: row.resource_id ?? '',
  userId: row.actor_id ?? undefined,
  metadata: (row.metadata as Record<string, any>) ?? undefined,
  timestamp: row.created_at,
});

export class AuditService {
  async logEvent(event: CreateAuditEvent): Promise<AuditEvent> {
    await CentralAudit.log({
      action: event.eventType,
      resource_type: event.entityType,
      resource_id: event.entityId || null,
      metadata: { ...(event.changes ?? {}), ...(event.metadata ?? {}) },
    });
    return {
      id: 'pending', // حقيقي: يُكتب من DB، لا نملك id محلي
      eventType: event.eventType,
      entityType: event.entityType,
      entityId: event.entityId,
      changes: event.changes,
      metadata: event.metadata,
      timestamp: new Date().toISOString(),
    };
  }

  async queryEvents(query: AuditQuery): Promise<AuditEvent[]> {
    const rows = await CentralAudit.query({
      resource_type: query.entityType,
      action: query.eventTypes?.[0],
      actor_id: query.userId,
      limit: query.limit ?? 50,
    });
    let mapped = rows.map(toLegacy);
    if (query.entityId) mapped = mapped.filter((e) => e.entityId === query.entityId);
    if (query.startDate) mapped = mapped.filter((e) => e.timestamp >= query.startDate!);
    if (query.endDate) mapped = mapped.filter((e) => e.timestamp <= query.endDate!);
    const offset = query.offset ?? 0;
    return mapped.slice(offset, offset + (query.limit ?? 50));
  }

  async getStats(): Promise<AuditStats> {
    const rows = await CentralAudit.query({ limit: 500 });
    const eventsByType = rows.reduce((acc, r) => {
      const k = (r.action as AuditEventType) ?? 'system.info';
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {} as Record<AuditEventType, number>);

    const userCounts = rows.reduce((acc, r) => {
      if (r.actor_id) acc[r.actor_id] = (acc[r.actor_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topUsers = Object.entries(userCounts)
      .map(([userId, count]) => ({ userId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const recentEvents = rows.filter((r) => new Date(r.created_at).getTime() > oneDayAgo).length;

    return {
      totalEvents: rows.length,
      recentEvents,
      failedEvents: 0, // يُحسب الآن من event_dlq عبر AuditCenterPanel
      eventsByType,
      topUsers,
    };
  }

  // المعالجة الفعلية للـ outbox تتم عبر Edge Function `outbox-relay` (P4).
  async processOutboxEvents(): Promise<void> {
    // no-op: تُجدول عبر pg_cron منذ P4.
  }

  async logUserAction(
    action: string,
    entityType: string,
    entityId: string,
    changes?: Record<string, any>,
  ): Promise<AuditEvent> {
    return this.logEvent({
      eventType: `user.${action}` as AuditEventType,
      entityType,
      entityId,
      changes,
      metadata: { source: 'user_action' },
    });
  }

  async logSystemEvent(
    eventType: AuditEventType,
    entityType: string,
    entityId: string,
    metadata?: Record<string, any>,
  ): Promise<AuditEvent> {
    return this.logEvent({
      eventType,
      entityType,
      entityId,
      metadata: { source: 'system', ...metadata },
    });
  }
}

export const auditService = new AuditService();
