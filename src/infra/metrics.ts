import { register, collectDefaultMetrics, Counter, Histogram, Gauge, Summary } from 'prom-client';

// Collect default metrics (CPU, memory, etc.)
collectDefaultMetrics({
  prefix: 'supra_',
  gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5], // seconds
});

// Custom metrics for Supra system
export const metrics = {
  // HTTP request metrics
  httpRequestsTotal: new Counter({
    name: 'supra_http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
  }),

  httpRequestDuration: new Histogram({
    name: 'supra_http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  }),

  // Event system metrics
  eventsEmittedTotal: new Counter({
    name: 'supra_events_emitted_total',
    help: 'Total number of events emitted',
    labelNames: ['event_name', 'version'],
  }),

  eventsProcessedTotal: new Counter({
    name: 'supra_events_processed_total',
    help: 'Total number of events processed',
    labelNames: ['event_name', 'version', 'status'],
  }),

  eventProcessingDuration: new Histogram({
    name: 'supra_event_processing_duration_seconds',
    help: 'Time spent processing events',
    labelNames: ['event_name', 'handler'],
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10, 30],
  }),

  eventHandlerErrorsTotal: new Counter({
    name: 'supra_event_handler_errors_total',
    help: 'Total number of event handler errors',
    labelNames: ['event_name', 'handler', 'error_type'],
  }),

  // Outbox metrics
  outboxEventsTotal: new Counter({
    name: 'supra_outbox_events_total',
    help: 'Total number of outbox events',
    labelNames: ['status'],
  }),

  outboxRetryTotal: new Counter({
    name: 'supra_outbox_retry_total',
    help: 'Total number of outbox retries',
    labelNames: ['event_name', 'retry_count'],
  }),

  outboxDlqTotal: new Counter({
    name: 'supra_outbox_dlq_total',
    help: 'Total number of events moved to DLQ',
    labelNames: ['event_name', 'reason'],
  }),

  // Database metrics
  dbQueryDuration: new Histogram({
    name: 'supra_db_query_duration_seconds',
    help: 'Database query duration',
    labelNames: ['operation', 'table'],
    buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  }),

  dbConnectionsActive: new Gauge({
    name: 'supra_db_connections_active',
    help: 'Number of active database connections',
  }),

  dbConnectionsIdle: new Gauge({
    name: 'supra_db_connections_idle',
    help: 'Number of idle database connections',
  }),

  // Business metrics
  projectsActiveTotal: new Gauge({
    name: 'supra_projects_active_total',
    help: 'Total number of active projects',
    labelNames: ['project_type'],
  }),

  clientsActiveTotal: new Gauge({
    name: 'supra_clients_active_total',
    help: 'Total number of active clients',
  }),

  employeesTotal: new Gauge({
    name: 'supra_employees_total',
    help: 'Total number of employees',
    labelNames: ['department', 'status'],
  }),

  culturalImpactMeasurements: new Counter({
    name: 'supra_cultural_impact_measurements_total',
    help: 'Total number of cultural impact measurements',
    labelNames: ['metric_type', 'method'],
  }),

  // Performance metrics
  responseTime95th: new Summary({
    name: 'supra_response_time_95th_percentile',
    help: '95th percentile response time',
    labelNames: ['service', 'endpoint'],
    percentiles: [0.5, 0.75, 0.9, 0.95, 0.99],
  }),

  errorRate: new Gauge({
    name: 'supra_error_rate',
    help: 'Current error rate',
    labelNames: ['service'],
  }),

  // Cache metrics
  cacheHits: new Counter({
    name: 'supra_cache_hits_total',
    help: 'Total number of cache hits',
    labelNames: ['cache_name'],
  }),

  cacheMisses: new Counter({
    name: 'supra_cache_misses_total',
    help: 'Total number of cache misses',
    labelNames: ['cache_name'],
  }),

  cacheSize: new Gauge({
    name: 'supra_cache_size_bytes',
    help: 'Current cache size in bytes',
    labelNames: ['cache_name'],
  }),

  // Feature store metrics
  featureReads: new Counter({
    name: 'supra_feature_reads_total',
    help: 'Total number of feature reads',
    labelNames: ['namespace', 'entity_type'],
  }),

  featureWrites: new Counter({
    name: 'supra_feature_writes_total',
    help: 'Total number of feature writes',
    labelNames: ['namespace', 'entity_type'],
  }),

  featureStoreSize: new Gauge({
    name: 'supra_feature_store_size_total',
    help: 'Total number of feature records',
    labelNames: ['namespace'],
  }),

  // Convenience methods
  getCounter: (metricName: keyof typeof metrics, labels?: Record<string, string>) => {
    const metric = metrics[metricName];
    if (metric && 'inc' in metric) {
      return labels ? metric.labels(labels) : metric;
    }
    throw new Error(`Counter ${String(metricName)} not found or not a counter`);
  },

  getHistogram: (metricName: keyof typeof metrics, labels?: Record<string, string>) => {
    const metric = metrics[metricName];
    if (metric && 'observe' in metric) {
      return labels ? metric.labels(labels) : metric;
    }
    throw new Error(`Histogram ${String(metricName)} not found or not a histogram`);
  },

  getGauge: (metricName: keyof typeof metrics, labels?: Record<string, string>) => {
    const metric = metrics[metricName];
    if (metric && 'set' in metric) {
      return labels ? metric.labels(labels) : metric;
    }
    throw new Error(`Gauge ${String(metricName)} not found or not a gauge`);
  },
};

// Middleware for Express to track HTTP metrics
export const metricsMiddleware = (req: any, res: any, next: any) => {
  const startTime = Date.now();
  
  // Track request start
  metrics.httpRequestsTotal.inc({
    method: req.method,
    route: req.route?.path || req.path,
    status_code: 'pending',
  });

  // Capture response
  const originalSend = res.send;
  res.send = function(body: any) {
    const duration = (Date.now() - startTime) / 1000; // Convert to seconds
    
    const labels = {
      method: req.method,
      route: req.route?.path || req.path,
      status_code: res.statusCode.toString(),
    };

    // Update metrics
    metrics.httpRequestsTotal.inc(labels);
    metrics.httpRequestDuration.observe(labels, duration);
    
    // Track 95th percentile
    metrics.responseTime95th.observe(
      { service: 'api', endpoint: req.path },
      duration
    );

    return originalSend.call(this, body);
  };

  next();
};

// Health check for metrics
export const getMetricsHealth = () => {
  return {
    status: 'healthy',
    metrics: {
      registered: register.getMetricsAsArray().length,
      defaultMetrics: true,
      customMetrics: Object.keys(metrics).length,
    },
    timestamp: new Date().toISOString(),
  };
};

// Express route handler for /metrics endpoint
export const metricsHandler = () => {
  return async (req: any, res: any) => {
    try {
      res.set('Content-Type', register.contentType);
      const metricsOutput = await register.metrics();
      res.end(metricsOutput);
    } catch (error) {
      res.status(500).end('Error generating metrics');
    }
  };
};

// Initialize business metrics (call this on app startup)
export const initializeBusinessMetrics = async () => {
  try {
    // Initialize with actual data from database
    // Query database for current counts in production environment
    
    // Example initializations:
    metrics.projectsActiveTotal.set({ project_type: 'cultural-strategy' }, 0);
    metrics.projectsActiveTotal.set({ project_type: 'brand-identity' }, 0);
    metrics.projectsActiveTotal.set({ project_type: 'research' }, 0);
    metrics.projectsActiveTotal.set({ project_type: 'consultation' }, 0);
    
    metrics.clientsActiveTotal.set(0);
    
    metrics.employeesTotal.set({ department: 'cultural-strategy', status: 'active' }, 0);
    metrics.employeesTotal.set({ department: 'research', status: 'active' }, 0);
    metrics.employeesTotal.set({ department: 'creative', status: 'active' }, 0);
    metrics.employeesTotal.set({ department: 'account-management', status: 'active' }, 0);
    metrics.employeesTotal.set({ department: 'operations', status: 'active' }, 0);
    
  } catch (error) {
    // Failed to initialize business metrics - handled gracefully
  }
};

export { register };
export default metrics;