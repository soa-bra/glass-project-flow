import { useState, useEffect, useCallback } from 'react';
import { performanceMonitor, MetricsCollector, CanvasOptimizer } from '../utils/performance';
import { useCanvasStore } from '../store/canvas.store';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  elementCount: number;
  isPerformanceGood: boolean;
  averages: {
    avgFps: number;
    avgMemory: number;
    avgRenderTime: number;
  };
}

export const usePerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memoryUsage: 0,
    elementCount: 0,
    isPerformanceGood: true,
    averages: { avgFps: 0, avgMemory: 0, avgRenderTime: 0 }
  });

  const { elements } = useCanvasStore();

  // Update metrics every second
  useEffect(() => {
    const interval = setInterval(() => {
      const fps = performanceMonitor.getFPS();
      const memoryUsage = performanceMonitor.getMemoryUsage();
      const elementCount = elements.length;
      const isPerformanceGood = performanceMonitor.isPerformanceGood();
      const averages = MetricsCollector.getAverages();

      // Record metrics for analysis
      MetricsCollector.record(fps, memoryUsage, elementCount, 0);

      setMetrics({
        fps,
        memoryUsage,
        elementCount,
        isPerformanceGood,
        averages
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [elements.length]);

  // Optimization suggestions
  const getOptimizationSuggestions = useCallback(() => {
    const suggestions: string[] = [];

    if (metrics.fps < 55) {
      suggestions.push('انخفاض معدل الإطارات - قم بتقليل عدد العناصر أو استخدم مستوى تفصيل أقل');
    }

    if (metrics.memoryUsage > 400) {
      suggestions.push('استخدام ذاكرة عالي - قم بتنظيف العناصر غير المستخدمة');
    }

    if (metrics.elementCount > 1000) {
      suggestions.push('عدد كبير من العناصر - فكر في استخدام التجميع أو الطبقات');
    }

    return suggestions;
  }, [metrics]);

  // Performance optimization actions
  const optimizePerformance = useCallback(() => {
    // Auto cleanup and optimization
    if (metrics.memoryUsage > 300) {
      // Trigger garbage collection hint
      if (window.gc) {
        window.gc();
      }
    }

    // Suggest element culling if too many elements
    if (metrics.elementCount > 500) {
      return {
        enableCulling: true,
        reduceLOD: true,
        batchUpdates: true
      };
    }

    return {
      enableCulling: false,
      reduceLOD: false,
      batchUpdates: false
    };
  }, [metrics]);

  return {
    metrics,
    suggestions: getOptimizationSuggestions(),
    optimize: optimizePerformance,
    isHealthy: metrics.isPerformanceGood
  };
};