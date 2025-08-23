// Performance utilities for Planning Board
import { CanvasElement } from '../types/canvas.types';

// Performance monitoring utilities
export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = 0;
  private fps = 0;
  private memoryUsage = 0;

  constructor() {
    this.startMonitoring();
  }

  private startMonitoring() {
    const measureFrame = (currentTime: number) => {
      this.frameCount++;
      
      if (currentTime - this.lastTime >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
        this.frameCount = 0;
        this.lastTime = currentTime;
        
        // Memory usage monitoring
        if ((performance as any).memory) {
          this.memoryUsage = Math.round((performance as any).memory.usedJSHeapSize / 1048576); // MB
        }
      }
      
      requestAnimationFrame(measureFrame);
    };
    
    requestAnimationFrame(measureFrame);
  }

  getFPS(): number {
    return this.fps;
  }

  getMemoryUsage(): number {
    return this.memoryUsage;
  }

  isPerformanceGood(): boolean {
    return this.fps >= 55 && this.memoryUsage < 500;
  }
}

// Canvas optimization utilities
export class CanvasOptimizer {
  // Viewport culling - only render visible elements
  static cullElements(
    elements: CanvasElement[],
    viewport: { x: number; y: number; width: number; height: number; zoom: number }
  ): CanvasElement[] {
    return elements.filter(element => {
      const elementBounds = {
        x: element.position.x,
        y: element.position.y,
        width: element.size.width,
        height: element.size.height
      };

      // Check if element intersects with viewport
      return this.intersects(elementBounds, viewport);
    });
  }

  // Level of detail - reduce quality for distant elements
  static getLOD(element: CanvasElement, zoom: number): 'high' | 'medium' | 'low' {
    if (zoom >= 1) return 'high';
    if (zoom >= 0.5) return 'medium';
    return 'low';
  }

  // Batch similar operations
  static batchUpdates<T>(items: T[], processor: (batch: T[]) => void, batchSize = 100): void {
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      processor(batch);
    }
  }

  private static intersects(
    rect1: { x: number; y: number; width: number; height: number },
    rect2: { x: number; y: number; width: number; height: number }
  ): boolean {
    return !(
      rect1.x > rect2.x + rect2.width ||
      rect1.x + rect1.width < rect2.x ||
      rect1.y > rect2.y + rect2.height ||
      rect1.y + rect1.height < rect2.y
    );
  }
}

// Memory management utilities
export class MemoryManager {
  private static cache = new Map<string, any>();
  private static maxCacheSize = 1000;

  // Smart caching with LRU eviction
  static set(key: string, value: any): void {
    if (this.cache.size >= this.maxCacheSize) {
      // Remove oldest entries
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  static get(key: string): any {
    const cached = this.cache.get(key);
    if (cached) {
      // Update timestamp for LRU
      cached.timestamp = Date.now();
      return cached.value;
    }
    return null;
  }

  static clear(): void {
    this.cache.clear();
  }

  // Clean up old entries
  static cleanup(maxAge = 300000): void { // 5 minutes default
    const now = Date.now();
    for (const [key, cached] of this.cache.entries()) {
      if (now - cached.timestamp > maxAge) {
        this.cache.delete(key);
      }
    }
  }
}

// Debounce utility for performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Throttle utility for performance
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Performance metrics collector
export class MetricsCollector {
  private static metrics: Array<{ 
    timestamp: number; 
    fps: number; 
    memory: number; 
    elements: number;
    renderTime: number;
  }> = [];

  static record(fps: number, memory: number, elements: number, renderTime: number): void {
    this.metrics.push({
      timestamp: Date.now(),
      fps,
      memory,
      elements,
      renderTime
    });

    // Keep only last 1000 entries
    if (this.metrics.length > 1000) {
      this.metrics.shift();
    }
  }

  static getMetrics(timeRange?: number) {
    if (timeRange) {
      const cutoff = Date.now() - timeRange;
      return this.metrics.filter(m => m.timestamp >= cutoff);
    }
    return [...this.metrics];
  }

  static getAverages(timeRange = 60000): {
    avgFps: number;
    avgMemory: number;
    avgRenderTime: number;
  } {
    const recentMetrics = this.getMetrics(timeRange);
    if (recentMetrics.length === 0) {
      return { avgFps: 0, avgMemory: 0, avgRenderTime: 0 };
    }

    const totals = recentMetrics.reduce(
      (acc, m) => ({
        fps: acc.fps + m.fps,
        memory: acc.memory + m.memory,
        renderTime: acc.renderTime + m.renderTime
      }),
      { fps: 0, memory: 0, renderTime: 0 }
    );

    return {
      avgFps: Math.round(totals.fps / recentMetrics.length),
      avgMemory: Math.round(totals.memory / recentMetrics.length),
      avgRenderTime: Math.round(totals.renderTime / recentMetrics.length)
    };
  }
}

// Export performance monitoring instance
export const performanceMonitor = new PerformanceMonitor();
