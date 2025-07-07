import React from 'react';
import { Canvas } from './';
import { CanvasElement } from '../types';

interface CanvasWrapperProps {
  showGrid: boolean;
  snapEnabled: boolean;
  gridSize: number;
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
  setSelectedElementId: (id: string | null) => void;
  setShowGrid: (show: boolean) => void;
  setSnapEnabled: (enabled: boolean) => void;
  handleCanvasClick: (e: React.MouseEvent) => void;
  handleCanvasMouseDown: (e: React.MouseEvent) => void;
  handleCanvasMouseMove: (e: React.MouseEvent) => void;
  handleCanvasMouseUp: () => void;
  handleElementMouseDown: (e: React.MouseEvent, elementId: string) => void;
  handleElementMouseMove: (e: React.MouseEvent) => void;
  handleElementMouseUp: () => void;
  handleResizeMouseDown: (e: React.MouseEvent, handle: string) => void;
  handleResizeMouseMove: (e: React.MouseEvent) => void;
}

export const CanvasWrapper: React.FC<CanvasWrapperProps> = ({
  showGrid,
  snapEnabled,
  gridSize,
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
  setSelectedElementId,
  setShowGrid,
  setSnapEnabled,
  handleCanvasClick,
  handleCanvasMouseDown,
  handleCanvasMouseMove,
  handleCanvasMouseUp,
  handleElementMouseDown,
  handleElementMouseMove,
  handleElementMouseUp,
  handleResizeMouseDown,
  handleResizeMouseMove
}) => {
  return (
    <Canvas
      showGrid={showGrid}
      snapEnabled={snapEnabled}
      zoom={zoom}
      canvasPosition={canvasPosition}
      elements={elements}
      selectedElementId={selectedElementId}
      selectedTool={selectedTool}
      canvasRef={canvasRef}
      isDrawing={isDrawing}
      drawStart={drawStart}
      drawEnd={drawEnd}
      isDragging={isDragging}
      isResizing={isResizing}
      onCanvasClick={handleCanvasClick}
      onCanvasMouseDown={handleCanvasMouseDown}
      onCanvasMouseMove={handleCanvasMouseMove}
      onCanvasMouseUp={handleCanvasMouseUp}
      onElementSelect={setSelectedElementId}
      onElementMouseDown={handleElementMouseDown}
      onElementMouseMove={handleElementMouseMove}
      onElementMouseUp={handleElementMouseUp}
      onResizeMouseDown={handleResizeMouseDown}
      onResizeMouseMove={handleResizeMouseMove}
      onToggleGrid={() => setShowGrid(!showGrid)}
      onToggleSnap={() => setSnapEnabled(!snapEnabled)}
      gridSize={gridSize}
    />
  );
};