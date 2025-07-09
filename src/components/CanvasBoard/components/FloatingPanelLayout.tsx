import React from 'react';
import { CanvasElement } from '../types';
import { Layer } from './CanvasPanelTypes';
import { AIAssistantPanel } from './panels/AIAssistantPanel';
import { LayersPanel } from './panels/LayersPanel';
import { ElementStylePanel } from './panels/ElementStylePanel';
import { CollaborationPanel } from './panels/CollaborationPanel';
import { ToolCustomizationPanel } from './panels/ToolCustomizationPanel';

interface FloatingPanelLayoutProps {
  selectedTool: string;
  selectedElements: CanvasElement[];
  elements: CanvasElement[];
  selectedElementId: string | null;
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
  
  // Handlers
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

export const FloatingPanelLayout: React.FC<FloatingPanelLayoutProps> = ({
  selectedTool,
  selectedElements,
  elements,
  selectedElementId,
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
    <>
      {/* AI Assistant Panel - Bottom Right (25% height) */}
      <div className="fixed bottom-6 right-6 w-80 h-[25vh] z-40 pointer-events-auto">
        <AIAssistantPanel />
      </div>

      {/* Layers Panel - Above AI Assistant (50% height) */}
      <div className="fixed bottom-[27vh] right-6 w-80 h-[50vh] z-40 pointer-events-auto">
        <LayersPanel
          layers={layers}
          selectedLayerId={selectedLayerId}
          onLayerUpdate={onLayerReorder}
          onLayerSelect={onLayerSelect}
          elements={elements}
        />
      </div>

      {/* Element Style Panel - Top Left (25% height) */}
      <div className="fixed top-6 left-6 w-80 h-[25vh] z-40 pointer-events-auto">
        <ElementStylePanel
          selectedElement={selectedElementId ? elements.find(el => el.id === selectedElementId) : null}
          onUpdateElement={onUpdateElement}
        />
      </div>

      {/* Collaboration Panel - Top Right (25% height) */}
      <div className="fixed top-6 right-6 w-80 h-[25vh] z-40 pointer-events-auto">
        <CollaborationPanel />
      </div>

      {/* Tool Customization Panel - Left Side (75% height) */}
      <div className="fixed top-[27vh] left-6 w-80 h-[75vh] z-40 pointer-events-auto">
        <ToolCustomizationPanel
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
    </>
  );
};