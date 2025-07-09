import React from 'react';
import { CanvasElement } from '../types';
import { CanvasGrid } from '../components/CanvasGrid';
import { CanvasElement as CanvasElementComponent } from '../components/CanvasElement';
import { CanvasDrawingPreview } from '../components/CanvasDrawingPreview';
import { CanvasStatusBar } from '../components/CanvasStatusBar';
import { LiveCursors } from './LiveCursors';
import { ElementLocks } from './ElementLocks';
import { PresenceIndicators } from './PresenceIndicators';

interface CollaborativeCanvasProps {
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
  projectId: string;
  currentUserId: string;
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

const CollaborativeCanvas: React.FC<CollaborativeCanvasProps> = ({
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
  projectId,
  currentUserId,
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

      {/* Presence indicators */}
      <PresenceIndicators
        projectId={projectId}
        currentUserId={currentUserId}
        className="absolute top-4 right-4 z-40"
      />

      {/* Live cursors overlay */}
      <LiveCursors
        projectId={projectId}
        currentUserId={currentUserId}
        canvasRef={canvasRef}
        zoom={zoom}
        canvasPosition={canvasPosition}
      />

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
          <div key={element.id} className="relative">
            <CanvasElementComponent
              element={element}
              selectedElementId={selectedElementId}
              selectedTool={selectedTool}
              onElementSelect={onElementSelect}
              onElementMouseDown={onElementMouseDown}
              onElementMouseMove={onElementMouseMove}
              onElementMouseUp={onElementMouseUp}
              onResizeMouseDown={onResizeMouseDown}
            />
            
            {/* Element collaboration features */}
            <ElementLocks
              projectId={projectId}
              currentUserId={currentUserId}
              elementId={element.id}
              isSelected={selectedElementId === element.id}
              position={element.position}
              size={element.size}
            />
          </div>
        ))}

        {/* معاينات الرسم */}
        <CanvasDrawingPreview
          isDrawing={isDrawing}
          drawStart={drawStart}
          drawEnd={drawEnd}
          selectedTool={selectedTool}
          isSelecting={isSelecting}
          selectionBox={selectionBox}
        />
      </div>

      {/* شريط الحالة السفلي */}
      <CanvasStatusBar
        elements={elements}
        selectedElementId={selectedElementId}
        zoom={zoom}
        selectedTool={selectedTool}
        showGrid={showGrid}
        snapEnabled={snapEnabled}
        onToggleGrid={onToggleGrid}
        onToggleSnap={onToggleSnap}
      />
    </div>
  );
};

export default CollaborativeCanvas;