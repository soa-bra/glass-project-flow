import { useCallback, useEffect, useRef, useMemo } from 'react';
import { CanvasElementType } from '@/types/canvas-elements';
import { PerformanceMetrics, optimizedStyleCalculator } from '@/utils/performanceOptimizer';

// Main Canvas performance hook
export const useCanvasPerformance = (elements: CanvasElementType[]) => {
  const metricsRef = useRef(PerformanceMetrics.getInstance());
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(0);

  // Track render performance
  useEffect(() => {
    const now = performance.now();
    renderCountRef.current++;
    
    if (lastRenderTimeRef.current > 0) {
      const renderDuration = now - lastRenderTimeRef.current;
      metricsRef.current.addMetric('canvas-render', renderDuration);
    }
    
    lastRenderTimeRef.current = now;
  });

  // Optimized element rendering
  const renderElement = useCallback((element: CanvasElementType) => {
    const endTiming = metricsRef.current.startTiming('element-render');
    
    try {
      const style = optimizedStyleCalculator.getElementStyle(element);
      return { element, style };
    } finally {
      endTiming();
    }
  }, []);

  // Batch render multiple elements
  const batchRenderElements = useCallback((elementsToRender: CanvasElementType[]) => {
    const endTiming = metricsRef.current.startTiming('batch-render');
    
    try {
      return elementsToRender.map(renderElement);
    } finally {
      endTiming();
    }
  }, [renderElement]);

  // Viewport culling optimization
  const getVisibleElements = useMemo(() => {
    return (viewport: { x: number; y: number; width: number; height: number; zoom: number }) => {
      const endTiming = metricsRef.current.startTiming('viewport-culling');
      
      try {
        return elements.filter(element => {
          const elementBounds = {
            left: element.position.x * viewport.zoom + viewport.x,
            top: element.position.y * viewport.zoom + viewport.y,
            right: (element.position.x + element.size.width) * viewport.zoom + viewport.x,
            bottom: (element.position.y + element.size.height) * viewport.zoom + viewport.y,
          };

          return !(
            elementBounds.right < -100 ||
            elementBounds.left > viewport.width + 100 ||
            elementBounds.bottom < -100 ||
            elementBounds.top > viewport.height + 100
          );
        });
      } finally {
        endTiming();
      }
    };
  }, [elements]);

  // Performance metrics getter
  const getPerformanceMetrics = useCallback(() => {
    return {
      ...metricsRef.current.getAllMetrics(),
      renderCount: renderCountRef.current,
      elementCount: elements.length,
    };
  }, [elements.length]);

  // Cleanup cache when elements change
  useEffect(() => {
    const validKeys = new Set(
      elements.map(el => optimizedStyleCalculator.generateCacheKey(el))
    );
    optimizedStyleCalculator.cleanupCache(validKeys);
  }, [elements]);

  return {
    renderElement,
    batchRenderElements,
    getVisibleElements,
    getPerformanceMetrics,
  };
};

// Hook for performance monitoring
export const usePerformanceMonitor = (enabled = false) => {
  const metricsRef = useRef(PerformanceMetrics.getInstance());
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (enabled) {
      intervalRef.current = setInterval(() => {
        const metrics = metricsRef.current.getAllMetrics();
        
        // Log performance warnings
        if (metrics['canvas-render']?.average > 16) {
          console.warn('Canvas render time exceeding 16ms:', metrics['canvas-render'].average);
        }
        
        if (metrics['element-render']?.average > 1) {
          console.warn('Element render time high:', metrics['element-render'].average);
        }
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled]);

  return metricsRef.current;
};