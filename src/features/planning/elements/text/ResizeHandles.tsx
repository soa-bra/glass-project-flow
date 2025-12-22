/**
 * ResizeHandles - مقابض تغيير الحجم
 * Visual resize handles for text elements
 */
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type HandlePosition = 
  | 'top-left' | 'top' | 'top-right'
  | 'left' | 'right'
  | 'bottom-left' | 'bottom' | 'bottom-right';

interface ResizeHandlesProps {
  visible: boolean;
  onResizeStart: (handle: HandlePosition, e: React.MouseEvent) => void;
  activeHandle?: HandlePosition | null;
  elementType?: 'line' | 'box';
}

const HANDLE_SIZE = 8;
const HANDLE_OFFSET = -4;

export const ResizeHandles: React.FC<ResizeHandlesProps> = ({
  visible,
  onResizeStart,
  activeHandle,
  elementType = 'box'
}) => {
  // لعنصر النص السطري (line) نعرض مقابض أفقية فقط
  const handles: HandlePosition[] = elementType === 'line'
    ? ['left', 'right']
    : ['top-left', 'top', 'top-right', 'left', 'right', 'bottom-left', 'bottom', 'bottom-right'];

  const getHandleStyle = (position: HandlePosition): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'absolute',
      width: HANDLE_SIZE,
      height: HANDLE_SIZE,
      backgroundColor: 'hsl(var(--background))',
      border: '2px solid hsl(var(--accent-blue))',
      borderRadius: '2px',
      cursor: getCursor(position),
      zIndex: 10,
    };

    switch (position) {
      case 'top-left':
        return { ...base, top: HANDLE_OFFSET, left: HANDLE_OFFSET };
      case 'top':
        return { ...base, top: HANDLE_OFFSET, left: '50%', transform: 'translateX(-50%)' };
      case 'top-right':
        return { ...base, top: HANDLE_OFFSET, right: HANDLE_OFFSET };
      case 'left':
        return { ...base, top: '50%', left: HANDLE_OFFSET, transform: 'translateY(-50%)' };
      case 'right':
        return { ...base, top: '50%', right: HANDLE_OFFSET, transform: 'translateY(-50%)' };
      case 'bottom-left':
        return { ...base, bottom: HANDLE_OFFSET, left: HANDLE_OFFSET };
      case 'bottom':
        return { ...base, bottom: HANDLE_OFFSET, left: '50%', transform: 'translateX(-50%)' };
      case 'bottom-right':
        return { ...base, bottom: HANDLE_OFFSET, right: HANDLE_OFFSET };
      default:
        return base;
    }
  };

  const getCursor = (position: HandlePosition): string => {
    switch (position) {
      case 'top-left':
      case 'bottom-right':
        return 'nwse-resize';
      case 'top-right':
      case 'bottom-left':
        return 'nesw-resize';
      case 'top':
      case 'bottom':
        return 'ns-resize';
      case 'left':
      case 'right':
        return 'ew-resize';
      default:
        return 'move';
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* إطار التحديد - Selection Border */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          border: '2px solid hsl(var(--accent-blue))',
          borderRadius: '4px'
        }}
      />
      
      {/* المقابض - Handles */}
      {handles.map((position) => (
        <motion.div
          key={position}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.1 }}
          style={getHandleStyle(position)}
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onResizeStart(position, e);
          }}
          className={cn(
            "transition-all hover:scale-125",
            activeHandle === position && "scale-125 bg-[hsl(var(--accent-blue))]"
          )}
        />
      ))}
    </>
  );
};

/**
 * حساب التغيير في الحجم بناءً على موضع المقبض
 * Calculate size delta based on handle position
 */
export const calculateResizeDelta = (
  handle: HandlePosition,
  startPos: { x: number; y: number },
  currentPos: { x: number; y: number },
  startSize: { width: number; height: number },
  startPosition: { x: number; y: number }
): {
  newSize: { width: number; height: number };
  newPosition: { x: number; y: number };
} => {
  const dx = currentPos.x - startPos.x;
  const dy = currentPos.y - startPos.y;
  
  let newWidth = startSize.width;
  let newHeight = startSize.height;
  let newX = startPosition.x;
  let newY = startPosition.y;

  const minWidth = 50;
  const minHeight = 24;

  switch (handle) {
    case 'right':
      newWidth = Math.max(minWidth, startSize.width + dx);
      break;
    case 'left':
      newWidth = Math.max(minWidth, startSize.width - dx);
      newX = startPosition.x + (startSize.width - newWidth);
      break;
    case 'bottom':
      newHeight = Math.max(minHeight, startSize.height + dy);
      break;
    case 'top':
      newHeight = Math.max(minHeight, startSize.height - dy);
      newY = startPosition.y + (startSize.height - newHeight);
      break;
    case 'bottom-right':
      newWidth = Math.max(minWidth, startSize.width + dx);
      newHeight = Math.max(minHeight, startSize.height + dy);
      break;
    case 'bottom-left':
      newWidth = Math.max(minWidth, startSize.width - dx);
      newHeight = Math.max(minHeight, startSize.height + dy);
      newX = startPosition.x + (startSize.width - newWidth);
      break;
    case 'top-right':
      newWidth = Math.max(minWidth, startSize.width + dx);
      newHeight = Math.max(minHeight, startSize.height - dy);
      newY = startPosition.y + (startSize.height - newHeight);
      break;
    case 'top-left':
      newWidth = Math.max(minWidth, startSize.width - dx);
      newHeight = Math.max(minHeight, startSize.height - dy);
      newX = startPosition.x + (startSize.width - newWidth);
      newY = startPosition.y + (startSize.height - newHeight);
      break;
  }

  return {
    newSize: { width: newWidth, height: newHeight },
    newPosition: { x: newX, y: newY }
  };
};
