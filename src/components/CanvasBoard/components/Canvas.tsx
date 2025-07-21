import React from 'react';
import { CanvasElement } from '../types';
import { CanvasGrid } from './CanvasGrid';
import { CanvasElement as CanvasElementComponent } from './CanvasElement';
import { CanvasDrawingPreview } from './CanvasDrawingPreview';
import { SelectionBoundingBox } from './SelectionBoundingBox';
import { CanvasStatusBar } from './CanvasStatusBar';
interface CanvasProps {
  showGrid: boolean;
  snapEnabled: boolean;
  zoom: number;
  canvasPosition: {
    x: number;
    y: number;
  };
  elements: CanvasElement[];
  selectedElementId: string | null;
  selectedElementIds?: string[];
  selectedTool: string;
  canvasRef: React.RefObject<HTMLDivElement>;
  isDrawing: boolean;
  drawStart: {
    x: number;
    y: number;
  } | null;
  drawEnd: {
    x: number;
    y: number;
  } | null;
  isDragging: boolean;
  isResizing: boolean;
  isSelecting?: boolean;
  selectionBox?: {
    start: {
      x: number;
      y: number;
    };
    end: {
      x: number;
      y: number;
    };
  } | null;
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
  onUpdateElement?: (elementId: string, updates: any) => void;
}
const Canvas: React.FC<CanvasProps> = ({
  showGrid,
  snapEnabled,
  zoom,
  canvasPosition,
  elements,
  selectedElementId,
  selectedElementIds = [],
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
  onToggleSnap,
  onUpdateElement
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
  return <div className="relative w-full h-full bg-white overflow-hidden">
      {/* الشبكة النقطية الشفافة */}
      <CanvasGrid showGrid={showGrid} />

      {/* منطقة الرسم */}
      <div ref={canvasRef} style={{
      transform: `scale(${zoom / 100}) translate(${canvasPosition.x}px, ${canvasPosition.y}px)`,
      cursor: getCursorStyle()
    }} onClick={onCanvasClick} onMouseDown={onCanvasMouseDown} onMouseMove={e => {
      onCanvasMouseMove(e);
      if (isDragging || isResizing) {
        if (isDragging) {
          onElementMouseMove(e);
        }
        if (isResizing) {
          onResizeMouseMove(e);
        }
      }
    }} onMouseUp={() => {
      onCanvasMouseUp();
      onElementMouseUp();
    }} className="absolute inset-0 bg-slate-50">
        {/* عرض العناصر */}
        {elements.map(element => <CanvasElementComponent key={element.id} element={element} selectedElementId={selectedElementId} selectedTool={selectedTool} onElementSelect={onElementSelect} onElementMouseDown={onElementMouseDown} onElementMouseMove={onElementMouseMove} onElementMouseUp={onElementMouseUp} onResizeMouseDown={onResizeMouseDown} />)}

        {/* معاينات الرسم */}
        <CanvasDrawingPreview isDrawing={isDrawing} drawStart={drawStart} drawEnd={drawEnd} selectedTool={selectedTool} isSelecting={isSelecting} selectionBox={selectionBox} />
      </div>

      {/* مربع التحديد والتعديل للعناصر المحددة */}
      {selectedElementIds.length > 0 && onUpdateElement && (
        <SelectionBoundingBox
          selectedElements={elements.filter(el => selectedElementIds.includes(el.id))}
          zoom={zoom}
          canvasPosition={canvasPosition}
          onUpdateElement={onUpdateElement}
          snapEnabled={snapEnabled}
        />
      )}

      {/* شريط الحالة السفلي */}
      <CanvasStatusBar elements={elements} selectedElementId={selectedElementId} zoom={zoom} selectedTool={selectedTool} showGrid={showGrid} snapEnabled={snapEnabled} onToggleGrid={onToggleGrid} onToggleSnap={onToggleSnap} />
    </div>;
};
export default Canvas;