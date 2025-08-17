import { useCallback, useMemo, useRef } from 'react';
import { CanvasElementType } from '@/types/canvas-elements';

// Canvas-specific performance optimization
export const useCanvasOptimization = () => {
  const renderQueueRef = useRef<Map<string, CanvasElementType>>(new Map());
  const frameRequestRef = useRef<number>();

  // Batch element updates to reduce re-renders
  const batchElementUpdates = useCallback((elements: CanvasElementType[]) => {
    elements.forEach(element => {
      renderQueueRef.current.set(element.id, element);
    });

    if (frameRequestRef.current) {
      cancelAnimationFrame(frameRequestRef.current);
    }

    frameRequestRef.current = requestAnimationFrame(() => {
      // Process batched updates
      const elementsToUpdate = Array.from(renderQueueRef.current.values());
      renderQueueRef.current.clear();
      
      // Return processed elements
      return elementsToUpdate;
    });
  }, []);

  // Optimize visibility calculation
  const calculateVisibleElements = useMemo(() => 
    (elements: CanvasElementType[], viewport: { x: number; y: number; width: number; height: number; zoom: number }) => {
      return elements.filter(element => {
        const elementBounds = {
          left: element.position.x * viewport.zoom + viewport.x,
          top: element.position.y * viewport.zoom + viewport.y,
          right: (element.position.x + element.size.width) * viewport.zoom + viewport.x,
          bottom: (element.position.y + element.size.height) * viewport.zoom + viewport.y,
        };

        return !(
          elementBounds.right < 0 ||
          elementBounds.left > viewport.width ||
          elementBounds.bottom < 0 ||
          elementBounds.top > viewport.height
        );
      });
    }, []);

  // Optimize selection calculations
  const optimizeSelectionCheck = useCallback((
    element: CanvasElementType,
    selectionBox: { x: number; y: number; width: number; height: number }
  ) => {
    return (
      element.position.x < selectionBox.x + selectionBox.width &&
      element.position.x + element.size.width > selectionBox.x &&
      element.position.y < selectionBox.y + selectionBox.height &&
      element.position.y + element.size.height > selectionBox.y
    );
  }, []);

  // Throttled pan operations
  const throttledPan = useCallback((
    callback: (x: number, y: number) => void,
    delay: number = 16
  ) => {
    let lastCall = 0;
    return (x: number, y: number) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        callback(x, y);
      }
    };
  }, []);

  return {
    batchElementUpdates,
    calculateVisibleElements,
    optimizeSelectionCheck,
    throttledPan,
  };
};

// Specialized hook for large canvas operations
export const useLargeCanvasOptimization = (elementCount: number) => {
  const shouldUseVirtualization = elementCount > 1000;
  const chunkSize = 100;

  const processElementsInChunks = useCallback(
    (elements: CanvasElementType[], processor: (chunk: CanvasElementType[]) => void) => {
      if (!shouldUseVirtualization) {
        processor(elements);
        return;
      }

      // Process in chunks for large datasets
      for (let i = 0; i < elements.length; i += chunkSize) {
        const chunk = elements.slice(i, i + chunkSize);
        // Use setTimeout to yield control to browser
        setTimeout(() => processor(chunk), 0);
      }
    },
    [shouldUseVirtualization]
  );

  return {
    shouldUseVirtualization,
    processElementsInChunks,
    chunkSize,
  };
};