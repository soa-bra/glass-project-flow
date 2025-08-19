// React hook for Performance Manager
import { useEffect, useRef, useState } from 'react';
import { PerformanceManager, PerformanceConfig } from '@/lib/performance/performance-integration';

export const usePerformanceManager = (
  canvas: HTMLCanvasElement | null,
  config?: Partial<PerformanceConfig>
) => {
  const performanceManagerRef = useRef<PerformanceManager | null>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  // Initialize performance manager
  useEffect(() => {
    if (!canvas) return;

    const manager = new PerformanceManager(canvas, config);
    performanceManagerRef.current = manager;
    setIsReady(true);

    return () => {
      manager.destroy();
      performanceManagerRef.current = null;
      setIsReady(false);
    };
  }, [canvas, config]);

  // Update metrics periodically
  useEffect(() => {
    if (!isReady || !performanceManagerRef.current) return;

    const interval = setInterval(() => {
      const newMetrics = performanceManagerRef.current?.getPerformanceMetrics();
      setMetrics(newMetrics);
    }, 1000);

    return () => clearInterval(interval);
  }, [isReady]);

  return {
    performanceManager: performanceManagerRef.current,
    metrics,
    isReady,
    scheduleRender: (nodes: any[], viewport: any) => {
      performanceManagerRef.current?.scheduleRender(nodes, viewport);
    },
    queueOperation: (operation: any) => {
      performanceManagerRef.current?.queueOperation(operation);
    },
    hitTest: (point: { x: number; y: number }, nodes: any[]) => {
      return performanceManagerRef.current?.hitTest(point, nodes) || Promise.resolve([]);
    },
    loadAsset: (asset: any, element?: HTMLElement) => {
      return performanceManagerRef.current?.loadAsset(asset, element) || Promise.resolve(null);
    },
    observeElement: (element: HTMLElement, asset: any) => {
      performanceManagerRef.current?.observeElement(element, asset);
    },
    addTexture: (id: string, source: HTMLImageElement | HTMLCanvasElement) => {
      return performanceManagerRef.current?.addTexture(id, source) || false;
    },
    renderTexture: (
      ctx: CanvasRenderingContext2D,
      textureId: string,
      x: number,
      y: number,
      width?: number,
      height?: number
    ) => {
      return performanceManagerRef.current?.renderTexture(ctx, textureId, x, y, width, height) || false;
    },
  };
};