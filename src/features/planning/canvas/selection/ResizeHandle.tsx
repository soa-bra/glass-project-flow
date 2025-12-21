import React, { useRef, useCallback, useEffect } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';

interface ResizeHandleProps {
  position: 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'w' | 'e';
  elementId: string;
}

const cursorMap = {
  nw: 'nwse-resize',
  ne: 'nesw-resize',
  sw: 'nesw-resize',
  se: 'nwse-resize',
  n: 'ns-resize',
  s: 'ns-resize',
  w: 'ew-resize',
  e: 'ew-resize'
};

const positionMap = {
  nw: { top: '-4px', left: '-4px' },
  ne: { top: '-4px', right: '-4px' },
  sw: { bottom: '-4px', left: '-4px' },
  se: { bottom: '-4px', right: '-4px' },
  n: { top: '-4px', left: '50%', transform: 'translateX(-50%)' },
  s: { bottom: '-4px', left: '50%', transform: 'translateX(-50%)' },
  w: { top: '50%', left: '-4px', transform: 'translateY(-50%)' },
  e: { top: '50%', right: '-4px', transform: 'translateY(-50%)' }
};

export const ResizeHandle: React.FC<ResizeHandleProps> = ({ position, elementId }) => {
  const { updateElement, viewport, elements } = useCanvasStore();
  const isResizingRef = useRef(false);
  const startRef = useRef({ x: 0, y: 0, width: 0, height: 0, posX: 0, posY: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const element = elements.find(el => el.id === elementId);
    if (!element) return;

    isResizingRef.current = true;
    startRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: element.size.width,
      height: element.size.height,
      posX: element.position.x,
      posY: element.position.y
    };
  }, [elementId, elements]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizingRef.current) return;

    const deltaX = (e.clientX - startRef.current.x) / viewport.zoom;
    const deltaY = (e.clientY - startRef.current.y) / viewport.zoom;

    let newWidth = startRef.current.width;
    let newHeight = startRef.current.height;
    let newX = startRef.current.posX;
    let newY = startRef.current.posY;

    // Calculate new dimensions based on handle position
    switch (position) {
      case 'nw':
        newWidth = Math.max(50, startRef.current.width - deltaX);
        newHeight = Math.max(50, startRef.current.height - deltaY);
        newX = startRef.current.posX + (startRef.current.width - newWidth);
        newY = startRef.current.posY + (startRef.current.height - newHeight);
        break;
      case 'ne':
        newWidth = Math.max(50, startRef.current.width + deltaX);
        newHeight = Math.max(50, startRef.current.height - deltaY);
        newY = startRef.current.posY + (startRef.current.height - newHeight);
        break;
      case 'sw':
        newWidth = Math.max(50, startRef.current.width - deltaX);
        newHeight = Math.max(50, startRef.current.height + deltaY);
        newX = startRef.current.posX + (startRef.current.width - newWidth);
        break;
      case 'se':
        newWidth = Math.max(50, startRef.current.width + deltaX);
        newHeight = Math.max(50, startRef.current.height + deltaY);
        break;
      case 'n':
        newHeight = Math.max(50, startRef.current.height - deltaY);
        newY = startRef.current.posY + (startRef.current.height - newHeight);
        break;
      case 's':
        newHeight = Math.max(50, startRef.current.height + deltaY);
        break;
      case 'w':
        newWidth = Math.max(50, startRef.current.width - deltaX);
        newX = startRef.current.posX + (startRef.current.width - newWidth);
        break;
      case 'e':
        newWidth = Math.max(50, startRef.current.width + deltaX);
        break;
    }

    updateElement(elementId, {
      size: { width: newWidth, height: newHeight },
      position: { x: newX, y: newY }
    });
  }, [elementId, updateElement, viewport, position]);

  const handleMouseUp = useCallback(() => {
    isResizingRef.current = false;
  }, []);

  useEffect(() => {
    if (isResizingRef.current) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div
      className="resize-handle absolute w-2 h-2 bg-[hsl(var(--accent-green))] rounded-full z-10"
      style={{
        ...positionMap[position],
        cursor: cursorMap[position]
      }}
      onMouseDown={handleMouseDown}
    />
  );
};
