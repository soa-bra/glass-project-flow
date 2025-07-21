import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { CanvasElement } from '../components/CanvasBoard/types';
import { ViewportCulling, ViewportConfig } from '../utils/performance/ViewportCulling';

/**
 * Hook لإدارة أداء Canvas مع QuadTree وViewport Culling
 */

interface UseCanvasPerformanceProps {
  elements: CanvasElement[];
  canvasSize: { width: number; height: number };
  viewport: ViewportConfig;
  enableCulling?: boolean;
}

interface PerformanceMetrics {
  totalElements: number;
  visibleElements: number;
  culledElements: number;
  renderTime: number;
  memoryUsage: number;
}

export function useCanvasPerformance({
  elements,
  canvasSize,
  viewport,
  enableCulling = true
}: UseCanvasPerformanceProps) {
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    totalElements: 0,
    visibleElements: 0,
    culledElements: 0,
    renderTime: 0,
    memoryUsage: 0
  });

  const renderStartTime = useRef<number>(0);
  const culling = useRef<ViewportCulling | null>(null);

  // إنشاء ViewportCulling instance
  useEffect(() => {
    if (enableCulling) {
      culling.current = new ViewportCulling({
        x: 0,
        y: 0,
        width: canvasSize.width,
        height: canvasSize.height
      });
    }
  }, [canvasSize, enableCulling]);

  // تحديث العناصر في QuadTree
  useEffect(() => {
    if (culling.current && enableCulling) {
      culling.current.updateElements(elements);
    }
  }, [elements, enableCulling]);

  // حساب العناصر المرئية مع memoization
  const visibleElements = useMemo(() => {
    if (!enableCulling) return elements;

    renderStartTime.current = performance.now();

    const visible = culling.current ? 
      culling.current.getVisibleElements(viewport) : 
      elements;

    // حساب metrics
    const renderTime = performance.now() - renderStartTime.current;
    const stats = culling.current?.getPerformanceStats() || {
      totalElements: elements.length,
      quadTreeItems: elements.length,
      memoryUsage: 0
    };

    setPerformanceMetrics({
      totalElements: elements.length,
      visibleElements: visible.length,
      culledElements: elements.length - visible.length,
      renderTime,
      memoryUsage: stats.memoryUsage
    });

    return visible;
  }, [elements, viewport, enableCulling]);

  // وظائف للتحكم في العناصر
  const updateElement = useCallback((element: CanvasElement) => {
    if (culling.current && enableCulling) {
      culling.current.updateElement(element);
    }
  }, [enableCulling]);

  const removeElement = useCallback((elementId: string) => {
    if (culling.current && enableCulling) {
      culling.current.removeElement(elementId);
    }
  }, [enableCulling]);

  const isElementVisible = useCallback((elementId: string): boolean => {
    if (!enableCulling) return true;
    return culling.current?.isElementVisible(elementId, viewport) ?? true;
  }, [viewport, enableCulling]);

  // تحديث حدود Canvas
  const updateCanvasBounds = useCallback((newSize: { width: number; height: number }) => {
    if (culling.current && enableCulling) {
      culling.current.updateCanvasBounds({
        x: 0,
        y: 0,
        width: newSize.width,
        height: newSize.height
      });
    }
  }, [enableCulling]);

  // فحص الأداء وتحذيرات
  const getPerformanceWarnings = useCallback((): string[] => {
    const warnings: string[] = [];
    
    if (performanceMetrics.totalElements > 1000) {
      warnings.push('عدد كبير من العناصر: قد يؤثر على الأداء');
    }
    
    if (performanceMetrics.renderTime > 16) { // > 60fps
      warnings.push('وقت الرسم طويل: قد يسبب lag');
    }
    
    if (performanceMetrics.memoryUsage > 100) { // > 100KB
      warnings.push('استهلاك ذاكرة مرتفع');
    }

    if (!enableCulling && performanceMetrics.totalElements > 500) {
      warnings.push('Viewport Culling معطل مع عدد كبير من العناصر');
    }

    return warnings;
  }, [performanceMetrics, enableCulling]);

  // تحسين الأداء التلقائي
  const optimizePerformance = useCallback(() => {
    const warnings = getPerformanceWarnings();
    const suggestions: string[] = [];

    if (warnings.length > 0) {
      suggestions.push('تفعيل Viewport Culling');
      suggestions.push('تقليل عدد العناصر المعروضة');
      suggestions.push('استخدام Virtualization للقوائم الطويلة');
    }

    return {
      warnings,
      suggestions,
      shouldOptimize: warnings.length > 2
    };
  }, [getPerformanceWarnings]);

  return {
    visibleElements,
    performanceMetrics,
    updateElement,
    removeElement,
    isElementVisible,
    updateCanvasBounds,
    getPerformanceWarnings,
    optimizePerformance,
    cullingEnabled: enableCulling
  };
}