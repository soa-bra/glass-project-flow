
import React, { memo } from 'react';
import { CanvasElement as CanvasElementType } from '../../types';

interface CanvasElementProps {
  element: CanvasElementType;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
}

export const CanvasElement = memo<CanvasElementProps>(({
  element,
  isSelected,
  onMouseDown,
  onMouseMove,
  onMouseUp
}) => {
  const renderElementContent = () => {
    switch (element.type) {
      case 'text':
        return (
          <div
            className="p-2 bg-white border border-gray-300 rounded"
            style={element.style}
          >
            {element.content || 'نص جديد'}
          </div>
        );
      
      case 'sticky':
        return (
          <div
            className="p-3 bg-yellow-200 border border-yellow-400 rounded shadow-sm"
            style={element.style}
          >
            {element.content || 'ملاحظة جديدة'}
          </div>
        );
      
      case 'shape':
        return (
          <div
            className="bg-blue-500 border-2 border-blue-700 rounded"
            style={element.style}
          />
        );
      
      case 'comment':
        return (
          <div
            className="p-2 bg-orange-100 border border-orange-300 rounded shadow-sm"
            style={element.style}
          >
            💬 {element.content || 'تعليق'}
          </div>
        );
      
      case 'upload':
        return (
          <div
            className="p-2 bg-gray-100 border border-gray-300 rounded flex items-center justify-center"
            style={element.style}
          >
            📁 ملف
          </div>
        );
      
      default:
        return (
          <div
            className="p-2 bg-gray-200 border border-gray-400 rounded"
            style={element.style}
          >
            {element.content || element.type}
          </div>
        );
    }
  };

  return (
    <div
      className={`absolute cursor-move ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        zIndex: isSelected ? 1000 : 1
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {renderElementContent()}
    </div>
  );
});
