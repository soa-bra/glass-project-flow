export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  private observers: PerformanceObserver[] = [];

  startTiming(key: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (!this.metrics.has(key)) {
        this.metrics.set(key, []);
      }
      
      const timings = this.metrics.get(key)!;
      timings.push(duration);
      
      // Keep only last 100 measurements
      if (timings.length > 100) {
        timings.splice(0, timings.length - 100);
      }
    };
  }

  getAverageTime(key: string): number {
    const timings = this.metrics.get(key);
    if (!timings || timings.length === 0) return 0;
    
    const sum = timings.reduce((acc, time) => acc + time, 0);
    return sum / timings.length;
  }

  getMetrics(key: string): { min: number; max: number; avg: number; count: number } {
    const timings = this.metrics.get(key);
    if (!timings || timings.length === 0) {
      return { min: 0, max: 0, avg: 0, count: 0 };
    }
    
    return {
      min: Math.min(...timings),
      max: Math.max(...timings),
      avg: this.getAverageTime(key),
      count: timings.length
    };
  }

  startObserver(callback: (entries: PerformanceEntry[]) => void): void {
    if (typeof PerformanceObserver === 'undefined') return;
    
    const observer = new PerformanceObserver((list) => {
      callback(list.getEntries());
    });
    
    observer.observe({ entryTypes: ['measure', 'navigation', 'paint'] });
    this.observers.push(observer);
  }

  stopAllObservers(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }

  clearMetrics(): void {
    this.metrics.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Throttle function for performance optimization
export const throttle = <T extends any[]> (
  func: (...args: T) => void,
  delay: number
): ((...args: T) => void) => {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;
  
  return (...args: T) => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
        timeoutId = null;
      }, delay - (currentTime - lastExecTime));
    }
  };
};

// Debounce function for performance optimization
export const debounce = <T extends any[]> (
  func: (...args: T) => void,
  delay: number
): ((...args: T) => void) => {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return (...args: T) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  };
};

// RAF-based animation loop for smooth rendering
export class AnimationLoop {
  private isRunning = false;
  private frameId: number | null = null;
  private callbacks: (() => void)[] = [];

  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.tick();
  }

  stop(): void {
    this.isRunning = false;
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  addCallback(callback: () => void): () => void {
    this.callbacks.push(callback);
    
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  private tick = (): void => {
    if (!this.isRunning) return;
    
    const endTiming = performanceMonitor.startTiming('animation-frame');
    
    try {
      this.callbacks.forEach(callback => {
        try {
          callback();
        } catch (error) {
          console.error('Error in animation callback:', error);
        }
      });
    } finally {
      endTiming();
    }
    
    this.frameId = requestAnimationFrame(this.tick);
  };
}

export const animationLoop = new AnimationLoop();
