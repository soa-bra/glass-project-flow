import React from 'react';
import FabricCanvasComponent from '../core/FabricCanvasComponent';
import { CanvasElement } from '../types/index';

interface CanvasWrapperProps {
  showGrid: boolean;
  snapEnabled: boolean;
  zoom: number;
  canvasPosition: { x: number; y: number } | null;
  elements: CanvasElement[];
  selectedElementId: string | null;
  selectedTool: string;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isDrawing: boolean;
  drawStart: { x: number; y: number } | null;
  drawEnd: { x: number; y: number } | null;
  isDragging: boolean;
  isResizing: boolean;
  isSelecting: boolean;
  selectionBox: any;
  setSelectedElementId: (id: string | null) => void;
  setShowGrid: (show: boolean) => void;
  setSnapEnabled: (enabled: boolean) => void;
  handleCanvasClick: (e: React.MouseEvent) => void;
  handleCanvasMouseDown: (e: React.MouseEvent) => void;
  handleCanvasMouseMove: (e: React.MouseEvent) => void;
  handleCanvasMouseUp: (e: React.MouseEvent) => void;
  handleElementMouseDown: (e: React.MouseEvent, elementId: string) => void;
  handleElementMouseMove: (e: React.MouseEvent) => void;
  handleElementMouseUp: (e: React.MouseEvent) => void;
  handleResizeMouseDown: (e: React.MouseEvent) => void;
  handleResizeMouseMove: (e: React.MouseEvent) => void;
}

export const CanvasWrapper: React.FC<CanvasWrapperProps> = (props) => {
  const {
    showGrid,
    snapEnabled,
    zoom,
    canvasPosition,
    selectedTool,
    setSelectedElementId
  } = props;
  
  const handleElementSelect = (elementId: string) => {
    setSelectedElementId(elementId);
  };
  
  const handleElementsChange = (elements: CanvasElement[]) => {
    // Handle elements change
    console.log('Elements changed:', elements.length);
  };
  
  return (
    <div className="w-full h-full">
      <FabricCanvasComponent
        selectedTool={selectedTool}
        selectedElementIds={props.selectedElementId ? [props.selectedElementId] : []}
        onElementSelect={handleElementSelect}
        onElementsChange={handleElementsChange}
        zoom={zoom}
        canvasPosition={canvasPosition || { x: 0, y: 0 }}
        showGrid={showGrid}
        snapEnabled={snapEnabled}
        theme={{
          colors: {
            background: 'hsl(var(--background))'
          }
        }}
      />
    </div>
  );
};