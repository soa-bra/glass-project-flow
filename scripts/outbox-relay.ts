#!/usr/bin/env tsx

import { logger } from '../src/infra/logger';
import { metrics } from '../src/infra/metrics';
import { handlerRegistry } from '../src/core/events/handlers';

// Mock Prisma client - replace with actual prisma import
interface PrismaClient {
  eventOutbox: {
    findMany: (query: any) => Promise<any[]>;
    update: (query: any) => Promise<any>;
    delete: (query: any) => Promise<any>;
  };
  eventDLQ: {
    create: (data: { data: any }) => Promise<any>;
  };
}

// This would be your actual prisma client
let prisma: PrismaClient;

export class OutboxRelay {
  private isRunning = false;
  private intervalMs: number;
  private batchSize: number;
  
  constructor(options: {
    intervalMs?: number;
    batchSize?: number;
  } = {}) {
    this.intervalMs = options.intervalMs || 5000; // 5 seconds
    this.batchSize = options.batchSize || 10;
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      logger.warn({ msg: 'Outbox relay already running' });
      return;
    }

    this.isRunning = true;
    logger.info({ 
      msg: 'Starting outbox relay',
      intervalMs: this.intervalMs,
      batchSize: this.batchSize,
    });

    while (this.isRunning) {
      try {
        await this.processBatch();
        await this.sleep(this.intervalMs);
      } catch (error) {
        logger.error({
          msg: 'Outbox relay error',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        
        // Back off on error
        await this.sleep(this.intervalMs * 2);
      }
    }
  }

  stop(): void {
    logger.info({ msg: 'Stopping outbox relay' });
    this.isRunning = false;
  }

  private async processBatch(): Promise<void> {
    const startTime = Date.now();
    
    // Get pending events ready for processing
    const events = await prisma.eventOutbox.findMany({
      where: {
        OR: [
          { status: 'pending' },
          {
            status: 'failed',
            retryCount: { lt: 5 },
            nextRetryAt: { lte: new Date() }
          }
        ]
      },
      orderBy: { createdAt: 'asc' },
      take: this.batchSize,
    });

    if (events.length === 0) {
      return;
    }

    logger.debug({
      msg: 'Processing outbox batch',
      eventCount: events.length,
    });

    const results = await Promise.allSettled(
      events.map(event => this.processEvent(event))
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    logger.info({
      msg: 'Outbox batch processed',
      total: events.length,
      successful,
      failed,
      durationMs: Date.now() - startTime,
    });

    metrics.counter('outbox_events_processed_total').inc(events.length);
    metrics.counter('outbox_events_successful_total').inc(successful);
    metrics.counter('outbox_events_failed_total').inc(failed);
    metrics.histogram('outbox_batch_duration_ms').observe(Date.now() - startTime);
  }

  private async processEvent(event: any): Promise<void> {
    const startTime = Date.now();
    
    try {
      logger.debug({
        msg: 'Processing outbox event',
        eventId: event.id,
        eventName: event.eventName,
        retryCount: event.retryCount,
      });

      // Execute handlers
      await handlerRegistry.handle(
        event.eventName,
        event.eventVersion,
        event.payload,
        {
          eventId: event.id,
          timestamp: event.createdAt,
          source: 'supra-system',
          dedupKey: event.dedupKey,
        }
      );

      // Mark as sent
      await prisma.eventOutbox.update({
        where: { id: event.id },
        data: {
          status: 'sent',
          sentAt: new Date(),
        }
      });

      metrics.histogram('outbox_event_duration_ms', {
        event_name: event.eventName,
      }).observe(Date.now() - startTime);

      logger.debug({
        msg: 'Outbox event processed successfully',
        eventId: event.id,
        eventName: event.eventName,
        durationMs: Date.now() - startTime,
      });

    } catch (error) {
      await this.handleEventFailure(event, error);
    }
  }

  private async handleEventFailure(event: any, error: any): Promise<void> {
    const newRetryCount = event.retryCount + 1;
    const maxRetries = 5;
    const isMaxRetriesReached = newRetryCount >= maxRetries;

    logger.error({
      msg: 'Outbox event processing failed',
      eventId: event.id,
      eventName: event.eventName,
      retryCount: newRetryCount,
      maxRetries,
      isMaxRetriesReached,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    if (isMaxRetriesReached) {
      // Move to DLQ
      await this.moveToDeadLetterQueue(event, error);
      
      // Delete from outbox
      await prisma.eventOutbox.delete({
        where: { id: event.id }
      });
      
      metrics.counter('outbox_events_dlq_total', {
        event_name: event.eventName,
      }).inc();
      
    } else {
      // Schedule retry with exponential backoff
      const backoffMs = Math.min(
        1000 * Math.pow(2, newRetryCount), // Exponential backoff
        300000 // Max 5 minutes
      );
      
      const nextRetryAt = new Date(Date.now() + backoffMs);
      
      await prisma.eventOutbox.update({
        where: { id: event.id },
        data: {
          status: 'failed',
          retryCount: newRetryCount,
          nextRetryAt,
        }
      });
      
      logger.info({
        msg: 'Event scheduled for retry',
        eventId: event.id,
        nextRetryAt,
        backoffMs,
      });
    }

    metrics.counter('outbox_events_retry_total', {
      event_name: event.eventName,
      retry_count: newRetryCount.toString(),
    }).inc();
  }

  private async moveToDeadLetterQueue(event: any, error: any): Promise<void> {
    await prisma.eventDLQ.create({
      data: {
        eventName: event.eventName,
        eventVersion: event.eventVersion,
        payload: event.payload,
        dedupKey: event.dedupKey,
        reason: error instanceof Error ? error.message : 'Unknown error',
        retryCount: event.retryCount,
      }
    });

    logger.warn({
      msg: 'Event moved to dead letter queue',
      eventId: event.id,
      eventName: event.eventName,
      retryCount: event.retryCount,
    });
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// CLI execution
if (require.main === module) {
  const relay = new OutboxRelay({
    intervalMs: parseInt(process.env.OUTBOX_INTERVAL_MS || '5000'),
    batchSize: parseInt(process.env.OUTBOX_BATCH_SIZE || '10'),
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    logger.info({ msg: 'Received SIGINT, shutting down gracefully' });
    relay.stop();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    logger.info({ msg: 'Received SIGTERM, shutting down gracefully' });
    relay.stop();
    process.exit(0);
  });

  // Start the relay
  relay.start().catch(error => {
    logger.fatal({
      msg: 'Failed to start outbox relay',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    process.exit(1);
  });
}

