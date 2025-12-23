import { BaseEventSchema, getEventSchema, EventName } from './contracts';
import { logger } from '@/infra/logger';
import { metrics } from '@/infra/metrics';

// Mock Prisma client - replace with actual prisma import
interface PrismaClient {
  eventOutbox: {
    create: (data: { data: any }) => Promise<any>;
    findFirst: (query: any) => Promise<any>;
  };
}

// This would be your actual prisma client
let prisma: PrismaClient;

// Initialize prisma client (you'll need to import your actual client)
export function initEventSystem(client: PrismaClient) {
  prisma = client;
}

export interface EmitEventInput {
  name: EventName;
  version: number;
  payload: Record<string, any>;
  dedupKey?: string;
  source?: string;
}

export class EventEmitter {
  private static instance: EventEmitter;
  
  static getInstance(): EventEmitter {
    if (!EventEmitter.instance) {
      EventEmitter.instance = new EventEmitter();
    }
    return EventEmitter.instance;
  }

  async emit(input: EmitEventInput): Promise<string> {
    const startTime = Date.now();
    
    try {
      // Validate base event structure
      const baseEvent = BaseEventSchema.parse({
        name: input.name,
        version: input.version,
        payload: input.payload,
        dedupKey: input.dedupKey,
        source: input.source,
      });

      // Validate payload against specific event contract
      const schema = getEventSchema(input.name, input.version);
      const validatedPayload = schema.parse(input.payload);

      // Check for duplicate if dedupKey provided
      if (input.dedupKey) {
        const existing = await prisma.eventOutbox.findFirst({
          where: { dedupKey: input.dedupKey }
        });
        
        if (existing) {
          logger.warn({
            msg: 'Duplicate event ignored',
            eventName: input.name,
            dedupKey: input.dedupKey,
          });
          
          metrics.counter('events_duplicate_total', {
            event_name: input.name,
            version: input.version.toString(),
          }).inc();
          
          return existing.id;
        }
      }

      // Store in outbox
      const outboxEntry = await prisma.eventOutbox.create({
        data: {
          eventName: input.name,
          eventVersion: input.version,
          payload: validatedPayload,
          dedupKey: input.dedupKey,
          status: 'pending',
          retryCount: 0,
          maxRetries: 3,
        }
      });

      logger.info({
        msg: 'Event emitted to outbox',
        eventId: outboxEntry.id,
        eventName: input.name,
        version: input.version,
        dedupKey: input.dedupKey,
      });

      // Metrics
      metrics.counter('events_emitted_total', {
        event_name: input.name,
        version: input.version.toString(),
      }).inc();

      metrics.histogram('event_emit_duration_ms', {
        event_name: input.name,
      }).observe(Date.now() - startTime);

      return outboxEntry.id;

    } catch (error) {
      logger.error({
        msg: 'Failed to emit event',
        eventName: input.name,
        error: error instanceof Error ? error.message : 'Unknown error',
        payload: input.payload,
      });

      metrics.counter('events_emit_errors_total', {
        event_name: input.name,
        error_type: error instanceof Error ? error.constructor.name : 'unknown',
      }).inc();

      throw error;
    }
  }

  // Convenient method for type-safe event emission
  async emitTyped<TName extends EventName>(
    name: TName,
    version: number,
    payload: any, // This would be properly typed in a real implementation
    options?: { dedupKey?: string; source?: string }
  ): Promise<string> {
    return this.emit({
      name,
      version,
      payload,
      dedupKey: options?.dedupKey,
      source: options?.source,
    });
  }
}

// Global emitter instance
export const eventEmitter = EventEmitter.getInstance();

// Convenience function
export async function emitEvent(input: EmitEventInput): Promise<string> {
  return eventEmitter.emit(input);
}

// Type-safe emitters for common events
export const culturalEvents = {
  async impactMeasured(payload: any, dedupKey?: string) {
    return eventEmitter.emitTyped('CulturalImpactMeasured', 1, payload, { dedupKey });
  },
  
  async brandIdentityUpdated(payload: any, dedupKey?: string) {
    return eventEmitter.emitTyped('BrandIdentityUpdated', 1, payload, { dedupKey });
  },
};

export const projectEvents = {
  async created(payload: any, dedupKey?: string) {
    return eventEmitter.emitTyped('ProjectCreated', 1, payload, { dedupKey });
  },
  
  async statusChanged(payload: any, dedupKey?: string) {
    return eventEmitter.emitTyped('ProjectStatusChanged', 1, payload, { dedupKey });
  },
  
  async taskCompleted(payload: any, dedupKey?: string) {
    return eventEmitter.emitTyped('TaskCompleted', 1, payload, { dedupKey });
  },
};

export const hrEvents = {
  async employeeOnboarded(payload: any, dedupKey?: string) {
    return eventEmitter.emitTyped('EmployeeOnboarded', 1, payload, { dedupKey });
  },
  
  async performanceReviewCompleted(payload: any, dedupKey?: string) {
    return eventEmitter.emitTyped('PerformanceReviewCompleted', 1, payload, { dedupKey });
  },
};
