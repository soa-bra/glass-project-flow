// Performance Optimization Utilities
import { CanvasElementType } from '@/types/canvas-elements';

// Intersection Observer for Canvas elements
export class CanvasIntersectionObserver {
  private observer: IntersectionObserver | null = null;
  private callbacks = new Map<string, (isVisible: boolean) => void>();

  constructor(threshold = 0.1) {
    if (typeof window !== 'undefined') {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const elementId = entry.target.getAttribute('data-element-id');
          if (elementId && this.callbacks.has(elementId)) {
            this.callbacks.get(elementId)?.(entry.isIntersecting);
          }
        });
      }, { threshold });
    }
  }

  observe(element: HTMLElement, elementId: string, callback: (isVisible: boolean) => void) {
    if (this.observer) {
      element.setAttribute('data-element-id', elementId);
      this.callbacks.set(elementId, callback);
      this.observer.observe(element);
    }
  }

  unobserve(element: HTMLElement, elementId: string) {
    if (this.observer) {
      this.observer.unobserve(element);
      this.callbacks.delete(elementId);
    }
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
      this.callbacks.clear();
    }
  }
}

// Virtual Scrolling for large Canvas datasets
export class CanvasVirtualizer {
  private containerHeight: number;
  private itemHeight: number;
  private overscan: number;

  constructor(containerHeight: number, itemHeight: number, overscan = 5) {
    this.containerHeight = containerHeight;
    this.itemHeight = itemHeight;
    this.overscan = overscan;
  }

  getVisibleRange(scrollTop: number, totalItems: number) {
    const startIndex = Math.floor(scrollTop / this.itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(this.containerHeight / this.itemHeight),
      totalItems - 1
    );

    return {
      start: Math.max(0, startIndex - this.overscan),
      end: Math.min(totalItems - 1, endIndex + this.overscan),
    };
  }

  getItemOffset(index: number) {
    return index * this.itemHeight;
  }

  getTotalHeight(itemCount: number) {
    return itemCount * this.itemHeight;
  }
}

// Memory Pool for Canvas elements
export class CanvasElementPool<T> {
  private pool: T[] = [];
  private createFn: () => T;
  private resetFn: (item: T) => void;

  constructor(createFn: () => T, resetFn: (item: T) => void, initialSize = 10) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    
    // Pre-populate pool
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(createFn());
    }
  }

  acquire(): T {
    return this.pool.pop() || this.createFn();
  }

  release(item: T) {
    this.resetFn(item);
    this.pool.push(item);
  }

  clear() {
    this.pool.length = 0;
  }
}

// Performance metrics collector
export class PerformanceMetrics {
  private static instance: PerformanceMetrics;
  private metrics = new Map<string, number[]>();

  static getInstance(): PerformanceMetrics {
    if (!PerformanceMetrics.instance) {
      PerformanceMetrics.instance = new PerformanceMetrics();
    }
    return PerformanceMetrics.instance;
  }

  startTiming(label: string): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.addMetric(label, duration);
    };
  }

  addMetric(label: string, value: number) {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    this.metrics.get(label)!.push(value);
    
    // Keep only last 100 measurements
    const values = this.metrics.get(label)!;
    if (values.length > 100) {
      values.shift();
    }
  }

  getAverage(label: string): number {
    const values = this.metrics.get(label) || [];
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  }

  getAllMetrics() {
    const result: Record<string, { average: number; count: number }> = {};
    this.metrics.forEach((values, label) => {
      result[label] = {
        average: this.getAverage(label),
        count: values.length,
      };
    });
    return result;
  }

  clear() {
    this.metrics.clear();
  }
}

// Optimized style calculations
export const optimizedStyleCalculator = {
  // Cache for computed styles
  styleCache: new Map<string, any>(),

  // Generate cache key for element style
  generateCacheKey(element: CanvasElementType): string {
    return `${element.id}-${element.position.x}-${element.position.y}-${element.size.width}-${element.size.height}`;
  },

  // Get cached or compute style
  getElementStyle(element: CanvasElementType): any {
    const cacheKey = this.generateCacheKey(element);
    
    if (this.styleCache.has(cacheKey)) {
      return this.styleCache.get(cacheKey);
    }

    const style = {
      position: 'absolute',
      left: `${element.position.x}px`,
      top: `${element.position.y}px`,
      width: `${element.size.width}px`,
      height: `${element.size.height}px`,
      ...element.style,
    };

    this.styleCache.set(cacheKey, style);
    return style;
  },

  // Clear cache
  clearCache() {
    this.styleCache.clear();
  },

  // Clean old cache entries
  cleanupCache(validKeys: Set<string>) {
    for (const key of this.styleCache.keys()) {
      if (!validKeys.has(key)) {
        this.styleCache.delete(key);
      }
    }
  },
};
