import React, { useRef, useCallback, useEffect } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';

interface TextResizeHandlesProps {
  elementId: string;
}

type HandlePosition = 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'w' | 'e';

const cursorMap: Record<HandlePosition, string> = {
  nw: 'nwse-resize',
  ne: 'nesw-resize',
  sw: 'nesw-resize',
  se: 'nwse-resize',
  n: 'ns-resize',
  s: 'ns-resize',
  w: 'ew-resize',
  e: 'ew-resize'
};

// ✅ المواقع على الحدود الخارجية تماماً (0 بدلاً من -4px)
const positionMap: Record<HandlePosition, React.CSSProperties> = {
  nw: { top: 0, left: 0, transform: 'translate(-50%, -50%)' },
  ne: { top: 0, right: 0, transform: 'translate(50%, -50%)' },
  sw: { bottom: 0, left: 0, transform: 'translate(-50%, 50%)' },
  se: { bottom: 0, right: 0, transform: 'translate(50%, 50%)' },
  n: { top: 0, left: '50%', transform: 'translate(-50%, -50%)' },
  s: { bottom: 0, left: '50%', transform: 'translate(-50%, 50%)' },
  w: { top: '50%', left: 0, transform: 'translate(-50%, -50%)' },
  e: { top: '50%', right: 0, transform: 'translate(50%, -50%)' }
};

interface TextResizeHandleProps {
  position: HandlePosition;
  elementId: string;
}

const TextResizeHandle: React.FC<TextResizeHandleProps> = ({ position, elementId }) => {
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

    // إضافة مستمعي الأحداث العالمية
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [elementId, elements]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizingRef.current) return;

    const deltaX = (e.clientX - startRef.current.x) / viewport.zoom;
    const deltaY = (e.clientY - startRef.current.y) / viewport.zoom;

    let newWidth = startRef.current.width;
    let newHeight = startRef.current.height;
    let newX = startRef.current.posX;
    let newY = startRef.current.posY;

    switch (position) {
      case 'nw':
        newWidth = Math.max(50, startRef.current.width - deltaX);
        newHeight = Math.max(20, startRef.current.height - deltaY);
        newX = startRef.current.posX + (startRef.current.width - newWidth);
        newY = startRef.current.posY + (startRef.current.height - newHeight);
        break;
      case 'ne':
        newWidth = Math.max(50, startRef.current.width + deltaX);
        newHeight = Math.max(20, startRef.current.height - deltaY);
        newY = startRef.current.posY + (startRef.current.height - newHeight);
        break;
      case 'sw':
        newWidth = Math.max(50, startRef.current.width - deltaX);
        newHeight = Math.max(20, startRef.current.height + deltaY);
        newX = startRef.current.posX + (startRef.current.width - newWidth);
        break;
      case 'se':
        newWidth = Math.max(50, startRef.current.width + deltaX);
        newHeight = Math.max(20, startRef.current.height + deltaY);
        break;
      case 'n':
        newHeight = Math.max(20, startRef.current.height - deltaY);
        newY = startRef.current.posY + (startRef.current.height - newHeight);
        break;
      case 's':
        newHeight = Math.max(20, startRef.current.height + deltaY);
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
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  return (
    <div
      className="resize-handle absolute w-2 h-2 bg-[hsl(var(--accent-green))] rounded-full z-10 hover:scale-125 transition-transform"
      style={{
        ...positionMap[position],
        cursor: cursorMap[position]
      }}
      onMouseDown={handleMouseDown}
    />
  );
};

export const TextResizeHandles: React.FC<TextResizeHandlesProps> = ({ elementId }) => {
  const positions: HandlePosition[] = ['nw', 'ne', 'sw', 'se', 'n', 's', 'w', 'e'];

  return (
    <>
      {positions.map(pos => (
        <TextResizeHandle key={pos} position={pos} elementId={elementId} />
      ))}
    </>
  );
};
