export type PercentileTarget = {
  p50Ms: number;
  p95Ms: number;
};

export const collaborationSloTargets = {
  boardSyncLatency: {
    p50Ms: 120,
    p95Ms: 350,
  },
  domainCommandProcessing: {
    p50Ms: 15,
    p95Ms: 60,
  },
} as const satisfies Record<string, PercentileTarget>;

export type ErrorBudgetWindow = '30d' | '7d' | '1d';

export const errorBudgetPolicy = {
  availabilityTarget: 99.9,
  monthlyBudgetPercent: 0.1,
  burnRateThresholds: {
    '1d': 10,
    '7d': 4,
    '30d': 1,
  } as const satisfies Record<ErrorBudgetWindow, number>,
} as const;

export interface ErrorBudgetSnapshot {
  objective: string;
  totalRequests: number;
  errorRequests: number;
  errorRatePercent: number;
  remainingBudgetPercent: number;
  burnRate: Record<ErrorBudgetWindow, number>;
  status: 'healthy' | 'warning' | 'critical';
}

export const calculateErrorBudgetSnapshot = (params: {
  objective: string;
  totalRequests: number;
  errorRequests: number;
  burnRate: Record<ErrorBudgetWindow, number>;
}): ErrorBudgetSnapshot => {
  const errorRatePercent =
    params.totalRequests === 0 ? 0 : (params.errorRequests / params.totalRequests) * 100;

  const remainingBudgetPercent = Math.max(
    0,
    errorBudgetPolicy.monthlyBudgetPercent - errorRatePercent,
  );

  const isCritical = Object.entries(params.burnRate).some(
    ([window, burn]) => burn >= errorBudgetPolicy.burnRateThresholds[window as ErrorBudgetWindow],
  );

  const status: ErrorBudgetSnapshot['status'] =
    isCritical || remainingBudgetPercent === 0
      ? 'critical'
      : remainingBudgetPercent < errorBudgetPolicy.monthlyBudgetPercent * 0.5
      ? 'warning'
      : 'healthy';

  return {
    objective: params.objective,
    totalRequests: params.totalRequests,
    errorRequests: params.errorRequests,
    errorRatePercent,
    remainingBudgetPercent,
    burnRate: params.burnRate,
    status,
  };
};
