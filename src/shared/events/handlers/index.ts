import { EventName } from '../contracts';
import { logger } from '@/infra/logger';
import { metrics } from '@/infra/metrics';

export interface EventHandler {
  eventName: EventName;
  version: number;
  handler: (payload: any, metadata: EventMetadata) => Promise<void>;
  options?: {
    retries?: number;
    timeout?: number;
    enabled?: boolean;
  };
}

export interface EventMetadata {
  eventId: string;
  timestamp: Date;
  source: string;
  dedupKey?: string;
}

export class EventHandlerRegistry {
  private static instance: EventHandlerRegistry;
  private handlers = new Map<string, EventHandler[]>();
  
  static getInstance(): EventHandlerRegistry {
    if (!EventHandlerRegistry.instance) {
      EventHandlerRegistry.instance = new EventHandlerRegistry();
    }
    return EventHandlerRegistry.instance;
  }

  register(handler: EventHandler): void {
    const key = `${handler.eventName}:${handler.version}`;
    const existing = this.handlers.get(key) || [];
    existing.push(handler);
    this.handlers.set(key, existing);
    
    logger.info({
      msg: 'Event handler registered',
      eventName: handler.eventName,
      version: handler.version,
      handlerCount: existing.length,
    });
  }

  async handle(
    eventName: EventName,
    version: number,
    payload: any,
    metadata: EventMetadata
  ): Promise<void> {
    const key = `${eventName}:${version}`;
    const handlers = this.handlers.get(key) || [];
    
    if (handlers.length === 0) {
      logger.debug({
        msg: 'No handlers found for event',
        eventName,
        version,
        eventId: metadata.eventId,
      });
      return;
    }

    const results = await Promise.allSettled(
      handlers
        .filter(h => h.options?.enabled !== false)
        .map(async (handler) => {
          const startTime = Date.now();
          
          try {
            await Promise.race([
              handler.handler(payload, metadata),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Handler timeout')), 
                handler.options?.timeout || 30000)
              )
            ]);
            
            metrics.counter('event_handler_success_total', {
              event_name: eventName,
              version: version.toString(),
            }).inc();
            
            metrics.histogram('event_handler_duration_ms', {
              event_name: eventName,
            }).observe(Date.now() - startTime);
            
          } catch (error) {
            logger.error({
              msg: 'Event handler failed',
              eventName,
              version,
              eventId: metadata.eventId,
              error: error instanceof Error ? error.message : 'Unknown error',
            });
            
            metrics.counter('event_handler_error_total', {
              event_name: eventName,
              version: version.toString(),
              error_type: error instanceof Error ? error.constructor.name : 'unknown',
            }).inc();
            
            throw error;
          }
        })
    );

    // Log failed handlers
    const failures = results.filter(r => r.status === 'rejected');
    if (failures.length > 0) {
      logger.warn({
        msg: 'Some event handlers failed',
        eventName,
        version,
        eventId: metadata.eventId,
        failureCount: failures.length,
        totalHandlers: handlers.length,
      });
    }
  }

  getHandlers(eventName?: EventName): EventHandler[] {
    if (!eventName) {
      return Array.from(this.handlers.values()).flat();
    }
    
    return Array.from(this.handlers.entries())
      .filter(([key]) => key.startsWith(`${eventName}:`))
      .map(([, handlers]) => handlers)
      .flat();
  }
}

// Global registry instance
export const handlerRegistry = EventHandlerRegistry.getInstance();

// Register built-in handlers
import './handlers/cultural-handlers';
import './handlers/project-handlers';
import './handlers/hr-handlers';
import './handlers/webhook-handlers';

export { handlerRegistry as registry };
