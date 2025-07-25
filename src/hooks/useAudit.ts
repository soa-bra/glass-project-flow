import { useState, useEffect, useCallback } from 'react';
import { auditService } from '@/services/audit';
import type { 
  AuditEvent, 
  AuditQuery, 
  AuditStats, 
  CreateAuditEvent,
  AuditEventType 
} from '@/types/audit';

export const useAudit = () => {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async (query: AuditQuery = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await auditService.queryEvents(query);
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch audit events');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const data = await auditService.getStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch audit stats');
    }
  }, []);

  const logEvent = useCallback(async (event: CreateAuditEvent) => {
    try {
      const newEvent = await auditService.logEvent(event);
      
      // Add to current events list if it matches any filters
      setEvents(prev => [newEvent, ...prev.slice(0, 49)]); // Keep only latest 50
      
      return newEvent;
    } catch (err) {
      console.error('Failed to log audit event:', err);
      throw err;
    }
  }, []);

  const logUserAction = useCallback(async (
    action: string, 
    entityType: string, 
    entityId: string, 
    changes?: Record<string, any>
  ) => {
    try {
      const event = await auditService.logUserAction(action, entityType, entityId, changes);
      setEvents(prev => [event, ...prev.slice(0, 49)]);
      return event;
    } catch (err) {
      console.error('Failed to log user action:', err);
      throw err;
    }
  }, []);

  const logSystemEvent = useCallback(async (
    eventType: AuditEventType,
    entityType: string,
    entityId: string,
    metadata?: Record<string, any>
  ) => {
    try {
      const event = await auditService.logSystemEvent(eventType, entityType, entityId, metadata);
      setEvents(prev => [event, ...prev.slice(0, 49)]);
      return event;
    } catch (err) {
      console.error('Failed to log system event:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    fetchStats();
  }, [fetchEvents, fetchStats]);

  return {
    events,
    stats,
    loading,
    error,
    actions: {
      fetchEvents,
      fetchStats,
      logEvent,
      logUserAction,
      logSystemEvent,
      refresh: () => {
        fetchEvents();
        fetchStats();
      }
    }
  };
};

// Hook for tracking specific entity events
export const useEntityAudit = (entityType: string, entityId: string) => {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntityEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await auditService.queryEvents({ 
        entityType, 
        entityId,
        limit: 100 
      });
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch entity events');
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId]);

  useEffect(() => {
    if (entityType && entityId) {
      fetchEntityEvents();
    }
  }, [entityType, entityId, fetchEntityEvents]);

  return {
    events,
    loading,
    error,
    refresh: fetchEntityEvents
  };
};