import React from 'react';
import { Clock, GitBranch } from 'lucide-react';
import { CanvasElement } from '../types';

interface ElementRendererProps {
  element: CanvasElement;
}

export const ElementRenderer: React.FC<ElementRendererProps> = ({ element }) => {
  switch (element.type) {
    case 'text':
      return (
        <div className="w-full h-full flex items-center justify-center bg-yellow-200 rounded p-2">
          <span className="text-sm font-arabic">{element.content || 'نص جديد'}</span>
        </div>
      );

    case 'shape':
      return <div className="w-full h-full bg-blue-200 rounded border-2 border-blue-400" />;

    case 'sticky':
      return (
        <div className="w-full h-full bg-yellow-300 rounded shadow-md p-2 border border-yellow-400">
          <span className="text-xs font-arabic">{element.content || 'ملاحظة'}</span>
        </div>
      );

    case 'timeline':
      return (
        <div className="w-full h-full bg-green-200 rounded border-2 border-green-400 flex items-center justify-center">
          <Clock className="w-6 h-6 text-green-600" />
        </div>
      );

    case 'mindmap':
      return (
        <div className="w-full h-full bg-purple-200 rounded border-2 border-purple-400 flex items-center justify-center">
          <GitBranch className="w-6 h-6 text-purple-600" />
        </div>
      );

    case 'brainstorm':
      return (
        <div className="w-full h-full bg-orange-200 rounded border-2 border-orange-400 flex items-center justify-center">
          <div className="text-center">
            <span className="text-lg">💡</span>
            <p className="text-xs font-arabic mt-1">عصف ذهني</p>
          </div>
        </div>
      );

    case 'root':
      return (
        <div className="w-full h-full bg-indigo-200 rounded border-2 border-indigo-400 flex items-center justify-center">
          <GitBranch className="w-6 h-6 text-indigo-600" />
        </div>
      );

    case 'moodboard':
      return (
        <div className="w-full h-full bg-pink-200 rounded border-2 border-pink-400 flex items-center justify-center">
          <div className="text-center">
            <span className="text-lg">🎨</span>
            <p className="text-xs font-arabic mt-1">مودبورد</p>
          </div>
        </div>
      );

    case 'line':
      return (
        <div className="w-full h-full relative pointer-events-none">
          <svg className="absolute inset-0 w-full h-full">
            <line
              x1="0"
              y1="0"
              x2={element.size.width}
              y2={element.size.height}
              stroke="#2563eb"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      );

    default:
      return (
        <div className="w-full h-full bg-red-200 rounded border-2 border-red-400 flex items-center justify-center">
          <div className="text-center">
            <span className="text-xs font-arabic">نوع غير معروف</span>
            <p className="text-xs text-red-600">{element.type}</p>
          </div>
        </div>
      );
  }
};