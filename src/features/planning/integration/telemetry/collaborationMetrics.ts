import { metrics } from '@/infra/metrics';
import {
  calculateErrorBudgetSnapshot,
  ErrorBudgetSnapshot,
  ErrorBudgetWindow,
} from './sloTargets';

export type CollaborationOperation =
  | 'sync_event'
  | 'sync_batch'
  | 'command_apply'
  | 'command_validate';

const toSeconds = (durationMs: number) => durationMs / 1000;

export const observeBoardSync = (params: {
  operation: CollaborationOperation;
  durationMs: number;
  success: boolean;
}) => {
  const result = params.success ? 'success' : 'error';
  metrics.boardSyncOperationsTotal.inc({ operation: params.operation, result });
  metrics.boardSyncLatencySeconds.observe(
    { operation: params.operation, result },
    toSeconds(params.durationMs),
  );

  if (!params.success) {
    metrics.boardSyncErrorsTotal.inc({ operation: params.operation });
  }
};

export const observeDomainCommand = (params: {
  commandName: string;
  durationMs: number;
  success: boolean;
}) => {
  const result = params.success ? 'success' : 'error';
  metrics.domainCommandsTotal.inc({ command_name: params.commandName, result });
  metrics.domainCommandDurationSeconds.observe(
    { command_name: params.commandName, result },
    toSeconds(params.durationMs),
  );
};

export const setDomainCommandQueueDepth = (queueDepth: number) => {
  metrics.domainCommandQueueDepth.set({ queue: 'planning-domain-commands' }, queueDepth);
};

export const recordErrorBudgetSnapshot = (params: {
  objective: string;
  totalRequests: number;
  errorRequests: number;
  burnRate: Record<ErrorBudgetWindow, number>;
}): ErrorBudgetSnapshot => {
  const snapshot = calculateErrorBudgetSnapshot(params);

  metrics.errorBudgetRemainingPercent.set(
    { objective: params.objective },
    snapshot.remainingBudgetPercent,
  );

  (Object.entries(snapshot.burnRate) as Array<[ErrorBudgetWindow, number]>).forEach(
    ([window, burnRate]) => {
      metrics.errorBudgetBurnRate.set(
        { objective: params.objective, window },
        burnRate,
      );
    },
  );

  return snapshot;
};
