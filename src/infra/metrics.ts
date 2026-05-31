/**
 * Browser-safe metrics shim.
 *
 * The original implementation used `prom-client` which depends on Node.js
 * built-ins (`process`, `zlib`). When bundled for the browser, that import
 * threw `ReferenceError: process is not defined` at module load time and
 * crashed the React tree before it could render — causing a blank page.
 *
 * This module preserves the existing public API (`metrics.<name>.inc/observe/set`,
 * plus the convenience helpers and middleware) but routes everything to no-op
 * stubs in non-Node environments. If a real Node/server context ever needs
 * Prometheus metrics, this module can be replaced with a server-only adapter.
 */

type LabelValues = Record<string, string | number>;

interface CounterStub {
  inc: (labelsOrValue?: LabelValues | number, value?: number) => void;
  labels: (labels?: LabelValues) => CounterStub;
}

interface HistogramStub {
  observe: (labelsOrValue: LabelValues | number, value?: number) => void;
  labels: (labels?: LabelValues) => HistogramStub;
}

interface GaugeStub {
  set: (labelsOrValue: LabelValues | number, value?: number) => void;
  inc: (labelsOrValue?: LabelValues | number, value?: number) => void;
  dec: (labelsOrValue?: LabelValues | number, value?: number) => void;
  labels: (labels?: LabelValues) => GaugeStub;
}

interface SummaryStub {
  observe: (labelsOrValue: LabelValues | number, value?: number) => void;
  labels: (labels?: LabelValues) => SummaryStub;
}

const noop = () => {};

const makeCounter = (): CounterStub => {
  const counter: CounterStub = {
    inc: noop,
    labels: () => counter,
  };
  return counter;
};

const makeHistogram = (): HistogramStub => {
  const histogram: HistogramStub = {
    observe: noop,
    labels: () => histogram,
  };
  return histogram;
};

const makeGauge = (): GaugeStub => {
  const gauge: GaugeStub = {
    set: noop,
    inc: noop,
    dec: noop,
    labels: () => gauge,
  };
  return gauge;
};

const makeSummary = (): SummaryStub => {
  const summary: SummaryStub = {
    observe: noop,
    labels: () => summary,
  };
  return summary;
};

// Generic helpers used in some call sites: metrics.counter('name', labels).inc()
const counterFactory = (_name: string, _labels?: LabelValues) => makeCounter();
const histogramFactory = (_name: string, _labels?: LabelValues) => makeHistogram();
const gaugeFactory = (_name: string, _labels?: LabelValues) => makeGauge();

export const metrics = {
  // HTTP metrics
  httpRequestsTotal: makeCounter(),
  httpRequestDuration: makeHistogram(),

  // Event system metrics
  eventsEmittedTotal: makeCounter(),
  eventsProcessedTotal: makeCounter(),
  eventProcessingDuration: makeHistogram(),
  eventHandlerErrorsTotal: makeCounter(),

  // Outbox metrics
  outboxEventsTotal: makeCounter(),
  outboxRetryTotal: makeCounter(),
  outboxDlqTotal: makeCounter(),

  // Database metrics
  dbQueryDuration: makeHistogram(),
  dbConnectionsActive: makeGauge(),
  dbConnectionsIdle: makeGauge(),

  // Business metrics
  projectsActiveTotal: makeGauge(),
  clientsActiveTotal: makeGauge(),
  employeesTotal: makeGauge(),
  culturalImpactMeasurements: makeCounter(),

  // Performance metrics
  responseTime95th: makeSummary(),
  errorRate: makeGauge(),

  // Cache metrics
  cacheHits: makeCounter(),
  cacheMisses: makeCounter(),
  cacheSize: makeGauge(),

  // Feature store metrics
  featureReads: makeCounter(),
  featureWrites: makeCounter(),
  featureStoreSize: makeGauge(),

  // Collaboration SLO metrics
  boardSyncOperationsTotal: makeCounter(),
  boardSyncLatencySeconds: makeHistogram(),
  boardSyncErrorsTotal: makeCounter(),
  domainCommandsTotal: makeCounter(),
  domainCommandDurationSeconds: makeHistogram(),
  domainCommandQueueDepth: makeGauge(),
  errorBudgetRemainingPercent: makeGauge(),
  errorBudgetBurnRate: makeGauge(),

  // Generic factories used by some emitters/handlers
  counter: counterFactory,
  histogram: histogramFactory,
  gauge: gaugeFactory,

  // Convenience accessors (kept for backward compatibility)
  getCounter: (_name: string, _labels?: LabelValues) => makeCounter(),
  getHistogram: (_name: string, _labels?: LabelValues) => makeHistogram(),
  getGauge: (_name: string, _labels?: LabelValues) => makeGauge(),
};

// Express-style middleware no-op (kept for API compatibility on the server).
export const metricsMiddleware = (_req: any, _res: any, next: any) => {
  if (typeof next === 'function') next();
};

export const getMetricsHealth = () => ({
  status: 'healthy',
  metrics: {
    registered: 0,
    defaultMetrics: false,
    customMetrics: Object.keys(metrics).length,
  },
  timestamp: new Date().toISOString(),
});

export const metricsHandler = () => async (_req: any, res: any) => {
  if (res && typeof res.end === 'function') {
    res.end('');
  }
};

export const initializeBusinessMetrics = async () => {
  // No-op in browser; real initialization happens server-side.
};

// Minimal `register` stub for callers that import it.
export const register = {
  contentType: 'text/plain; version=0.0.4',
  metrics: async () => '',
  getMetricsAsArray: () => [] as unknown[],
};

export default metrics;
