export interface CanvasError {
  code: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: any;
  timestamp: Date;
}

export class CanvasErrorManager {
  private errors: CanvasError[] = [];
  private listeners: ((error: CanvasError) => void)[] = [];

  addError(error: Omit<CanvasError, 'timestamp'>): void {
    const fullError: CanvasError = {
      ...error,
      timestamp: new Date()
    };
    
    this.errors.push(fullError);
    
    // Keep only last 100 errors
    if (this.errors.length > 100) {
      this.errors = this.errors.slice(-100);
    }
    
    // Notify listeners
    this.listeners.forEach(listener => {
      try {
        listener(fullError);
      } catch (e) {
        // Silent handling of error listener failures
      }
    });
    
    // Log based on severity
    this.logError(fullError);
  }

  onError(listener: (error: CanvasError) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  getErrors(severity?: CanvasError['severity']): CanvasError[] {
    if (severity) {
      return this.errors.filter(error => error.severity === severity);
    }
    return [...this.errors];
  }

  clearErrors(): void {
    this.errors = [];
  }

  private logError(error: CanvasError): void {
    const logMessage = `[Canvas ${error.severity.toUpperCase()}] ${error.code}: ${error.message}`;
    
    switch (error.severity) {
      case 'critical':
      case 'high':
        // Production: send to error tracking service
        if (process.env.NODE_ENV === 'development') {
          // Error logged to development console
        }
        break;
      case 'medium':
        if (process.env.NODE_ENV === 'development') {
          // Warning logged to development console
        }
        break;
      case 'low':
        if (process.env.NODE_ENV === 'development') {
          // Info logged to development console
        }
        break;
    }
  }
}

export const canvasErrorManager = new CanvasErrorManager();

// Error boundary utilities
export const handleCanvasOperation = async <T>(
  operation: () => Promise<T> | T,
  errorCode: string,
  context?: any
): Promise<T | null> => {
  try {
    return await operation();
  } catch (error) {
    canvasErrorManager.addError({
      code: errorCode,
      message: error instanceof Error ? error.message : 'Unknown error',
      severity: 'medium',
      context: { ...context, originalError: error }
    });
    return null;
  }
};

export const withErrorBoundary = <T extends any[], R>(
  fn: (...args: T) => R,
  errorCode: string,
  fallback?: R
): ((...args: T) => R) => {
  return (...args: T): R => {
    try {
      return fn(...args);
    } catch (error) {
      canvasErrorManager.addError({
        code: errorCode,
        message: error instanceof Error ? error.message : 'Unknown error',
        severity: 'medium',
        context: { args, originalError: error }
      });
      
      if (fallback !== undefined) {
        return fallback;
      }
      throw error;
    }
  };
};
