#!/usr/bin/env tsx

import { logger } from "../src/infra/logger";
import { metrics } from "../src/infra/metrics";
import { handlerRegistry } from "../src/shared/events/handlers";

type RetryTier = "fast" | "standard" | "critical";

interface OutboxEvent {
  id: string;
  eventName: string;
  eventVersion: number;
  payload: Record<string, unknown>;
  dedupKey?: string;
  idempotencyKey?: string;
  status: "pending" | "failed" | "sent";
  retryCount: number;
  maxRetries: number;
  retryTier?: RetryTier;
  nextRetryAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

interface PrismaClient {
  eventOutbox: {
    findMany: (query: unknown) => Promise<OutboxEvent[]>;
    update: (query: unknown) => Promise<unknown>;
    delete: (query: unknown) => Promise<unknown>;
  };
  eventDLQ: {
    create: (data: { data: Record<string, unknown> }) => Promise<unknown>;
  };
}

let prisma: PrismaClient;

const RETRY_TIER_CONFIG: Record<RetryTier, { maxRetries: number; scheduleMs: number[] }> = {
  fast: {
    maxRetries: 3,
    scheduleMs: [5_000, 15_000, 60_000],
  },
  standard: {
    maxRetries: 6,
    scheduleMs: [10_000, 30_000, 60_000, 300_000, 900_000, 3_600_000],
  },
  critical: {
    maxRetries: 10,
    scheduleMs: [5_000, 10_000, 30_000, 60_000, 120_000, 300_000, 600_000, 1_800_000, 3_600_000, 7_200_000],
  },
};

export function initOutboxRelay(client: PrismaClient): void {
  prisma = client;
}

export class OutboxRelay {
  private isRunning = false;

  constructor(
    private readonly options: {
      intervalMs?: number;
      batchSize?: number;
    } = {},
  ) {}

  async start(): Promise<void> {
    if (this.isRunning) {
      logger.warn({ msg: "Outbox relay already running" });
      return;
    }

    this.isRunning = true;
    logger.info({
      msg: "Starting outbox relay",
      intervalMs: this.intervalMs,
      batchSize: this.batchSize,
    });

    while (this.isRunning) {
      try {
        await this.processBatch();
        await this.sleep(this.intervalMs);
      } catch (error) {
        logger.error({
          msg: "Outbox relay loop error",
          error: error instanceof Error ? error.message : "Unknown error",
        });
        await this.sleep(this.intervalMs * 2);
      }
    }
  }

  stop(): void {
    this.isRunning = false;
    logger.info({ msg: "Stopping outbox relay" });
  }

  private get intervalMs(): number {
    return this.options.intervalMs ?? 5000;
  }

  private get batchSize(): number {
    return this.options.batchSize ?? 10;
  }

  private async processBatch(): Promise<void> {
    const startedAt = Date.now();

    const events = await prisma.eventOutbox.findMany({
      where: {
        OR: [
          { status: "pending" },
          {
            status: "failed",
            nextRetryAt: { lte: new Date() },
          },
        ],
      },
      orderBy: { createdAt: "asc" },
      take: this.batchSize,
    });

    if (!events.length) {
      return;
    }

    logger.debug({ msg: "Processing outbox batch", count: events.length });

    const result = await Promise.allSettled(events.map((event) => this.processEvent(event)));
    const successful = result.filter((x) => x.status === "fulfilled").length;
    const failed = result.length - successful;

    metrics.outboxEventsTotal.inc({ status: "processed" }, events.length);

    logger.info({
      msg: "Outbox batch processed",
      total: events.length,
      successful,
      failed,
      durationMs: Date.now() - startedAt,
    });
  }

  private async processEvent(event: OutboxEvent): Promise<void> {
    const idempotencyKey = event.idempotencyKey ?? event.dedupKey;
    try {
      await handlerRegistry.handle(event.eventName as never, event.eventVersion, event.payload, {
        eventId: event.id,
        timestamp: event.createdAt,
        source: "SoaBra-system",
        dedupKey: idempotencyKey,
      });

      await prisma.eventOutbox.update({
        where: { id: event.id },
        data: {
          status: "sent",
          sentAt: new Date(),
          idempotencyKey,
        },
      });

      metrics.eventsProcessedTotal.inc({
        event_name: event.eventName,
        version: String(event.eventVersion),
        status: "sent",
      });
    } catch (error) {
      await this.handleFailure(event, error);
    }
  }

  private async handleFailure(event: OutboxEvent, error: unknown): Promise<void> {
    const tier = event.retryTier ?? "standard";
    const newRetryCount = event.retryCount + 1;
    const maxRetries = Math.max(event.maxRetries, RETRY_TIER_CONFIG[tier].maxRetries);
    const reachedMax = newRetryCount >= maxRetries;

    logger.error({
      msg: "Outbox event failed",
      eventId: event.id,
      eventName: event.eventName,
      retryTier: tier,
      retryCount: newRetryCount,
      maxRetries,
      error: error instanceof Error ? error.message : "Unknown error",
    });

    metrics.outboxRetryTotal.inc({
      event_name: event.eventName,
      retry_count: String(newRetryCount),
    });

    if (reachedMax) {
      await this.moveToDLQ(event, error, tier, newRetryCount);
      await prisma.eventOutbox.delete({ where: { id: event.id } });
      return;
    }

    const nextRetryAt = new Date(Date.now() + this.calculateBackoffMs(tier, newRetryCount));
    await prisma.eventOutbox.update({
      where: { id: event.id },
      data: {
        status: "failed",
        retryCount: newRetryCount,
        retryTier: tier,
        nextRetryAt,
      },
    });
  }

  private calculateBackoffMs(tier: RetryTier, retryCount: number): number {
    const offsets = RETRY_TIER_CONFIG[tier].scheduleMs;
    return offsets[Math.min(offsets.length - 1, retryCount - 1)] ?? offsets[offsets.length - 1];
  }

  private async moveToDLQ(
    event: OutboxEvent,
    error: unknown,
    retryTier: RetryTier,
    retryCount: number,
  ): Promise<void> {
    await prisma.eventDLQ.create({
      data: {
        eventName: event.eventName,
        eventVersion: event.eventVersion,
        payload: event.payload,
        dedupKey: event.dedupKey,
        idempotencyKey: event.idempotencyKey ?? event.dedupKey,
        retryTier,
        retryCount,
        reason: error instanceof Error ? error.message : "Unknown error",
        failedAt: new Date(),
      },
    });

    metrics.outboxDlqTotal.inc({
      event_name: event.eventName,
      reason: "max_retries_exhausted",
    });
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

if (require.main === module) {
  const relay = new OutboxRelay({
    intervalMs: Number(process.env.OUTBOX_INTERVAL_MS ?? "5000"),
    batchSize: Number(process.env.OUTBOX_BATCH_SIZE ?? "10"),
  });

  process.on("SIGINT", () => {
    relay.stop();
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    relay.stop();
    process.exit(0);
  });

  relay.start().catch((error) => {
    logger.fatal({
      msg: "Failed to start outbox relay",
      error: error instanceof Error ? error.message : "Unknown error",
    });
    process.exit(1);
  });
}
