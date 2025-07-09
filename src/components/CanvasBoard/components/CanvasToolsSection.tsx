import React from 'react';
import ToolPanelManager from './ToolPanelManager';
import { CanvasElement } from '../types';
import { Layer } from '../hooks/useCanvasLayerState';

interface CanvasToolsSectionProps {
  selectedTool: string;
  selectedElements: CanvasElement[];
  zoom: number;
  canvasPosition: { x: number; y: number };
  panSpeed: number;
  lineWidth: number;
  lineStyle: string;
  selectedPenMode: string;
  showGrid: boolean;
  snapEnabled: boolean;
  gridSize: number;
  gridShape: string;
  layers: Layer[];
  selectedLayerId: string | null;
  onUpdateElement: (elementId: string, updates: any) => void;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onGroup: () => void;
  onZoomChange: (zoom: number) => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  onFitToScreen: () => void;
  onResetView: () => void;
  onPanSpeedChange: (speed: number) => void;
  onLineWidthChange: (width: number) => void;
  onLineStyleChange: (style: string) => void;
  onPenModeSelect: (mode: string) => void;
  onFileUpload: (files: File[]) => void;
  onLayerReorder: (layers: Layer[]) => void;
  onLayerSelect: (layerId: string) => void;
  onGridToggle: () => void;
  onSnapToggle: () => void;
  onGridSizeChange: (size: number) => void;
  onGridShapeChange: (shape: string) => void;
  onAlignToGrid: () => void;
}

export const CanvasToolsSection: React.FC<CanvasToolsSectionProps> = ({
  selectedTool,
  selectedElements,
  zoom,
  canvasPosition,
  panSpeed,
  lineWidth,
  lineStyle,
  selectedPenMode,
  showGrid,
  snapEnabled,
  gridSize,
  gridShape,
  layers,
  selectedLayerId,
  onUpdateElement,
  onCopy,
  onCut,
  onPaste,
  onDelete,
  onGroup,
  onZoomChange,
  onPositionChange,
  onFitToScreen,
  onResetView,
  onPanSpeedChange,
  onLineWidthChange,
  onLineStyleChange,
  onPenModeSelect,
  onFileUpload,
  onLayerReorder,
  onLayerSelect,
  onGridToggle,
  onSnapToggle,
  onGridSizeChange,
  onGridShapeChange,
  onAlignToGrid
}) => {
  return (
    <div className="fixed bottom-24 left-6 z-40">
      <ToolPanelManager
        selectedTool={selectedTool}
        selectedElements={selectedElements}
        zoom={zoom}
        canvasPosition={canvasPosition}
        panSpeed={panSpeed}
        lineWidth={lineWidth}
        lineStyle={lineStyle}
        selectedPenMode={selectedPenMode}
        showGrid={showGrid}
        snapEnabled={snapEnabled}
        gridSize={gridSize}
        gridShape={gridShape}
        layers={layers}
        selectedLayerId={selectedLayerId}
        onUpdateElement={onUpdateElement}
        onCopy={onCopy}
        onCut={onCut}
        onPaste={onPaste}
        onDelete={onDelete}
        onGroup={onGroup}
        onZoomChange={onZoomChange}
        onPositionChange={onPositionChange}
        onFitToScreen={onFitToScreen}
        onResetView={onResetView}
        onPanSpeedChange={onPanSpeedChange}
        onLineWidthChange={onLineWidthChange}
        onLineStyleChange={onLineStyleChange}
        onPenModeSelect={onPenModeSelect}
        onFileUpload={onFileUpload}
        onLayerReorder={onLayerReorder}
        onLayerSelect={onLayerSelect}
        onGridToggle={onGridToggle}
        onSnapToggle={onSnapToggle}
        onGridSizeChange={onGridSizeChange}
        onGridShapeChange={onGridShapeChange}
        onAlignToGrid={onAlignToGrid}
      />
    </div>
  );
};