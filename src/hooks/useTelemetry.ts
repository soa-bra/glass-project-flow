// Telemetry React Hook
import { useEffect, useCallback } from 'react';
import { telemetry } from '@/lib/telemetry/performance-tracker';

export interface UseTelemetryOptions {
  boardId?: string;
  projectId?: string;
  enablePeriodicReporting?: boolean;
}

export function useTelemetry(options: UseTelemetryOptions = {}) {
  const { boardId, projectId, enablePeriodicReporting = true } = options;

  useEffect(() => {
    if (enablePeriodicReporting) {
      telemetry.startPeriodicReporting(boardId, projectId);
    }
  }, [boardId, projectId, enablePeriodicReporting]);

  const logCanvasOperation = useCallback((operation: string, metadata: Record<string, any>) => {
    telemetry.logCanvasOperation(operation, metadata, boardId);
  }, [boardId]);

  const logWF01Event = useCallback((action: string, metadata: Record<string, any>) => {
    telemetry.logWF01Event(action, metadata, boardId, projectId);
  }, [boardId, projectId]);

  const logLinkEvent = useCallback((action: string, metadata: Record<string, any>) => {
    telemetry.logLinkEvent(action, metadata, boardId);
  }, [boardId]);

  const logCustomEvent = useCallback((eventType: string, metadata: Record<string, any>) => {
    telemetry.logTelemetryEvent({
      event_type: eventType,
      metadata,
      board_id: boardId,
      project_id: projectId,
    });
  }, [boardId, projectId]);

  return {
    logCanvasOperation,
    logWF01Event,
    logLinkEvent,
    logCustomEvent,
    getCurrentMetrics: () => telemetry.getCurrentMetrics(),
  };
}