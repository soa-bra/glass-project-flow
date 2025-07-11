
import React from 'react';
import { Clock, GitBranch } from 'lucide-react';
import { CanvasElement } from '../types';

interface ElementRendererProps {
  element: CanvasElement;
}

export const ElementRenderer: React.FC<ElementRendererProps> = ({ element }) => {
  const baseStyle = element.style || {};
  
  console.log('🎨 Rendering element:', {
    id: element.id,
    type: element.type,
    position: element.position,
    size: element.size,
    content: element.content
  });
  
  switch (element.type) {
    case 'text':
      return (
        <div 
          className="w-full h-full flex items-center justify-center bg-white/90 rounded p-2 border border-gray-300 shadow-sm"
          style={{
            fontSize: baseStyle.fontSize || '16px',
            fontFamily: baseStyle.fontFamily || 'IBM Plex Sans Arabic',
            color: baseStyle.color || '#000000',
            textAlign: (baseStyle.textAlign as 'left' | 'center' | 'right' | 'justify') || 'right',
            fontWeight: baseStyle.fontWeight || 'normal'
          }}
        >
          <span className="font-arabic select-none">{element.content || 'نص جديد'}</span>
        </div>
      );

    case 'shape':
      return (
        <div 
          className="w-full h-full rounded border-2" 
          style={{
            backgroundColor: baseStyle.fill || '#3B82F6',
            borderColor: baseStyle.stroke || '#1D4ED8',
            borderWidth: baseStyle.strokeWidth || 2
          }}
        />
      );

    case 'sticky':
      return (
        <div 
          className="w-full h-full rounded shadow-md p-2 border"
          style={{
            backgroundColor: baseStyle.backgroundColor || '#FEF3C7',
            borderColor: '#F59E0B',
            borderRadius: baseStyle.borderRadius || '8px',
            padding: baseStyle.padding || '12px'
          }}
        >
          <span className="text-xs font-arabic text-gray-800">{element.content || 'ملاحظة'}</span>
        </div>
      );

    case 'comment':
      return (
        <div className="w-full h-full bg-blue-50 rounded shadow-md p-2 border border-blue-200">
          <div className="flex items-start gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
            <span className="text-xs font-arabic text-blue-800">{element.content || 'تعليق'}</span>
          </div>
        </div>
      );

    case 'upload':
      return (
        <div className="w-full h-full bg-gray-50 rounded shadow-md p-2 border border-gray-200 flex items-center justify-center">
          <div className="text-center">
            <span className="text-lg">📁</span>
            <p className="text-xs font-arabic mt-1">ملف</p>
          </div>
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
