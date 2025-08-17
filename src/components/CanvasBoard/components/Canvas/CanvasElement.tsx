
import React from 'react';
import { CanvasElement as CanvasElementType } from '../../types';

interface CanvasElementProps {
  element: CanvasElementType;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
}

export const CanvasElement: React.FC<CanvasElementProps> = ({
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
            className="p-2 bg-gray-100 border border-gray-300 rounded flex flex-col items-center justify-center text-xs"
            style={element.style}
          >
            📁 
            <span className="mt-1 text-center">{element.data?.fileName || 'ملف'}</span>
          </div>
        );
      
      case 'image':
        return (
          <img
            src={element.data?.src}
            alt={element.content || 'صورة'}
            className="w-full h-full object-cover rounded"
            style={element.style}
          />
        );
      
      case 'line':
        const path = element.data?.path || [];
        if (path.length < 2) return null;
        
        const pathString = path.reduce((acc: string, point: any, index: number) => {
          if (index === 0) return `M ${point.x - element.position.x} ${point.y - element.position.y}`;
          return acc + ` L ${point.x - element.position.x} ${point.y - element.position.y}`;
        }, '');
        
        return (
          <svg 
            className="w-full h-full absolute inset-0"
            style={element.style}
          >
            <path
              d={pathString}
              stroke={element.style?.stroke || '#000000'}
              strokeWidth={element.style?.strokeWidth || 2}
              fill="none"
            />
          </svg>
        );
      
      case 'smart-element':
        return (
          <div
            className="p-4 bg-gradient-to-br from-purple-100 to-blue-100 border border-purple-300 rounded-lg"
            style={element.style}
          >
            <div className="text-sm font-medium text-purple-800">
              {element.data?.type || 'عنصر ذكي'}
            </div>
            <div className="text-xs text-purple-600 mt-1">
              {element.content || 'انقر للتكوين'}
            </div>
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
      className={`absolute cursor-move ${isSelected ? 'ring-2 ring-blue-500 z-[1000]' : 'z-[1]'}`}
      style={{
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {renderElementContent()}
    </div>
  );
};
