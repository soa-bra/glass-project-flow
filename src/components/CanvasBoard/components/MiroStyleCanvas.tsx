import React from 'react';
import { CanvasElement } from '../types';
import { MiroStyleElement } from './MiroStyleElement';
import { cn } from '@/lib/utils';

interface MiroStyleCanvasProps {
  elements: CanvasElement[];
  selectedElementId: string | null;
  selectedTool: string;
  zoom: number;
  canvasPosition: { x: number; y: number };
  showGrid: boolean;
  canvasRef: React.RefObject<HTMLDivElement>;
  onElementSelect: (id: string) => void;
  onElementMouseDown: (e: React.MouseEvent, elementId: string) => void;
  onCanvasClick: (e: React.MouseEvent) => void;
  onCanvasMouseDown: (e: React.MouseEvent) => void;
  onCanvasMouseMove: (e: React.MouseEvent) => void;
  onCanvasMouseUp: () => void;
}

export const MiroStyleCanvas: React.FC<MiroStyleCanvasProps> = ({
  elements,
  selectedElementId,
  selectedTool,
  zoom,
  canvasPosition,
  showGrid,
  canvasRef,
  onElementSelect,
  onElementMouseDown,
  onCanvasClick,
  onCanvasMouseDown,
  onCanvasMouseMove,
  onCanvasMouseUp
}) => {
  const getCursorStyle = () => {
    switch (selectedTool) {
      case 'hand':
        return 'grab';
      case 'zoom':
        return 'zoom-in';
      case 'smart-pen':
        return 'crosshair';
      case 'text':
      case 'sticky':
      case 'comment':
      case 'shape':
      case 'smart-element':
        return 'crosshair';
      case 'upload':
        return 'copy';
      case 'select':
      default:
        return 'default';
    }
  };

  const getToolHint = () => {
    switch (selectedTool) {
      case 'select':
        return 'انقر لتحديد عنصر أو اسحب لتحديد متعدد';
      case 'smart-pen':
        return 'اسحب للرسم الذكي أو ربط العناصر';
      case 'text':
        return 'انقر لإضافة نص';
      case 'shape':
        return 'اسحب لإنشاء شكل';
      case 'comment':
        return 'انقر لإضافة تعليق';
      case 'upload':
        return 'انقر لرفع ملف';
      case 'smart-element':
        return 'انقر لإضافة عنصر ذكي';
      case 'hand':
        return 'اسحب للتنقل';
      case 'zoom':
        return 'انقر للتكبير';
      default:
        return '';
    }
  };

  return (
    <div className="absolute inset-0 bg-gray-50 overflow-hidden">
      {/* Grid Background */}
      {showGrid && (
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle, #d1d5db 1px, transparent 1px)
            `,
            backgroundSize: `${24 * (zoom / 100)}px ${24 * (zoom / 100)}px`,
            backgroundPosition: `${canvasPosition.x * (zoom / 100)}px ${canvasPosition.y * (zoom / 100)}px`
          }}
        />
      )}

      {/* Canvas Content */}
      <div
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          cursor: getCursorStyle(),
          transform: `scale(${zoom / 100}) translate(${canvasPosition.x}px, ${canvasPosition.y}px)`,
          transformOrigin: 'top left'
        }}
        onClick={onCanvasClick}
        onMouseDown={onCanvasMouseDown}
        onMouseMove={onCanvasMouseMove}
        onMouseUp={onCanvasMouseUp}
      >
        {/* Render Elements */}
        {elements.map((element) => (
          <MiroStyleElement
            key={element.id}
            element={element}
            isSelected={selectedElementId === element.id}
            onSelect={() => onElementSelect(element.id)}
            onMouseDown={(e) => onElementMouseDown(e, element.id)}
          />
        ))}
        
        {/* Tool Hint */}
        {getToolHint() && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30">
            <div className="bg-black/70 text-white px-4 py-2 rounded-lg text-sm font-arabic">
              {getToolHint()}
            </div>
          </div>
        )}
      </div>

      {/* Status indicators */}
      {selectedTool !== 'select' && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm border border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>الأداة النشطة: {selectedTool}</span>
          </div>
        </div>
      )}
    </div>
  );
};