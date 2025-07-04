import React from 'react';

interface CanvasElement {
  id: string;
  type: 'sticky-note' | 'shape' | 'text' | 'connection' | 'mindmap-node';
  position: { x: number; y: number };
  size: { width: number; height: number };
  content: string;
  color: string;
  locked?: boolean;
  userId?: string;
  layer: number;
}

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
}

interface CanvasLayerSystemProps {
  elements: CanvasElement[];
  layers: Layer[];
  selectedElement: CanvasElement | null;
  onElementSelect: (element: CanvasElement) => void;
  currentTool: string;
}

export const CanvasLayerSystem: React.FC<CanvasLayerSystemProps> = ({
  elements,
  layers,
  selectedElement,
  onElementSelect,
  currentTool
}) => {
  const renderElement = (element: CanvasElement) => {
    const isSelected = selectedElement?.id === element.id;
    const isLocked = element.locked;

    const baseClasses = `absolute cursor-pointer transition-all duration-200 ${
      isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
    } ${isLocked ? 'opacity-50' : 'hover:shadow-md'}`;

    const style = {
      left: element.position.x,
      top: element.position.y,
      width: element.size.width,
      height: element.size.height,
      backgroundColor: element.color,
      zIndex: element.layer * 10
    };

    switch (element.type) {
      case 'sticky-note':
        return (
          <div
            key={element.id}
            className={`${baseClasses} rounded-lg border shadow-sm`}
            style={style}
            onClick={(e) => {
              e.stopPropagation();
              if (!isLocked) onElementSelect(element);
            }}
          >
            <div className="p-3 h-full flex items-center justify-center text-sm font-medium text-gray-800">
              {element.content}
            </div>
            {isSelected && (
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
            )}
            {isLocked && (
              <div className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            )}
          </div>
        );

      case 'shape':
        return (
          <div
            key={element.id}
            className={`${baseClasses} rounded-full border-2 border-gray-400`}
            style={style}
            onClick={(e) => {
              e.stopPropagation();
              if (!isLocked) onElementSelect(element);
            }}
          >
            {isSelected && (
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
            )}
          </div>
        );

      case 'text':
        return (
          <div
            key={element.id}
            className={`${baseClasses} bg-transparent border-none`}
            style={style}
            onClick={(e) => {
              e.stopPropagation();
              if (!isLocked) onElementSelect(element);
            }}
          >
            <div className="text-gray-800 font-medium text-sm p-2">
              {element.content}
            </div>
            {isSelected && (
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
            )}
          </div>
        );

      case 'mindmap-node':
        return (
          <div
            key={element.id}
            className={`${baseClasses} rounded-xl border-2 border-purple-400 bg-purple-50`}
            style={style}
            onClick={(e) => {
              e.stopPropagation();
              if (!isLocked) onElementSelect(element);
            }}
          >
            <div className="p-2 h-full flex items-center justify-center text-sm font-medium text-purple-800">
              {element.content}
            </div>
            {isSelected && (
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // ترتيب العناصر حسب الطبقة
  const sortedElements = [...elements].sort((a, b) => a.layer - b.layer);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* رسم العناصر */}
      {sortedElements.map(renderElement)}

      {/* مؤشرات المستخدمين النشطين */}
      <div className="absolute top-4 left-4 flex space-x-2 space-x-reverse pointer-events-none">
        <div className="flex items-center space-x-1 space-x-reverse bg-blue-100 px-2 py-1 rounded-full text-xs">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-blue-700">أحمد يحرر</span>
        </div>
        <div className="flex items-center space-x-1 space-x-reverse bg-green-100 px-2 py-1 rounded-full text-xs">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-700">فاطمة تشاهد</span>
        </div>
      </div>

      {/* مساعد السحب والإفلات */}
      <div className="absolute bottom-4 right-4 glass-section rounded-lg p-3 pointer-events-none">
        <div className="text-xs text-gray-600">
          {currentTool === 'select' ? 'اضغط لتحديد العناصر' : `أداة نشطة: ${currentTool}`}
        </div>
      </div>
    </div>
  );
};