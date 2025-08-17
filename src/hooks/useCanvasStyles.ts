import { useMemo } from 'react';
import { generateCanvasElementClasses, convertCompleteStyle } from '@/utils/styleConverter';
import { DYNAMIC_CLASSES } from '@/components/shared/design-system/constants';

interface CanvasElementPosition {
  x: number;
  y: number;
}

interface CanvasElementSize {
  width: number;
  height: number;
}

interface UseCanvasStylesProps {
  position: CanvasElementPosition;
  size: CanvasElementSize;
  style?: React.CSSProperties;
  zoom?: number;
  isSelected?: boolean;
}

export const useCanvasStyles = ({
  position,
  size,
  style = {},
  zoom = 1,
  isSelected = false
}: UseCanvasStylesProps) => {
  
  // Memoized element classes
  const elementClasses = useMemo(() => {
    const baseClasses = 'absolute cursor-move';
    const positionClasses = DYNAMIC_CLASSES.createPositionClasses(position.x, position.y);
    const sizeClasses = DYNAMIC_CLASSES.createSizeClasses(size.width, size.height);
    const styleClasses = convertCompleteStyle(style);
    const selectionClasses = isSelected ? 'ring-2 ring-blue-500 z-[1000]' : 'z-[1]';
    
    return `${baseClasses} ${positionClasses} ${sizeClasses} ${styleClasses} ${selectionClasses}`;
  }, [position.x, position.y, size.width, size.height, style, isSelected]);

  // Memoized transform classes for zoom
  const transformClasses = useMemo(() => {
    if (zoom === 1) return '';
    return DYNAMIC_CLASSES.createTransformClasses(zoom, 0, 0);
  }, [zoom]);

  // Memoized container classes for Canvas viewport
  const viewportClasses = useMemo(() => {
    return 'absolute inset-0 pointer-events-none origin-top-left';
  }, []);

  // Memoized bounding box classes
  const boundingBoxClasses = useMemo(() => (
    x: number, 
    y: number, 
    width: number, 
    height: number, 
    zoomFactor: number
  ) => {
    const positionClasses = DYNAMIC_CLASSES.createPositionClasses(x * zoomFactor, y * zoomFactor);
    const sizeClasses = DYNAMIC_CLASSES.createSizeClasses(width * zoomFactor, height * zoomFactor);
    return `absolute border-2 border-blue-500 border-dashed bg-blue-500/10 pointer-events-none z-[1001] ${positionClasses} ${sizeClasses}`;
  }, []);

  // Memoized resize handle classes
  const resizeHandleClasses = useMemo(() => {
    return {
      base: 'absolute w-3 h-3 bg-blue-500 border border-white pointer-events-auto hover:bg-blue-600',
      topLeft: 'top-[-6px] left-[-6px] cursor-nw-resize',
      topRight: 'top-[-6px] right-[-6px] cursor-ne-resize',
      bottomLeft: 'bottom-[-6px] left-[-6px] cursor-sw-resize',
      bottomRight: 'bottom-[-6px] right-[-6px] cursor-se-resize',
      topCenter: 'top-[-6px] left-1/2 transform -translate-x-1/2 cursor-n-resize',
      bottomCenter: 'bottom-[-6px] left-1/2 transform -translate-x-1/2 cursor-s-resize',
      leftCenter: 'top-1/2 left-[-6px] transform -translate-y-1/2 cursor-w-resize',
      rightCenter: 'top-1/2 right-[-6px] transform -translate-y-1/2 cursor-e-resize',
    };
  }, []);

  return {
    elementClasses,
    transformClasses,
    viewportClasses,
    boundingBoxClasses,
    resizeHandleClasses,
    convertCompleteStyle,
  };
};

// Utility hook for style preset previews
export const useStylePresetClasses = (style: any) => {
  return useMemo(() => {
    const bgClass = style.backgroundColor ? DYNAMIC_CLASSES.createBgColorClass(style.backgroundColor) : 'bg-gray-100';
    const borderClass = style.stroke && style.strokeWidth ? DYNAMIC_CLASSES.createBorderClass(style.stroke, style.strokeWidth) : 'border';
    const radiusClass = style.borderRadius ? DYNAMIC_CLASSES.createBorderRadiusClass(style.borderRadius) : 'rounded';
    const shadowClass = style.boxShadow ? DYNAMIC_CLASSES.createBoxShadowClass(style.boxShadow) : '';
    const textSizeClass = style.fontSize ? DYNAMIC_CLASSES.createFontSizeClass(Math.min(style.fontSize, 12)) : 'text-xs';
    const textColorClass = style.fill ? `text-[${style.fill}]` : 'text-gray-600';
    
    return `w-full h-16 rounded border flex items-center justify-center ${bgClass} ${borderClass} ${radiusClass} ${shadowClass} ${textSizeClass} ${textColorClass}`;
  }, [style]);
};