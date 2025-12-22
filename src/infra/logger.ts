import pino from "pino";

// Create logger configuration based on environment
const createLogger = () => {
  const isDevelopment = process.env.NODE_ENV === "development";
  const logLevel = process.env.LOG_LEVEL || (isDevelopment ? "debug" : "info");

  const baseConfig = {
    level: logLevel,
    base: {
      pid: process.pid,
      hostname: process.env.HOSTNAME || "unknown",
      service: process.env.SERVICE_NAME || "SoaBra-system",
      version: process.env.SERVICE_VERSION || "1.0.0",
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level: (label: string) => ({ level: label }),
      log: (object: any) => {
        // Add trace context if available
        if (process.env.TRACE_ID) {
          object.traceId = process.env.TRACE_ID;
        }
        if (process.env.SPAN_ID) {
          object.spanId = process.env.SPAN_ID;
        }
        return object;
      },
    },
  };

  // Pretty print in development
  if (isDevelopment) {
    return pino({
      ...baseConfig,
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
          messageFormat: "{msg}",
          errorLikeObjectKeys: ["err", "error"],
        },
      },
    });
  }

  // Structured JSON logging in production
  return pino(baseConfig);
};

export const logger = createLogger();

// Utility functions for common logging patterns
export const createModuleLogger = (module: string) => {
  return logger.child({ module });
};

export const createRequestLogger = (requestId: string, userId?: string) => {
  return logger.child({
    requestId,
    userId: userId || "anonymous",
  });
};

export const createEventLogger = (eventName: string, eventId: string) => {
  return logger.child({
    eventName,
    eventId,
    context: "event-processing",
  });
};

// Performance logging helper
export const withPerformanceLogging = async <T,>(
  operation: string,
  fn: () => Promise<T>,
  additionalContext?: Record<string, any>,
): Promise<T> => {
  const startTime = Date.now();
  const operationLogger = logger.child({
    operation,
    ...additionalContext,
  });

  operationLogger.debug({ msg: "Operation started" });

  try {
    const result = await fn();
    const duration = Date.now() - startTime;

    operationLogger.info({
      msg: "Operation completed successfully",
      durationMs: duration,
    });

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;

    operationLogger.error({
      msg: "Operation failed",
      durationMs: duration,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    throw error;
  }
};

// Redact sensitive information
export const redactSensitive = (obj: any): any => {
  const sensitiveKeys = [
    "password",
    "token",
    "secret",
    "key",
    "authorization",
    "auth",
    "credential",
    "ssn",
    "social",
    "credit_card",
    "card_number",
  ];

  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(redactSensitive);
  }

  const redacted = { ...obj };

  for (const key in redacted) {
    if (sensitiveKeys.some((sensitive) => key.toLowerCase().includes(sensitive.toLowerCase()))) {
      redacted[key] = "[REDACTED]";
    } else if (typeof redacted[key] === "object") {
      redacted[key] = redactSensitive(redacted[key]);
    }
  }

  return redacted;
};

// Express middleware for request logging
export const requestLoggingMiddleware = (req: any, res: any, next: any) => {
  const requestId =
    req.headers["x-request-id"] || req.headers["x-correlation-id"] || Math.random().toString(36).substring(2);

  const userId = req.user?.id || req.headers["x-user-id"];

  const requestLogger = createRequestLogger(requestId, userId);

  // Attach logger to request
  req.logger = requestLogger;

  // Log request start
  requestLogger.info({
    msg: "Request started",
    method: req.method,
    url: req.url,
    userAgent: req.headers["user-agent"],
    ip: req.ip || req.connection.remoteAddress,
    body: redactSensitive(req.body),
  });

  const startTime = Date.now();

  // Capture response
  const originalSend = res.send;
  res.send = function (body: any) {
    const duration = Date.now() - startTime;

    requestLogger.info({
      msg: "Request completed",
      statusCode: res.statusCode,
      durationMs: duration,
      responseSize: body ? Buffer.byteLength(body) : 0,
    });

    return originalSend.call(this, body);
  };

  next();
};

// Health check logger
export const healthLogger = createModuleLogger("health-check");

// Database logger
export const dbLogger = createModuleLogger("database");

// Security logger
export const securityLogger = createModuleLogger("security");

// Business logic logger
export const businessLogger = createModuleLogger("business");

export default logger;
