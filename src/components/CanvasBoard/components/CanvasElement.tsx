
import React from 'react';
import { CanvasElement as CanvasElementType } from '../types';

interface CanvasElementProps {
  element: CanvasElementType;
  selectedElementId: string | null;
  selectedTool: string;
  onElementSelect: (id: string) => void;
  onElementMouseDown: (e: React.MouseEvent, elementId: string) => void;
  onElementMouseMove: (e: React.MouseEvent) => void;
  onElementMouseUp: () => void;
  onResizeMouseDown: (e: React.MouseEvent, handle: string) => void;
}

export const CanvasElement: React.FC<CanvasElementProps> = ({
  element,
  selectedElementId,
  selectedTool,
  onElementSelect,
  onElementMouseDown,
  onElementMouseMove,
  onElementMouseUp,
  onResizeMouseDown
}) => {
  const isSelected = selectedElementId === element.id;

  const getElementContent = () => {
    switch (element.type) {
      case 'drawing':
        if (!element.path || element.path.length < 2) return null;
        
        const pathString = element.path
          .map((point, index) => (index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`))
          .join(' ');

        return (
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{
              left: 0,
              top: 0,
              width: '100%',
              height: '100%'
            }}
          >
            <path
              d={pathString}
              fill="none"
              stroke={element.color || '#000000'}
              strokeWidth={element.lineWidth || 2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );

      case 'text':
        return (
          <div className="p-2 bg-transparent text-black font-arabic text-sm">
            {element.content || 'نص جديد'}
          </div>
        );

      case 'shape':
        return (
          <div className="w-full h-full bg-blue-100 border-2 border-blue-500 rounded-lg" />
        );

      case 'smart-element':
        return (
          <div className="w-full h-full bg-green-100 border-2 border-green-500 rounded-lg flex items-center justify-center font-arabic text-sm">
            عنصر ذكي
          </div>
        );

      default:
        return (
          <div className="w-full h-full bg-gray-100 border border-gray-300 rounded" />
        );
    }
  };

  // Calculate bounds for drawing elements
  const getBounds = () => {
    if (element.type === 'drawing' && element.path && element.path.length > 0) {
      const xCoords = element.path.map(p => p.x);
      const yCoords = element.path.map(p => p.y);
      const minX = Math.min(...xCoords);
      const minY = Math.min(...yCoords);
      const maxX = Math.max(...xCoords);
      const maxY = Math.max(...yCoords);
      
      return {
        x: minX - (element.lineWidth || 2) / 2,
        y: minY - (element.lineWidth || 2) / 2,
        width: maxX - minX + (element.lineWidth || 2),
        height: maxY - minY + (element.lineWidth || 2)
      };
    }

    return {
      x: element.position.x,
      y: element.position.y,
      width: element.size.width,
      height: element.size.height
    };
  };

  const bounds = getBounds();

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onElementSelect(element.id);
    onElementMouseDown(e, element.id);
  };

  return (
    <div
      className={`absolute cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        left: bounds.x,
        top: bounds.y,
        width: bounds.width,
        height: bounds.height,
        zIndex: element.zIndex || 1
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={onElementMouseMove}
      onMouseUp={onElementMouseUp}
    >
      {getElementContent()}
      
      {/* Resize handles for selected elements (except drawings) */}
      {isSelected && selectedTool === 'select' && element.type !== 'drawing' && (
        <>
          {['nw', 'ne', 'sw', 'se'].map(handle => (
            <div
              key={handle}
              className="absolute w-2 h-2 bg-blue-500 border border-white cursor-pointer"
              style={{
                [handle.includes('n') ? 'top' : 'bottom']: -4,
                [handle.includes('w') ? 'left' : 'right']: -4,
                cursor: `${handle}-resize`
              }}
              onMouseDown={(e) => onResizeMouseDown(e, handle)}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default CanvasElement;
