// Performance Optimized Hooks
import { useCallback, useMemo, useRef, useEffect } from 'react';
import type { CanvasElement } from '../../types/enhanced-canvas';

// Optimized Canvas State Hook
export const useOptimizedCanvasState = (initialElements: CanvasElement[] = []) => {
  const elementsRef = useRef<CanvasElement[]>(initialElements);
  const selectedIdsRef = useRef<Set<string>>(new Set());
  
  const addElement = useCallback((element: CanvasElement) => {
    elementsRef.current = [...elementsRef.current, element];
  }, []);

  const updateElement = useCallback((elementId: string, updates: Partial<CanvasElement>) => {
    elementsRef.current = elementsRef.current.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    );
  }, []);

  const deleteElement = useCallback((elementId: string) => {
    elementsRef.current = elementsRef.current.filter(el => el.id !== elementId);
    selectedIdsRef.current.delete(elementId);
  }, []);

  const selectElements = useCallback((elementIds: string[]) => {
    selectedIdsRef.current = new Set(elementIds);
  }, []);

  const selectedElements = useMemo(() => {
    return elementsRef.current.filter(el => selectedIdsRef.current.has(el.id));
  }, [elementsRef.current, selectedIdsRef.current]);

  return {
    elements: elementsRef.current,
    selectedElements,
    addElement,
    updateElement,
    deleteElement,
    selectElements
  };
};

// Optimized Selection Hook
export const useOptimizedSelection = (elements: CanvasElement[]) => {
  const selectionRef = useRef<Set<string>>(new Set());
  
  const toggleSelection = useCallback((elementId: string, multiSelect = false) => {
    if (!multiSelect) {
      selectionRef.current.clear();
    }
    
    if (selectionRef.current.has(elementId)) {
      selectionRef.current.delete(elementId);
    } else {
      selectionRef.current.add(elementId);
    }
  }, []);

  const clearSelection = useCallback(() => {
    selectionRef.current.clear();
  }, []);

  const isSelected = useCallback((elementId: string) => {
    return selectionRef.current.has(elementId);
  }, []);

  const selectedElementIds = useMemo(() => {
    return Array.from(selectionRef.current);
  }, [selectionRef.current]);

  return {
    selectedElementIds,
    toggleSelection,
    clearSelection,
    isSelected
  };
};

// Optimized Canvas Interactions Hook
export const useOptimizedCanvasInteractions = (
  canvasRef: React.RefObject<HTMLDivElement>,
  onElementUpdate: (elementId: string, updates: Partial<CanvasElement>) => void
) => {
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const dragElementRef = useRef<string | null>(null);

  const handleMouseDown = useCallback((event: React.MouseEvent, elementId?: string) => {
    if (elementId) {
      isDraggingRef.current = true;
      dragElementRef.current = elementId;
      dragStartRef.current = { x: event.clientX, y: event.clientY };
    }
  }, []);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (isDraggingRef.current && dragElementRef.current && dragStartRef.current) {
      const deltaX = event.clientX - dragStartRef.current.x;
      const deltaY = event.clientY - dragStartRef.current.y;
      
      // Throttle updates for performance
      if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
        onElementUpdate(dragElementRef.current, {
          position: { x: deltaX, y: deltaY }
        });
        dragStartRef.current = { x: event.clientX, y: event.clientY };
      }
    }
  }, [onElementUpdate]);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    dragElementRef.current = null;
    dragStartRef.current = null;
  }, []);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    isDragging: isDraggingRef.current
  };
};

// Optimized Render Hook - prevents unnecessary re-renders
export const useOptimizedRender = <T>(value: T, deps: React.DependencyList): T => {
  const memoizedValue = useMemo(() => value, deps);
  return memoizedValue;
};

// Debounced callback hook for performance
export const useDebouncedCallback = <T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  return useCallback((...args: Parameters<T>) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  }, [callback, delay]) as T;
};

// Virtualized list hook for large element collections
export const useVirtualizedElements = (
  elements: CanvasElement[],
  viewportBounds: { x: number; y: number; width: number; height: number },
  padding = 100
) => {
  return useMemo(() => {
    return elements.filter(element => {
      const elementBounds = {
        left: element.position.x,
        top: element.position.y,
        right: element.position.x + element.size.width,
        bottom: element.position.y + element.size.height
      };

      const viewport = {
        left: viewportBounds.x - padding,
        top: viewportBounds.y - padding,
        right: viewportBounds.x + viewportBounds.width + padding,
        bottom: viewportBounds.y + viewportBounds.height + padding
      };

      return (
        elementBounds.right >= viewport.left &&
        elementBounds.left <= viewport.right &&
        elementBounds.bottom >= viewport.top &&
        elementBounds.top <= viewport.bottom
      );
    });
  }, [elements, viewportBounds, padding]);
};