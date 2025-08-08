import React from 'react';
import { Canvas } from './Canvas/Canvas';
import { CanvasElement } from '../types';

interface CanvasWrapperProps {
  showGrid: boolean;
  snapEnabled: boolean;
  zoom: number;
  canvasPosition: { x: number; y: number };
  elements: CanvasElement[];
  selectedElementId: string | null;
  selectedElementIds?: string[];
  selectedTool: string;
  canvasRef: React.RefObject<HTMLDivElement>;
  isDrawing: boolean;
  drawStart: { x: number; y: number } | null;
  drawEnd: { x: number; y: number } | null;
  isDragging: boolean;
  isResizing: boolean;
  isSelecting?: boolean;
  selectionBox?: { start: { x: number; y: number }; end: { x: number; y: number } } | null;
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
  onUpdateElement?: (elementId: string, updates: any) => void;
}

export const CanvasWrapper: React.FC<CanvasWrapperProps> = ({
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
  handleResizeMouseMove,
  onUpdateElement
}) => {
  return (
    <Canvas
      selectedTool={selectedTool}
      zoom={zoom}
      canvasPosition={canvasPosition}
      showGrid={showGrid}
      snapEnabled={snapEnabled}
      onElementsChange={() => {}}
      onSelectionChange={() => {}}
    />
  );
};