// Performance Telemetry Tracker
import { supabase } from '@/lib/supabase/client';

export interface PerformanceMetrics {
  fps: number;
  latency: number;
  docSize: number;
  memoryUsage: number;
  renderTime: number;
}

export interface TelemetryEvent {
  event_type: string;
  metadata: Record<string, any>;
  session_id?: string;
  board_id?: string;
  project_id?: string;
}

class PerformanceTelemetry {
  private static instance: PerformanceTelemetry;
  private sessionId: string;
  private frameCount = 0;
  private lastFpsCheck = performance.now();
  private currentFps = 60;
  private isTracking = false;

  constructor() {
    this.sessionId = crypto.randomUUID();
    this.initializePerformanceObserver();
  }

  static getInstance(): PerformanceTelemetry {
    if (!PerformanceTelemetry.instance) {
      PerformanceTelemetry.instance = new PerformanceTelemetry();
    }
    return PerformanceTelemetry.instance;
  }

  private initializePerformanceObserver() {
    // FPS tracking
    const trackFps = () => {
      this.frameCount++;
      const now = performance.now();
      if (now - this.lastFpsCheck >= 1000) {
        this.currentFps = Math.round(this.frameCount * 1000 / (now - this.lastFpsCheck));
        this.frameCount = 0;
        this.lastFpsCheck = now;
      }
      if (this.isTracking) {
        requestAnimationFrame(trackFps);
      }
    };

    // Performance Observer for timing data
    if ('PerformanceObserver' in window) {
      const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'measure' || entry.entryType === 'navigation') {
            this.logPerformanceEvent('performance_measure', {
              name: entry.name,
              duration: entry.duration,
              startTime: entry.startTime,
            });
          }
        }
      });
      perfObserver.observe({ entryTypes: ['measure', 'navigation'] });
    }

    this.startTracking();
    trackFps();
  }

  startTracking() {
    this.isTracking = true;
  }

  stopTracking() {
    this.isTracking = false;
  }

  async logTelemetryEvent(event: TelemetryEvent) {
    try {
      const { error } = await supabase.from('telemetry_events').insert({
        event_type: event.event_type,
        metadata: event.metadata,
        session_id: this.sessionId,
        board_id: event.board_id,
        project_id: event.project_id,
        user_agent: navigator.userAgent,
      });

      if (error) {
        console.warn('Failed to log telemetry event:', error);
      }
    } catch (error) {
      console.warn('Telemetry error:', error);
    }
  }

  async logPerformanceMetrics(boardId?: string, projectId?: string) {
    const metrics = this.getCurrentMetrics();
    
    await this.logTelemetryEvent({
      event_type: 'performance_metrics',
      metadata: metrics,
      board_id: boardId,
      project_id: projectId,
    });
  }

  async logCanvasOperation(operation: string, metadata: Record<string, any>, boardId?: string) {
    await this.logTelemetryEvent({
      event_type: `canvas_${operation}`,
      metadata: {
        ...metadata,
        timestamp: Date.now(),
      },
      board_id: boardId,
    });
  }

  async logWF01Event(action: string, metadata: Record<string, any>, boardId?: string, projectId?: string) {
    await this.logTelemetryEvent({
      event_type: `wf01_${action}`,
      metadata: {
        ...metadata,
        timestamp: Date.now(),
      },
      board_id: boardId,
      project_id: projectId,
    });
  }

  async logLinkEvent(action: string, metadata: Record<string, any>, boardId?: string) {
    await this.logTelemetryEvent({
      event_type: `link_${action}`,
      metadata: {
        ...metadata,
        timestamp: Date.now(),
      },
      board_id: boardId,
    });
  }

  private logPerformanceEvent(type: string, data: Record<string, any>) {
    this.logTelemetryEvent({
      event_type: type,
      metadata: data,
    });
  }

  getCurrentMetrics(): PerformanceMetrics {
    const memory = (performance as any).memory;
    
    return {
      fps: this.currentFps,
      latency: this.measureLatency(),
      docSize: this.getDocumentSize(),
      memoryUsage: memory ? memory.usedJSHeapSize : 0,
      renderTime: performance.now(),
    };
  }

  private measureLatency(): number {
    const start = performance.now();
    // Simulate small operation
    for (let i = 0; i < 1000; i++) {
      Math.random();
    }
    return performance.now() - start;
  }

  private getDocumentSize(): number {
    const serializer = new XMLSerializer();
    const docString = serializer.serializeToString(document);
    return new Blob([docString]).size;
  }

  // Batch reporting every 30 seconds
  startPeriodicReporting(boardId?: string, projectId?: string) {
    setInterval(() => {
      this.logPerformanceMetrics(boardId, projectId);
    }, 30000);
  }
}

export const telemetry = PerformanceTelemetry.getInstance();