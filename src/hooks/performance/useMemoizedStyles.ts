import { useMemo } from 'react';
import { CanvasElementType } from '@/types/canvas-elements';

// Memoized style calculations for Canvas elements
export const useMemoizedStyles = () => {
  // Canvas element transform calculation
  const getElementTransform = useMemo(() => 
    (x: number, y: number) => ({
      transform: `translate(${x}px, ${y}px)`,
    }), []);

  // Canvas element sizing
  const getElementSize = useMemo(() => 
    (width: number | string, height: number | string) => ({
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
    }), []);

  // Complete element style calculator
  const calculateElementStyle = useMemo(() => 
    (element: CanvasElementType) => {
      const baseStyle = {
        position: 'absolute' as const,
        ...getElementTransform(element.position.x, element.position.y),
        ...getElementSize(element.size.width, element.size.height),
      };

      return {
        ...baseStyle,
        ...element.style,
      };
    }, [getElementTransform, getElementSize]);

  // Canvas viewport styles
  const getCanvasViewportStyle = useMemo(() => 
    (zoom: number, panX: number, panY: number) => ({
      transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
      transformOrigin: 'top left',
    }), []);

  // Selection box styles
  const getSelectionBoxStyle = useMemo(() => 
    (x: number, y: number, width: number, height: number) => ({
      left: x,
      top: y,
      width,
      height,
    }), []);

  return {
    calculateElementStyle,
    getCanvasViewportStyle,
    getSelectionBoxStyle,
    getElementTransform,
    getElementSize,
  };
};

// Optimized CSS class builder
export const useOptimizedClasses = () => {
  const buildCanvasElementClasses = useMemo(() => 
    (type: string, isSelected: boolean = false, isLocked: boolean = false) => {
      const baseClasses = 'absolute select-none';
      const typeClasses = {
        text: 'cursor-text',
        shape: 'cursor-pointer',
        image: 'cursor-move',
        sticky: 'cursor-grab',
      };
      
      const stateClasses = [
        isSelected && 'ring-2 ring-blue-500',
        isLocked && 'opacity-75 cursor-not-allowed',
      ].filter(Boolean).join(' ');

      return [
        baseClasses,
        typeClasses[type as keyof typeof typeClasses] || 'cursor-pointer',
        stateClasses,
      ].filter(Boolean).join(' ');
    }, []);

  const buildSelectionBoxClasses = useMemo(() => 
    'absolute pointer-events-none border-2 border-blue-500 bg-blue-500/10', []);

  const buildResizeHandleClasses = useMemo(() => 
    'absolute w-2 h-2 bg-blue-500 border border-white rounded-sm cursor-pointer hover:bg-blue-600', []);

  return {
    buildCanvasElementClasses,
    buildSelectionBoxClasses,
    buildResizeHandleClasses,
  };
};