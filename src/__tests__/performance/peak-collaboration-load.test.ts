import { describe, expect, it } from 'vitest';
import { processDomainCommand } from '@/features/planning/domain/commands/commandProcessor';
import {
  collaborationSloTargets,
  calculateErrorBudgetSnapshot,
  errorBudgetPolicy,
} from '@/features/planning/integration/telemetry/sloTargets';
import { observeBoardSync } from '@/features/planning/integration/telemetry/collaborationMetrics';

const percentile = (values: number[], p: number): number => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[index];
};

describe('Peak collaboration load suite', () => {
  it('keeps board sync and domain commands under p50/p95 targets during peak bursts', async () => {
    const boardSyncDurations: number[] = [];
    const commandDurations: number[] = [];

    const peakOperations = 450;

    await Promise.all(
      Array.from({ length: peakOperations }, async (_, index) => {
        const boardSyncDurationMs = 50 + (index % 80) * 2;
        boardSyncDurations.push(boardSyncDurationMs);
        observeBoardSync({
          operation: index % 7 === 0 ? 'sync_batch' : 'sync_event',
          durationMs: boardSyncDurationMs,
          success: index % 37 !== 0,
        });

        const result = await processDomainCommand(
          {
            id: `cmd-${index}`,
            name: index % 5 === 0 ? 'moveElement' : 'updateElement',
            payload: { index },
          },
          async () => {
            const syntheticDelay = 4 + (index % 40);
            await new Promise(resolve => setTimeout(resolve, syntheticDelay / 10));
            return { ok: true, syntheticDelay };
          },
          Math.max(0, peakOperations - index),
        );

        commandDurations.push(result.durationMs);
      }),
    );

    const boardSyncP50 = percentile(boardSyncDurations, 50);
    const boardSyncP95 = percentile(boardSyncDurations, 95);
    const commandP50 = percentile(commandDurations, 50);
    const commandP95 = percentile(commandDurations, 95);

    expect(boardSyncP50).toBeLessThanOrEqual(collaborationSloTargets.boardSyncLatency.p50Ms);
    expect(boardSyncP95).toBeLessThanOrEqual(collaborationSloTargets.boardSyncLatency.p95Ms);
    expect(commandP50).toBeLessThanOrEqual(collaborationSloTargets.domainCommandProcessing.p50Ms);
    expect(commandP95).toBeLessThanOrEqual(collaborationSloTargets.domainCommandProcessing.p95Ms);
  });

  it('tracks error budget exhaustion risk for high-error peaks', () => {
    const snapshot = calculateErrorBudgetSnapshot({
      objective: 'collaboration-availability',
      totalRequests: 200_000,
      errorRequests: 350,
      burnRate: {
        '1d': 12,
        '7d': 5,
        '30d': 1.1,
      },
    });

    expect(snapshot.errorRatePercent).toBeGreaterThan(errorBudgetPolicy.monthlyBudgetPercent);
    expect(snapshot.remainingBudgetPercent).toBe(0);
    expect(snapshot.status).toBe('critical');
  });
});
