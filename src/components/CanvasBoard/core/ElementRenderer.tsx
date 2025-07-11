import React from 'react';
import { GitBranch, Clock } from 'lucide-react';

interface Element {
  id: string;
  type: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  content?: string;
  color?: string;
  locked?: boolean;
  authorId?: string;
}

interface ElementRendererProps {
  element: Element;
  selected: boolean;
  lockedByOther: boolean;
  onSelect: () => void;
  onDrag: (newPos: { x: number; y: number }) => void;
}

export const ElementRenderer: React.FC<ElementRendererProps> = ({
  element,
  selected,
  lockedByOther,
  onSelect,
  onDrag,
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', element.id);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const newX = e.clientX - 100;
    const newY = e.clientY - 100;
    onDrag({ x: newX, y: newY });
  };

  const getElementContent = () => {
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

  return (
    <div
      className={`absolute border rounded-lg shadow-sm select-none cursor-move transition-all
        ${selected ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-300'}
        ${lockedByOther ? 'bg-gray-100 opacity-60 cursor-not-allowed' : 'bg-white'}`}
      style={{
        left: element.x,
        top: element.y,
        minWidth: element.width || 120,
        minHeight: element.height || 60,
        zIndex: selected ? 20 : 10,
        backgroundColor: element.color || undefined
      }}
      draggable={!lockedByOther}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {getElementContent()}
      {lockedByOther && (
        <div className="absolute top-0 right-0 text-[10px] text-red-500 px-1 bg-white rounded">محجوز</div>
      )}
    </div>
  );
};