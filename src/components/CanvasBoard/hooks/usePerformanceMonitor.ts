import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  frameRate: number;
  memoryUsage?: number;
}

export const usePerformanceMonitor = (componentName: string) => {
  const renderStartTime = useRef<number>(0);
  const frameCount = useRef<number>(0);
  const lastTime = useRef<number>(performance.now());

  const startRender = useCallback(() => {
    renderStartTime.current = performance.now();
  }, []);

  const endRender = useCallback(() => {
    const renderTime = performance.now() - renderStartTime.current;
    
    // Frame rate calculation
    frameCount.current++;
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTime.current;
    
    if (deltaTime >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / deltaTime);
      
      const metrics: PerformanceMetrics = {
        renderTime,
        frameRate: fps,
        memoryUsage: (performance as any).memory?.usedJSHeapSize
      };

      // Log performance warning if needed
      if (renderTime > 16.67) { // 60fps threshold
        console.warn(`🐌 Slow render in ${componentName}:`, metrics);
      }
      
      frameCount.current = 0;
      lastTime.current = currentTime;
    }
  }, [componentName]);

  useEffect(() => {
    startRender();
    return () => {
      endRender();
    };
  });

  return { startRender, endRender };
};