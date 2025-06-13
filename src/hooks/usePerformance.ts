
import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  isSlowRender: boolean;
}

export const usePerformance = (componentName: string): PerformanceMetrics => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
    isSlowRender: false
  });

  useEffect(() => {
    const startTime = performance.now();
    
    // قياس الذاكرة إذا كانت متوفرة
    const memoryInfo = (performance as any).memory;
    const memoryUsage = memoryInfo ? memoryInfo.usedJSHeapSize : 0;
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      const isSlowRender = renderTime > 16; // أكثر من 16ms يعتبر بطيء
      
      setMetrics({
        renderTime,
        memoryUsage,
        isSlowRender
      });
      
      if (isSlowRender) {
        console.warn(`${componentName} rendered slowly: ${renderTime}ms`);
      }
    };
  });

  return metrics;
};

export const useMemoryMonitor = () => {
  const [memoryUsage, setMemoryUsage] = useState(0);

  useEffect(() => {
    const checkMemory = () => {
      const memoryInfo = (performance as any).memory;
      if (memoryInfo) {
        setMemoryUsage(memoryInfo.usedJSHeapSize);
      }
    };

    const interval = setInterval(checkMemory, 5000); // كل 5 ثواني
    return () => clearInterval(interval);
  }, []);

  return memoryUsage;
};
