import { NodeSDK } from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { OTLPTraceExporter } from '@opentelemetry/exporter-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-otlp-http';
import { trace, context, SpanKind, SpanStatusCode } from '@opentelemetry/api';

// Configuration
const serviceName = process.env.SERVICE_NAME || 'supra-system';
const serviceVersion = process.env.SERVICE_VERSION || '1.0.0';
const environment = process.env.NODE_ENV || 'development';
const traceEndpoint = process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT || 'http://localhost:4318/v1/traces';
const metricsEndpoint = process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT || 'http://localhost:4318/v1/metrics';

let isInitialized = false;
let sdk: NodeSDK | null = null;

export function initTracing(): void {
  if (isInitialized) {
    console.warn('OpenTelemetry already initialized');
    return;
  }

  try {
    // Create trace exporter
    const traceExporter = new OTLPTraceExporter({
      url: traceEndpoint,
      headers: {
        'Authorization': process.env.OTEL_AUTH_HEADER || '',
      },
    });

    // Create metrics exporter
    const metricExporter = new OTLPMetricExporter({
      url: metricsEndpoint,
      headers: {
        'Authorization': process.env.OTEL_AUTH_HEADER || '',
      },
    });

    // Create resource
    const resource = new Resource({
      [SEMRESATTRS_SERVICE_NAME]: serviceName,
      [SEMRESATTRS_SERVICE_VERSION]: serviceVersion,
      'service.environment': environment,
      'service.instance.id': process.env.HOSTNAME || 'unknown',
    });

    // Create SDK
    sdk = new NodeSDK({
      resource,
      traceExporter,
      metricReader: new PeriodicExportingMetricReader({
        exporter: metricExporter,
        exportIntervalMillis: 30000, // Export every 30 seconds
      }),
      instrumentations: [
        getNodeAutoInstrumentations({
          // Disable some noisy instrumentations
          '@opentelemetry/instrumentation-redis': {
            enabled: true,
          },
          '@opentelemetry/instrumentation-http': {
            enabled: true,
            requestHook: (span, request) => {
              // Add custom attributes
              span.setAttributes({
                'http.user_agent': request.headers['user-agent'] || '',
                'http.client_ip': request.headers['x-forwarded-for'] || request.socket.remoteAddress || '',
              });
            },
          },
          '@opentelemetry/instrumentation-express': {
            enabled: true,
          },
          '@opentelemetry/instrumentation-fs': {
            enabled: false, // Usually too noisy
          },
        }),
      ],
    });

    // Start SDK
    sdk.start();
    isInitialized = true;

    console.log('OpenTelemetry started successfully', {
      serviceName,
      serviceVersion,
      environment,
      traceEndpoint,
      metricsEndpoint,
    });

  } catch (error) {
    console.error('Failed to initialize OpenTelemetry:', error);
  }
}

export function shutdownTracing(): Promise<void> {
  if (sdk) {
    return sdk.shutdown();
  }
  return Promise.resolve();
}

// Custom tracer for application-specific spans
export const tracer = trace.getTracer(serviceName, serviceVersion);

// Utility functions for manual instrumentation
export function createSpan(
  name: string,
  options: {
    kind?: SpanKind;
    attributes?: Record<string, string | number | boolean>;
    parent?: any;
  } = {}
) {
  const spanOptions: any = {
    kind: options.kind || SpanKind.INTERNAL,
    attributes: options.attributes || {},
  };

  if (options.parent) {
    return tracer.startSpan(name, spanOptions, options.parent);
  }

  return tracer.startSpan(name, spanOptions);
}

// Decorator for automatic tracing
export function traced(spanName?: string) {
  return function(target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    const name = spanName || `${target.constructor.name}.${propertyName}`;

    descriptor.value = async function(...args: any[]) {
      const span = createSpan(name, {
        attributes: {
          'method.class': target.constructor.name,
          'method.name': propertyName,
          'method.args': JSON.stringify(args).slice(0, 1000), // Truncate long args
        },
      });

      try {
        const result = await method.apply(this, args);
        span.setStatus({ code: SpanStatusCode.OK });
        return result;
      } catch (error) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error instanceof Error ? error.message : 'Unknown error',
        });
        span.recordException(error instanceof Error ? error : new Error(String(error)));
        throw error;
      } finally {
        span.end();
      }
    };

    return descriptor;
  };
}

// Utility for tracing async operations
export async function withTracing<T>(
  operationName: string,
  operation: (span: any) => Promise<T>,
  options: {
    attributes?: Record<string, string | number | boolean>;
    kind?: SpanKind;
  } = {}
): Promise<T> {
  const span = createSpan(operationName, {
    kind: options.kind || SpanKind.INTERNAL,
    attributes: options.attributes,
  });

  try {
    const result = await operation(span);
    span.setStatus({ code: SpanStatusCode.OK });
    return result;
  } catch (error) {
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    span.recordException(error instanceof Error ? error : new Error(String(error)));
    throw error;
  } finally {
    span.end();
  }
}

// Event system tracing utilities
export const eventTracing = {
  emitEvent: (eventName: string, eventId: string) => {
    return createSpan(`event.emit.${eventName}`, {
      kind: SpanKind.PRODUCER,
      attributes: {
        'event.name': eventName,
        'event.id': eventId,
        'messaging.operation': 'publish',
        'messaging.destination.name': 'event-outbox',
      },
    });
  },

  processEvent: (eventName: string, eventId: string, handlerName: string) => {
    return createSpan(`event.process.${eventName}`, {
      kind: SpanKind.CONSUMER,
      attributes: {
        'event.name': eventName,
        'event.id': eventId,
        'event.handler': handlerName,
        'messaging.operation': 'process',
        'messaging.source.name': 'event-outbox',
      },
    });
  },
};

// Database tracing utilities
export const dbTracing = {
  query: (operation: string, table: string, query?: string) => {
    return createSpan(`db.${operation}`, {
      kind: SpanKind.CLIENT,
      attributes: {
        'db.system': 'postgresql',
        'db.operation': operation,
        'db.sql.table': table,
        'db.statement': query ? query.slice(0, 500) : '', // Truncate long queries
      },
    });
  },
};

// HTTP tracing utilities
export const httpTracing = {
  client: (method: string, url: string) => {
    return createSpan(`http.client.${method.toLowerCase()}`, {
      kind: SpanKind.CLIENT,
      attributes: {
        'http.method': method,
        'http.url': url,
        'http.scheme': new URL(url).protocol.slice(0, -1),
        'http.host': new URL(url).host,
      },
    });
  },

  server: (method: string, route: string) => {
    return createSpan(`http.server.${method.toLowerCase()}`, {
      kind: SpanKind.SERVER,
      attributes: {
        'http.method': method,
        'http.route': route,
      },
    });
  },
};

// Business operation tracing
export const businessTracing = {
  culturalImpact: (brandId: string, metricCode: string) => {
    return createSpan('business.cultural_impact.measure', {
      attributes: {
        'business.brand.id': brandId,
        'business.metric.code': metricCode,
        'business.operation': 'cultural_impact_measurement',
      },
    });
  },

  projectOperation: (projectId: string, operation: string) => {
    return createSpan(`business.project.${operation}`, {
      attributes: {
        'business.project.id': projectId,
        'business.operation': operation,
      },
    });
  },

  hrOperation: (employeeId: string, operation: string) => {
    return createSpan(`business.hr.${operation}`, {
      attributes: {
        'business.employee.id': employeeId,
        'business.operation': operation,
      },
    });
  },
};

// Context utilities
export const getTraceId = (): string => {
  const activeSpan = trace.getActiveSpan();
  if (activeSpan) {
    return activeSpan.spanContext().traceId;
  }
  return '';
};

export const getSpanId = (): string => {
  const activeSpan = trace.getActiveSpan();
  if (activeSpan) {
    return activeSpan.spanContext().spanId;
  }
  return '';
};

// Middleware for Express
export const tracingMiddleware = (req: any, res: any, next: any) => {
  const traceId = getTraceId();
  const spanId = getSpanId();
  
  // Add trace context to request
  req.traceId = traceId;
  req.spanId = spanId;
  
  // Add trace context to environment for logger
  process.env.TRACE_ID = traceId;
  process.env.SPAN_ID = spanId;
  
  // Add trace headers to response
  res.set('X-Trace-Id', traceId);
  
  next();
};

export default {
  init: initTracing,
  shutdown: shutdownTracing,
  tracer,
  traced,
  withTracing,
  eventTracing,
  dbTracing,
  httpTracing,
  businessTracing,
  getTraceId,
  getSpanId,
};