
import React, { useState, useCallback, useEffect } from 'react';
import { CanvasElement } from '../types';

interface SimplifiedSelectionBoundingBoxProps {
  selectedElements: CanvasElement[];
  zoom: number;
  canvasPosition: { x: number; y: number };
  onUpdateElement: (elementId: string, updates: Partial<CanvasElement>) => void;
  snapEnabled: boolean;
}

export const SimplifiedSelectionBoundingBox: React.FC<SimplifiedSelectionBoundingBoxProps> = ({
  selectedElements,
  zoom,
  canvasPosition,
  onUpdateElement,
  snapEnabled
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState('');

  if (selectedElements.length === 0) return null;

  // Calculate bounding box
  const calculateBounds = () => {
    const bounds = selectedElements.reduce((acc, element) => {
      const left = element.position.x;
      const top = element.position.y;
      const right = left + element.size.width;
      const bottom = top + element.size.height;

      return {
        left: Math.min(acc.left, left),
        top: Math.min(acc.top, top),
        right: Math.max(acc.right, right),
        bottom: Math.max(acc.bottom, bottom)
      };
    }, { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity });

    return {
      x: bounds.left,
      y: bounds.top,
      width: bounds.right - bounds.left,
      height: bounds.bottom - bounds.top
    };
  };

  const bounds = calculateBounds();
  const zoomFactor = zoom / 100;

  const handleResizeStart = (handle: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);
  };

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    // Basic resize logic - can be enhanced later
    const deltaX = e.movementX / zoomFactor;
    const deltaY = e.movementY / zoomFactor;
    
    // Apply minimal resize for now
    selectedElements.forEach(element => {
      const newWidth = Math.max(20, element.size.width + (resizeHandle.includes('e') ? deltaX : 0));
      const newHeight = Math.max(20, element.size.height + (resizeHandle.includes('s') ? deltaY : 0));
      
      onUpdateElement(element.id, {
        size: { width: newWidth, height: newHeight }
      });
    });
  }, [isResizing, resizeHandle, zoomFactor, selectedElements, onUpdateElement]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    setResizeHandle('');
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  return (
    <div
      className="absolute border-2 border-blue-500 border-dashed bg-blue-500/10 pointer-events-none"
      style={{
        left: (bounds.x + canvasPosition.x) * zoomFactor,
        top: (bounds.y + canvasPosition.y) * zoomFactor,
        width: bounds.width * zoomFactor,
        height: bounds.height * zoomFactor,
        zIndex: 1001
      }}
    >
      {/* Corner resize handles */}
      <div 
        className="absolute w-3 h-3 bg-blue-500 border border-white cursor-se-resize pointer-events-auto hover:bg-blue-600"
        style={{ bottom: -6, right: -6 }}
        onMouseDown={(e) => handleResizeStart('se', e)}
      />
      <div 
        className="absolute w-3 h-3 bg-blue-500 border border-white cursor-sw-resize pointer-events-auto hover:bg-blue-600"
        style={{ bottom: -6, left: -6 }}
        onMouseDown={(e) => handleResizeStart('sw', e)}
      />
      <div 
        className="absolute w-3 h-3 bg-blue-500 border border-white cursor-ne-resize pointer-events-auto hover:bg-blue-600"
        style={{ top: -6, right: -6 }}
        onMouseDown={(e) => handleResizeStart('ne', e)}
      />
      <div 
        className="absolute w-3 h-3 bg-blue-500 border border-white cursor-nw-resize pointer-events-auto hover:bg-blue-600"
        style={{ top: -6, left: -6 }}
        onMouseDown={(e) => handleResizeStart('nw', e)}
      />
      
      {/* Side resize handles */}
      <div 
        className="absolute w-3 h-2 bg-blue-500 border border-white cursor-e-resize pointer-events-auto hover:bg-blue-600"
        style={{ top: '50%', right: -6, transform: 'translateY(-50%)' }}
        onMouseDown={(e) => handleResizeStart('e', e)}
      />
      <div 
        className="absolute w-3 h-2 bg-blue-500 border border-white cursor-w-resize pointer-events-auto hover:bg-blue-600"
        style={{ top: '50%', left: -6, transform: 'translateY(-50%)' }}
        onMouseDown={(e) => handleResizeStart('w', e)}
      />
      <div 
        className="absolute w-2 h-3 bg-blue-500 border border-white cursor-n-resize pointer-events-auto hover:bg-blue-600"
        style={{ top: -6, left: '50%', transform: 'translateX(-50%)' }}
        onMouseDown={(e) => handleResizeStart('n', e)}
      />
      <div 
        className="absolute w-2 h-3 bg-blue-500 border border-white cursor-s-resize pointer-events-auto hover:bg-blue-600"
        style={{ bottom: -6, left: '50%', transform: 'translateX(-50%)' }}
        onMouseDown={(e) => handleResizeStart('s', e)}
      />
      
      {/* Rotation handle */}
      <div 
        className="absolute w-3 h-3 bg-green-500 border border-white cursor-crosshair pointer-events-auto hover:bg-green-600 rounded-full"
        style={{ top: -20, left: '50%', transform: 'translateX(-50%)' }}
        onMouseDown={(e) => handleResizeStart('rotate', e)}
      />
      
      {/* Rotation line */}
      <div 
        className="absolute w-0.5 h-3 bg-green-500 pointer-events-none"
        style={{ top: -17, left: '50%', transform: 'translateX(-50%)' }}
      />
    </div>
  );
};
