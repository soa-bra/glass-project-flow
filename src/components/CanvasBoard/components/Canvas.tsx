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
  isDrawing: boolean;
  drawStart: { x: number; y: number } | null;
  drawEnd: { x: number; y: number } | null;
  isDragging: boolean;
  isResizing: boolean;
  isSelecting?: boolean;
  selectionBox?: { start: { x: number; y: number }; end: { x: number; y: number } } | null;
  onCanvasClick: (e: React.MouseEvent) => void;
  onCanvasMouseDown: (e: React.MouseEvent) => void;
  onCanvasMouseMove: (e: React.MouseEvent) => void;
  onCanvasMouseUp: () => void;
  onElementSelect: (id: string) => void;
  onElementMouseDown: (e: React.MouseEvent, elementId: string) => void;
  onElementMouseMove: (e: React.MouseEvent) => void;
  onElementMouseUp: () => void;
  onResizeMouseDown: (e: React.MouseEvent, handle: string) => void;
  onResizeMouseMove: (e: React.MouseEvent) => void;
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
  isDrawing,
  drawStart,
  drawEnd,
  isDragging,
  isResizing,
  isSelecting = false,
  selectionBox = null,
  onCanvasClick,
  onCanvasMouseDown,
  onCanvasMouseMove,
  onCanvasMouseUp,
  onElementSelect,
  onElementMouseDown,
  onElementMouseMove,
  onElementMouseUp,
  onResizeMouseDown,
  onResizeMouseMove,
  onToggleGrid,
  onToggleSnap
}) => {
  const getCursorStyle = () => {
    if (selectedTool === 'smart-element') return 'crosshair';
    if (selectedTool === 'smart-pen') return 'crosshair';
    if (selectedTool === 'hand') return 'grab';
    if (selectedTool === 'zoom') return 'zoom-in';
    if (selectedTool === 'select' && isDragging) return 'grabbing';
    if (selectedTool === 'select') return 'default';
    if (['shape', 'text', 'sticky'].includes(selectedTool)) return 'crosshair';
    return 'default';
  };
  return (
    <div className="relative w-full h-full bg-white overflow-hidden">
      {/* الشبكة النقطية الشفافة */}
      {showGrid && (
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(0, 0, 0, 0.3) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            backgroundPosition: '12px 12px'
          }}
        />
      )}

      {/* منطقة الرسم */}
      <div
        ref={canvasRef}
        className="absolute inset-0"
        style={{
          transform: `scale(${zoom / 100}) translate(${canvasPosition.x}px, ${canvasPosition.y}px)`,
          cursor: getCursorStyle()
        }}
        onClick={onCanvasClick}
        onMouseDown={onCanvasMouseDown}
        onMouseMove={(e) => {
          onCanvasMouseMove(e);
          if (isDragging || isResizing) {
            if (isDragging) {
              onElementMouseMove(e);
            }
            if (isResizing) {
              onResizeMouseMove(e);
            }
          }
        }}
        onMouseUp={() => {
          onCanvasMouseUp();
          onElementMouseUp();
        }}
      >
        {elements.map((element) => (
          <div key={element.id}>
            {/* العنصر الأساسي */}
            <div
              className={`absolute border-2 ${selectedElementId === element.id ? 'border-blue-500' : 'border-transparent'} 
                        ${element.locked ? 'cursor-not-allowed' : (selectedTool === 'select' ? 'cursor-move' : 'cursor-pointer')} 
                        hover:border-blue-300 transition-colors`}
              style={{
                left: element.position.x,
                top: element.position.y,
                width: element.size.width,
                height: element.size.height
              }}
              onClick={(e) => {
                e.stopPropagation();
                onElementSelect(element.id);
                console.log('Element clicked:', element.type, element);
              }}
              onMouseDown={(e) => {
                if (selectedTool === 'select') {
                  onElementMouseDown(e, element.id);
                }
              }}
              onMouseMove={onElementMouseMove}
              onMouseUp={onElementMouseUp}
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
              {element.type === 'brainstorm' && (
                <div className="w-full h-full bg-orange-200 rounded border-2 border-orange-400 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-lg">💡</span>
                    <p className="text-xs font-arabic mt-1">عصف ذهني</p>
                  </div>
                </div>
              )}
              {element.type === 'root' && (
                <div className="w-full h-full bg-indigo-200 rounded border-2 border-indigo-400 flex items-center justify-center">
                  <GitBranch className="w-6 h-6 text-indigo-600" />
                </div>
              )}
              {element.type === 'moodboard' && (
                <div className="w-full h-full bg-pink-200 rounded border-2 border-pink-400 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-lg">🎨</span>
                    <p className="text-xs font-arabic mt-1">مودبورد</p>
                  </div>
                </div>
              )}
              {element.type === 'line' && (
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
              )}
              {!['text', 'shape', 'sticky', 'timeline', 'mindmap', 'brainstorm', 'root', 'moodboard', 'line'].includes(element.type) && (
                <div className="w-full h-full bg-red-200 rounded border-2 border-red-400 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-xs font-arabic">نوع غير معروف</span>
                    <p className="text-xs text-red-600">{element.type}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Bounding Box مع Resize Handles */}
            {selectedElementId === element.id && selectedTool === 'select' && (
              <div
                className="absolute pointer-events-none"
                style={{
                  left: element.position.x - 4,
                  top: element.position.y - 4,
                  width: element.size.width + 8,
                  height: element.size.height + 8
                }}
              >
                {/* Bounding Box Border */}
                <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none" />
                
                {/* Resize Handles */}
                {/* الزوايا */}
                <div
                  className="absolute w-3 h-3 bg-white border-2 border-blue-500 cursor-nw-resize pointer-events-auto"
                  style={{ left: -2, top: -2 }}
                  onMouseDown={(e) => onResizeMouseDown(e, 'nw')}
                />
                <div
                  className="absolute w-3 h-3 bg-white border-2 border-blue-500 cursor-ne-resize pointer-events-auto"
                  style={{ right: -2, top: -2 }}
                  onMouseDown={(e) => onResizeMouseDown(e, 'ne')}
                />
                <div
                  className="absolute w-3 h-3 bg-white border-2 border-blue-500 cursor-sw-resize pointer-events-auto"
                  style={{ left: -2, bottom: -2 }}
                  onMouseDown={(e) => onResizeMouseDown(e, 'sw')}
                />
                <div
                  className="absolute w-3 h-3 bg-white border-2 border-blue-500 cursor-se-resize pointer-events-auto"
                  style={{ right: -2, bottom: -2 }}
                  onMouseDown={(e) => onResizeMouseDown(e, 'se')}
                />
                
                {/* الجوانب */}
                <div
                  className="absolute w-3 h-3 bg-white border-2 border-blue-500 cursor-n-resize pointer-events-auto"
                  style={{ left: '50%', top: -2, transform: 'translateX(-50%)' }}
                  onMouseDown={(e) => onResizeMouseDown(e, 'n')}
                />
                <div
                  className="absolute w-3 h-3 bg-white border-2 border-blue-500 cursor-s-resize pointer-events-auto"
                  style={{ left: '50%', bottom: -2, transform: 'translateX(-50%)' }}
                  onMouseDown={(e) => onResizeMouseDown(e, 's')}
                />
                <div
                  className="absolute w-3 h-3 bg-white border-2 border-blue-500 cursor-w-resize pointer-events-auto"
                  style={{ left: -2, top: '50%', transform: 'translateY(-50%)' }}
                  onMouseDown={(e) => onResizeMouseDown(e, 'w')}
                />
                <div
                  className="absolute w-3 h-3 bg-white border-2 border-blue-500 cursor-e-resize pointer-events-auto"
                  style={{ right: -2, top: '50%', transform: 'translateY(-50%)' }}
                  onMouseDown={(e) => onResizeMouseDown(e, 'e')}
                />
              </div>
            )}
          </div>
        ))}

        {/* مؤشر الرسم للعناصر التي تحتاج سحب */}
        {isDrawing && drawStart && drawEnd && ['smart-element', 'shape', 'text-box'].includes(selectedTool) && (
          <div
            className="absolute border-2 border-dashed border-blue-500 bg-blue-50 opacity-50 pointer-events-none"
            style={{
              left: Math.min(drawStart.x, drawEnd.x),
              top: Math.min(drawStart.y, drawEnd.y),
              width: Math.abs(drawEnd.x - drawStart.x),
              height: Math.abs(drawEnd.y - drawStart.y)
            }}
          />
        )}

        {/* مؤشر الرسم للقلم الذكي */}
        {isDrawing && drawStart && drawEnd && selectedTool === 'smart-pen' && (
          <div className="absolute pointer-events-none">
            <svg 
              className="absolute pointer-events-none"
              style={{
                left: Math.min(drawStart.x, drawEnd.x),
                top: Math.min(drawStart.y, drawEnd.y),
                width: Math.abs(drawEnd.x - drawStart.x) + 4,
                height: Math.abs(drawEnd.y - drawStart.y) + 4
              }}
            >
              <line
                x1={drawStart.x < drawEnd.x ? 2 : Math.abs(drawEnd.x - drawStart.x) + 2}
                y1={drawStart.y < drawEnd.y ? 2 : Math.abs(drawEnd.y - drawStart.y) + 2}
                x2={drawEnd.x < drawStart.x ? 2 : Math.abs(drawEnd.x - drawStart.x) + 2}
                y2={drawEnd.y < drawStart.y ? 2 : Math.abs(drawEnd.y - drawStart.y) + 2}
                stroke="#2563eb"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="4,4"
                opacity="0.7"
              />
            </svg>
          </div>
        )}

        {/* صندوق التحديد المتعدد */}
        {isSelecting && selectionBox && (
          <div
            className="absolute border-2 border-dashed border-green-500 bg-green-50 opacity-30 pointer-events-none"
            style={{
              left: Math.min(selectionBox.start.x, selectionBox.end.x),
              top: Math.min(selectionBox.start.y, selectionBox.end.y),
              width: Math.abs(selectionBox.end.x - selectionBox.start.x),
              height: Math.abs(selectionBox.end.y - selectionBox.start.y)
            }}
          />
        )}
      </div>

      {/* شريط الطبقات السفلي */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-300 p-2 rounded-t-2xl shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600 font-arabic">
            <span>العناصر: {elements.length}</span>
            <span>المحددة: {selectedElementId ? 1 : 0}</span>
            <span>الزوم: {zoom}%</span>
            <span>الأداة: {CANVAS_TOOLS.find(t => t.id === selectedTool)?.label}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onToggleGrid}
              className={`rounded-full border-gray-300 ${showGrid ? 'bg-soabra-new-secondary-4 text-black border-soabra-new-secondary-4' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onToggleSnap}
              className={`rounded-full border-gray-300 ${snapEnabled ? 'bg-soabra-new-secondary-1 text-black border-soabra-new-secondary-1' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Move className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="rounded-full border-gray-300 text-gray-600 hover:bg-gray-100">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Canvas;