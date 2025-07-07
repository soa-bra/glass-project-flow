import React from 'react';
import { CanvasElement } from '../types';

interface ElementResizeHandlesProps {
  element: CanvasElement;
  selectedElementId: string | null;
  selectedTool: string;
  onResizeMouseDown: (e: React.MouseEvent, handle: string) => void;
}

export const ElementResizeHandles: React.FC<ElementResizeHandlesProps> = ({
  element,
  selectedElementId,
  selectedTool,
  onResizeMouseDown
}) => {
  if (selectedElementId !== element.id || selectedTool !== 'select') {
    return null;
  }

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: element.position.x - 4,
        top: element.position.y - 4,
        width: element.size.width + 8,
        height: element.size.height + 8
      }}
    >
      {/* Bounding Box Border */}
      <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none" />
      
      {/* Corner Handles */}
      <div
        className="absolute w-3 h-3 bg-white border-2 border-blue-500 cursor-nw-resize pointer-events-auto"
        style={{ left: -2, top: -2 }}
        onMouseDown={(e) => onResizeMouseDown(e, 'nw')}
      />
      <div
        className="absolute w-3 h-3 bg-white border-2 border-blue-500 cursor-ne-resize pointer-events-auto"
        style={{ right: -2, top: -2 }}
        onMouseDown={(e) => onResizeMouseDown(e, 'ne')}
      />
      <div
        className="absolute w-3 h-3 bg-white border-2 border-blue-500 cursor-sw-resize pointer-events-auto"
        style={{ left: -2, bottom: -2 }}
        onMouseDown={(e) => onResizeMouseDown(e, 'sw')}
      />
      <div
        className="absolute w-3 h-3 bg-white border-2 border-blue-500 cursor-se-resize pointer-events-auto"
        style={{ right: -2, bottom: -2 }}
        onMouseDown={(e) => onResizeMouseDown(e, 'se')}
      />
      
      {/* Side Handles */}
      <div
        className="absolute w-3 h-3 bg-white border-2 border-blue-500 cursor-n-resize pointer-events-auto"
        style={{ left: '50%', top: -2, transform: 'translateX(-50%)' }}
        onMouseDown={(e) => onResizeMouseDown(e, 'n')}
      />
      <div
        className="absolute w-3 h-3 bg-white border-2 border-blue-500 cursor-s-resize pointer-events-auto"
        style={{ left: '50%', bottom: -2, transform: 'translateX(-50%)' }}
        onMouseDown={(e) => onResizeMouseDown(e, 's')}
      />
      <div
        className="absolute w-3 h-3 bg-white border-2 border-blue-500 cursor-w-resize pointer-events-auto"
        style={{ left: -2, top: '50%', transform: 'translateY(-50%)' }}
        onMouseDown={(e) => onResizeMouseDown(e, 'w')}
      />
      <div
        className="absolute w-3 h-3 bg-white border-2 border-blue-500 cursor-e-resize pointer-events-auto"
        style={{ right: -2, top: '50%', transform: 'translateY(-50%)' }}
        onMouseDown={(e) => onResizeMouseDown(e, 'e')}
      />
    </div>
  );
};