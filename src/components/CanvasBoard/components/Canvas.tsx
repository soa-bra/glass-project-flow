import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid, Move, Settings, Clock, GitBranch } from 'lucide-react';
import { CanvasElement } from '../types';
import { CANVAS_TOOLS } from '../constants';

interface CanvasProps {
  showGrid: boolean;
  snapEnabled: boolean;
  zoom: number;
  canvasPosition: { x: number; y: number };
  elements: CanvasElement[];
  selectedElementId: string | null;
  selectedTool: string;
  canvasRef: React.RefObject<HTMLDivElement>;
  onCanvasClick: (e: React.MouseEvent) => void;
  onElementSelect: (id: string) => void;
  onToggleGrid: () => void;
  onToggleSnap: () => void;
}

const Canvas: React.FC<CanvasProps> = ({
  showGrid,
  snapEnabled,
  zoom,
  canvasPosition,
  elements,
  selectedElementId,
  selectedTool,
  canvasRef,
  onCanvasClick,
  onElementSelect,
  onToggleGrid,
  onToggleSnap
}) => {
  return (
    <div className="relative w-full h-full bg-white overflow-hidden">
      {/* الشبكة */}
      {showGrid && (
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, #ccc 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />
      )}

      {/* منطقة الرسم */}
      <div
        ref={canvasRef}
        className="absolute inset-0 cursor-crosshair"
        style={{
          transform: `scale(${zoom / 100}) translate(${canvasPosition.x}px, ${canvasPosition.y}px)`
        }}
        onClick={onCanvasClick}
      >
        {elements.map((element) => (
          <div
            key={element.id}
            className={`absolute border-2 ${selectedElementId === element.id ? 'border-blue-500' : 'border-transparent'} 
                      ${element.locked ? 'cursor-not-allowed' : 'cursor-move'} hover:border-blue-300 transition-colors`}
            style={{
              left: element.position.x,
              top: element.position.y,
              width: element.size.width,
              height: element.size.height
            }}
            onClick={(e) => {
              e.stopPropagation();
              onElementSelect(element.id);
            }}
          >
            {element.type === 'text' && (
              <div className="w-full h-full flex items-center justify-center bg-yellow-200 rounded p-2">
                <span className="text-sm font-arabic">{element.content || 'نص جديد'}</span>
              </div>
            )}
            {element.type === 'shape' && (
              <div className="w-full h-full bg-blue-200 rounded border-2 border-blue-400" />
            )}
            {element.type === 'sticky' && (
              <div className="w-full h-full bg-yellow-300 rounded shadow-md p-2 border border-yellow-400">
                <span className="text-xs font-arabic">{element.content || 'ملاحظة'}</span>
              </div>
            )}
            {element.type === 'timeline' && (
              <div className="w-full h-full bg-green-200 rounded border-2 border-green-400 flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            )}
            {element.type === 'mindmap' && (
              <div className="w-full h-full bg-purple-200 rounded border-2 border-purple-400 flex items-center justify-center">
                <GitBranch className="w-6 h-6 text-purple-600" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* شريط الطبقات السفلي */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>العناصر: {elements.length}</span>
            <span>المحددة: {selectedElementId ? 1 : 0}</span>
            <span>الزوم: {zoom}%</span>
            <span>الأداة: {CANVAS_TOOLS.find(t => t.id === selectedTool)?.label}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onToggleGrid}
              className={showGrid ? 'bg-blue-100' : ''}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onToggleSnap}
              className={snapEnabled ? 'bg-blue-100' : ''}
            >
              <Move className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Canvas;