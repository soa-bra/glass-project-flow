
import React from 'react';
import { CanvasElement as CanvasElementType } from '../../types';
import { useCanvasStyles } from '@/hooks/useCanvasStyles';

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
  const { elementClasses, convertCompleteStyle } = useCanvasStyles({
    position: element.position,
    size: element.size,
    style: element.style,
    isSelected
  });

  const renderElementContent = () => {
    const styleClasses = convertCompleteStyle(element.style || {});
    
    switch (element.type) {
      case 'text':
        return (
          <div className={`p-2 bg-white border border-gray-300 rounded ${styleClasses}`}>
            {element.content || 'نص جديد'}
          </div>
        );
      
      case 'sticky':
        return (
          <div className={`p-3 bg-yellow-200 border border-yellow-400 rounded shadow-sm ${styleClasses}`}>
            {element.content || 'ملاحظة جديدة'}
          </div>
        );
      
      case 'shape':
        return (
          <div className={`bg-blue-500 border-2 border-blue-700 rounded ${styleClasses}`} />
        );
      
      case 'comment':
        return (
          <div className={`p-2 bg-orange-100 border border-orange-300 rounded shadow-sm ${styleClasses}`}>
            💬 {element.content || 'تعليق'}
          </div>
        );
      
      case 'upload':
        return (
          <div className={`p-2 bg-gray-100 border border-gray-300 rounded flex flex-col items-center justify-center text-xs ${styleClasses}`}>
            📁 
            <span className="mt-1 text-center">{element.data?.fileName || 'ملف'}</span>
          </div>
        );
      
      case 'image':
        return (
          <img
            src={element.data?.src}
            alt={element.content || 'صورة'}
            className={`w-full h-full object-cover rounded ${styleClasses}`}
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
          <svg className={`w-full h-full absolute inset-0 ${styleClasses}`}>
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
          <div className={`p-4 bg-gradient-to-br from-purple-100 to-blue-100 border border-purple-300 rounded-lg ${styleClasses}`}>
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
          <div className={`p-2 bg-gray-200 border border-gray-400 rounded ${styleClasses}`}>
            {element.content || element.type}
          </div>
        );
    }
  };

  return (
    <div
      className={elementClasses}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {renderElementContent()}
    </div>
  );
};
