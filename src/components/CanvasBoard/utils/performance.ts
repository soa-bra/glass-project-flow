/**
 * @fileoverview Performance optimization utilities for Canvas Board
 * @author AI Assistant
 * @version 1.0.0
 */

import { useMemo, useCallback } from 'react';
import { CanvasElement, Layer } from '@/types/canvas';

/**
 * Hook to optimize element filtering
 */
export const useOptimizedElements = (
  elements: CanvasElement[],
  selectedElementIds: string[]
) => {
  const selectedElements = useMemo(() => {
    return elements.filter(el => selectedElementIds.includes(el.id));
  }, [elements, selectedElementIds]);

  const visibleElements = useMemo(() => {
    return elements.filter(el => el.visible !== false);
  }, [elements]);

  const elementsByLayer = useMemo(() => {
    return elements.reduce((acc, element) => {
      const layerId = element.layerId || 'default';
      if (!acc[layerId]) acc[layerId] = [];
      acc[layerId].push(element);
      return acc;
    }, {} as Record<string, CanvasElement[]>);
  }, [elements]);

  return {
    selectedElements,
    visibleElements,
    elementsByLayer
  };
};

/**
 * Hook to optimize layer operations
 */
export const useOptimizedLayers = (layers: Layer[]) => {
  const visibleLayers = useMemo(() => {
    return layers.filter(layer => layer.visible);
  }, [layers]);

  const layerMap = useMemo(() => {
    return layers.reduce((acc, layer) => {
      acc[layer.id] = layer;
      return acc;
    }, {} as Record<string, Layer>);
  }, [layers]);

  return {
    visibleLayers,
    layerMap
  };
};

/**
 * Hook for debounced canvas operations
 */
export const useDebouncedCanvasOperations = () => {
  const debouncedSave = useCallback(
    debounce((saveFunction: () => void) => {
      saveFunction();
    }, 1000),
    []
  );

  const debouncedUpdate = useCallback(
    debounce((updateFunction: () => void) => {
      updateFunction();
    }, 100),
    []
  );

  return {
    debouncedSave,
    debouncedUpdate
  };
};

/**
 * Simple debounce utility
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Memoized element renderer props
 */
export const createElementProps = (
  element: CanvasElement,
  isSelected: boolean,
  callbacks: {
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: () => void;
  }
) => {
  return {
    key: element.id,
    element,
    isSelected,
    ...callbacks
  };
};