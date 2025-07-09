import React from 'react';
import { CanvasElement } from '../types';
import { CanvasGrid } from './CanvasGrid';
import { CanvasElement as CanvasElementComponent } from './CanvasElement';

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
      <CanvasGrid showGrid={showGrid} />

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
        {/* عرض العناصر */}
        {elements.map((element) => (
          <CanvasElementComponent
            key={element.id}
            element={element}
            selectedElementId={selectedElementId}
            selectedTool={selectedTool}
            onElementSelect={onElementSelect}
            onElementMouseDown={onElementMouseDown}
            onElementMouseMove={onElementMouseMove}
            onElementMouseUp={onElementMouseUp}
            onResizeMouseDown={onResizeMouseDown}
          />
        ))}

        {/* معاينة الرسم البسيطة */}
        {isDrawing && drawStart && drawEnd && (
          <div
            className="absolute border-2 border-blue-500 pointer-events-none"
            style={{
              left: Math.min(drawStart.x, drawEnd.x),
              top: Math.min(drawStart.y, drawEnd.y),
              width: Math.abs(drawEnd.x - drawStart.x),
              height: Math.abs(drawEnd.y - drawStart.y),
            }}
          />
        )}
        
        {/* معاينة التحديد */}
        {isSelecting && selectionBox && (
          <div
            className="absolute border border-blue-400 bg-blue-100/20 pointer-events-none"
            style={{
              left: Math.min(selectionBox.start.x, selectionBox.end.x),
              top: Math.min(selectionBox.start.y, selectionBox.end.y),
              width: Math.abs(selectionBox.end.x - selectionBox.start.x),
              height: Math.abs(selectionBox.end.y - selectionBox.start.y),
            }}
          />
        )}
      </div>

      {/* شريط المعلومات البسيط */}
      <div className="absolute bottom-2 left-2 bg-black/80 text-white px-3 py-1 rounded-lg text-xs font-arabic">
        العناصر: {elements.length} | التكبير: {zoom}% | الأداة: {selectedTool}
      </div>
    </div>
  );
};

export default Canvas;