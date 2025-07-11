
import React from 'react';
import { CanvasElement } from '../types';

interface ElementRendererProps {
  element: CanvasElement;
}

export const ElementRenderer: React.FC<ElementRendererProps> = ({ element }) => {
  const getElementContent = () => {
    switch (element.type) {
      case 'text':
        return (
          <div 
            className="w-full h-full flex items-center justify-center p-2 text-sm font-arabic bg-yellow-100 border border-yellow-300 rounded"
            style={{ 
              backgroundColor: element.fill || '#fef3c7',
              color: element.stroke || '#92400e'
            }}
          >
            {element.content || 'نص جديد'}
          </div>
        );
      
      case 'shape':
        return (
          <div 
            className="w-full h-full rounded border-2"
            style={{
              backgroundColor: element.fill || '#dbeafe',
              borderColor: element.stroke || '#3b82f6'
            }}
          />
        );
      
      case 'sticky':
        return (
          <div 
            className="w-full h-full p-2 rounded shadow-md border text-xs font-arabic"
            style={{
              backgroundColor: element.fill || '#fef3c7',
              borderColor: element.stroke || '#f59e0b'
            }}
          >
            {element.content || 'ملاحظة'}
          </div>
        );
      
      case 'line':
        return (
          <svg className="w-full h-full">
            <line
              x1="0"
              y1="0"
              x2="100%"
              y2="100%"
              stroke={element.stroke || '#000000'}
              strokeWidth={element.strokeWidth || 2}
              strokeLinecap="round"
            />
          </svg>
        );
      
      default:
        return (
          <div className="w-full h-full bg-gray-200 rounded border-2 border-gray-400 flex items-center justify-center">
            <span className="text-xs text-gray-600">{element.type}</span>
          </div>
        );
    }
  };

  return (
    <div
      className="pointer-events-none"
      style={{
        opacity: element.opacity || 1,
        transform: `rotate(${element.rotation || 0}deg)`,
        zIndex: element.zIndex || 1
      }}
    >
      {getElementContent()}
    </div>
  );
};
