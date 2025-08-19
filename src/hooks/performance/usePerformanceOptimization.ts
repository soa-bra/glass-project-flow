import { useCallback, useMemo, useRef, useEffect } from 'react';

// Performance optimization hook for heavy Canvas operations
export const usePerformanceOptimization = () => {
  const frameRef = useRef<number>();
  const operationsQueue = useRef<(() => void)[]>([]);

  // Throttled execution for performance-heavy operations
  const throttleOperation = useCallback((operation: () => void, delay = 16) => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }
    
    frameRef.current = requestAnimationFrame(() => {
      setTimeout(operation, delay);
    });
  }, []);

  // Batch operations to reduce re-renders
  const batchOperations = useCallback((operations: (() => void)[]) => {
    operationsQueue.current = [...operationsQueue.current, ...operations];
    
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }
    
    frameRef.current = requestAnimationFrame(() => {
      const currentOperations = [...operationsQueue.current];
      operationsQueue.current = [];
      currentOperations.forEach(op => op());
    });
  }, []);

  // Memoized style calculator
  const calculateElementStyle = useMemo(() => (element: any) => {
    return {
      transform: `translate(${element.position?.x || 0}px, ${element.position?.y || 0}px)`,
      width: element.size?.width || 'auto',
      height: element.size?.height || 'auto',
      ...element.style
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return {
    throttleOperation,
    batchOperations,
    calculateElementStyle
  };
};

// Optimized selector hook with memoization
export const useOptimizedSelector = <T>(
  selector: () => T,
  deps: React.DependencyList
): T => {
  return useMemo(selector, deps);
};

// Debounced callback hook
export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList
): T => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay, ...deps]
  );
};