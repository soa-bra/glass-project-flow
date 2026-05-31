#!/usr/bin/env tsx

import { logger } from "../src/infra/logger";

interface PrismaClient {
  eventDLQ: {
    findMany: (query: unknown) => Promise<any[]>;
    update: (query: unknown) => Promise<unknown>;
  };
  eventOutbox: {
    create: (query: unknown) => Promise<unknown>;
  };
}

let prisma: PrismaClient;

export function initReplayTool(client: PrismaClient): void {
  prisma = client;
}

export interface ReplayOptions {
  eventName?: string;
  limit?: number;
  dryRun?: boolean;
}

export async function replayFromDLQ(options: ReplayOptions = {}): Promise<number> {
  const limit = options.limit ?? 100;
  const dryRun = options.dryRun ?? false;

  const candidates = await prisma.eventDLQ.findMany({
    where: {
      replayedAt: null,
      ...(options.eventName ? { eventName: options.eventName } : {}),
    },
    orderBy: { createdAt: "asc" },
    take: limit,
  });

  if (!candidates.length) {
    logger.info({ msg: "No DLQ events available for replay" });
    return 0;
  }

  let replayed = 0;

  for (const item of candidates) {
    if (dryRun) {
      logger.info({
        msg: "Dry-run replay candidate",
        dlqId: item.id,
        eventName: item.eventName,
        retryTier: item.retryTier,
      });
      replayed += 1;
      continue;
    }

    await prisma.eventOutbox.create({
      data: {
        eventName: item.eventName,
        eventVersion: item.eventVersion,
        payload: item.payload,
        dedupKey: item.dedupKey,
        idempotencyKey: item.idempotencyKey ?? item.dedupKey,
        status: "pending",
        retryCount: 0,
        maxRetries: 3,
        retryTier: item.retryTier ?? "standard",
      },
    });

    await prisma.eventDLQ.update({
      where: { id: item.id },
      data: {
        replayedAt: new Date(),
        replayStatus: "queued",
      },
    });

    replayed += 1;
  }

  logger.info({
    msg: "DLQ replay complete",
    replayed,
    dryRun,
    filterEventName: options.eventName,
  });

  return replayed;
}

if (require.main === module) {
  const eventName = process.argv.find((arg) => arg.startsWith("--event="))?.split("=")[1];
  const limitArg = process.argv.find((arg) => arg.startsWith("--limit="))?.split("=")[1];
  const dryRun = process.argv.includes("--dry-run");

  replayFromDLQ({
    eventName,
    limit: limitArg ? Number(limitArg) : undefined,
    dryRun,
  }).catch((error) => {
    logger.error({
      msg: "Replay command failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
    process.exit(1);
  });
}
