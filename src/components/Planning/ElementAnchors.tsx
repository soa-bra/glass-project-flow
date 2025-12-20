import React, { useCallback, useMemo } from 'react';
import type { CanvasElement } from '@/types/canvas';
import { getAnchorPosition } from '@/types/mindmap-canvas';

interface ElementAnchorsProps {
  element: CanvasElement;
  isConnecting: boolean;
  nearestAnchor: { nodeId: string; anchor: string; position: { x: number; y: number } } | null;
  onStartConnection: (nodeId: string, anchor: 'top' | 'bottom' | 'left' | 'right', position: { x: number; y: number }) => void;
  onEndConnection: (nodeId: string, anchor: 'top' | 'bottom' | 'left' | 'right') => void;
}

const ANCHORS: ('top' | 'bottom' | 'left' | 'right')[] = ['top', 'bottom', 'left', 'right'];

const ElementAnchors: React.FC<ElementAnchorsProps> = ({
  element,
  isConnecting,
  nearestAnchor,
  onStartConnection,
  onEndConnection
}) => {
  // حساب موقع كل anchor
  const anchorPositions = useMemo(() => {
    return ANCHORS.map(anchor => {
      const pos = getAnchorPosition({ x: 0, y: 0 }, element.size, anchor);
      return { anchor, ...pos };
    });
  }, [element.size]);

  const handleMouseDown = useCallback((e: React.MouseEvent, anchor: 'top' | 'bottom' | 'left' | 'right') => {
    e.stopPropagation();
    e.preventDefault();
    
    const anchorPos = getAnchorPosition(element.position, element.size, anchor);
    onStartConnection(element.id, anchor, anchorPos);
  }, [element, onStartConnection]);

  const handleMouseUp = useCallback((e: React.MouseEvent, anchor: 'top' | 'bottom' | 'left' | 'right') => {
    e.stopPropagation();
    
    if (isConnecting) {
      onEndConnection(element.id, anchor);
    }
  }, [element.id, isConnecting, onEndConnection]);

  return (
    <>
      {anchorPositions.map(({ anchor, x, y }) => {
        const isHighlighted = nearestAnchor?.nodeId === element.id && nearestAnchor?.anchor === anchor;
        
        return (
          <div
            key={anchor}
            className={`absolute w-4 h-4 rounded-full border-2 cursor-crosshair transition-all z-50 ${
              isHighlighted 
                ? 'bg-[hsl(var(--accent-green))] border-white scale-150 shadow-lg' 
                : isConnecting
                  ? 'bg-[hsl(var(--accent-blue))] border-white hover:scale-125'
                  : 'bg-white border-[hsl(var(--border))] hover:bg-[hsl(var(--accent-green))] hover:border-white hover:scale-125'
            }`}
            style={{ 
              left: x - 8, 
              top: y - 8,
              pointerEvents: 'auto'
            }}
            onMouseDown={(e) => handleMouseDown(e, anchor)}
            onMouseUp={(e) => handleMouseUp(e, anchor)}
            title={`نقطة ربط: ${anchor === 'top' ? 'أعلى' : anchor === 'bottom' ? 'أسفل' : anchor === 'left' ? 'يسار' : 'يمين'}`}
          />
        );
      })}
    </>
  );
};

export default ElementAnchors;
