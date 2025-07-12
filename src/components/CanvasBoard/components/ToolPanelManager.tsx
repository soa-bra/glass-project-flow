import React from 'react';
import { 
  TextPanel, 
  ShapePanel, 
  HandPanel,
  UploadPanel,
  GridPanel,
  LayersPanel,
  SelectionPanel,
  SmartPenPanel,
  SmartElementPanel,
  ZoomPanel,
  CommentPanel
} from '../panels';
// Enhanced panels have been removed - using basic panels instead
import { CanvasElement } from '../types';

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  elements: string[];
}

interface ToolPanelManagerProps {
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

const ToolPanelManager: React.FC<ToolPanelManagerProps> = ({
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
  // Tool panel manager logic
  const renderToolPanel = () => {
    switch (selectedTool) {
      case 'select':
        return (
          <SelectionPanel
            selectedElements={selectedElements}
            onUpdateElement={onUpdateElement}
            onCopy={onCopy}
            onCut={onCut}
            onPaste={onPaste}
            onDelete={onDelete}
            onGroup={onGroup}
            layers={layers}
            onLayerReorder={onLayerReorder}
          />
        );

      case 'comment':
        return (
          <CommentPanel
            onAddComment={(text) => {/* Add comment logic */}}
            onToggleCommentPen={() => {/* Toggle comment pen logic */}}
            isCommentPenActive={false}
          />
        );

      case 'text':
        return (
          <TextPanel
            onAddText={(type, config) => {
              // Add text element logic
              // This will be handled by the canvas click event when text tool is selected
            }}
          />
        );

      case 'shape':
        return (
          <ShapePanel
            onAddShape={(type, data) => {
              // Add shape element logic
              // This will be handled by the canvas click/drag event when shape tool is selected
            }}
          />
        );

      case 'smart-element':
        return (
          <SmartElementPanel
            onAddSmartElement={(type, config) => {
              // Add smart element logic
              // This will be handled by canvas click when smart-element tool is selected
            }}
          />
        );

      case 'smart-pen':
        return (
          <SmartPenPanel
            selectedPenMode={selectedPenMode}
            lineWidth={lineWidth}
            lineStyle={lineStyle}
            onPenModeSelect={onPenModeSelect}
            onLineWidthChange={onLineWidthChange}
            onLineStyleChange={onLineStyleChange}
          />
        );

      case 'zoom':
        return (
          <ZoomPanel
            zoom={zoom}
            canvasPosition={canvasPosition}
            panSpeed={panSpeed}
            onZoomChange={onZoomChange}
            onPositionChange={onPositionChange}
            onFitToScreen={onFitToScreen}
            onResetView={onResetView}
            onPanSpeedChange={onPanSpeedChange}
          />
        );

      case 'hand':
        return (
          <HandPanel
            panSpeed={panSpeed}
            canvasPosition={canvasPosition}
            onPanSpeedChange={onPanSpeedChange}
            onPositionChange={onPositionChange}
            onResetView={onResetView}
          />
        );

      case 'grid':
        return (
          <GridPanel
            showGrid={showGrid}
            snapEnabled={snapEnabled}
            gridSize={gridSize}
            gridShape={gridShape}
            onGridToggle={onGridToggle}
            onSnapToggle={onSnapToggle}
            onGridSizeChange={onGridSizeChange}
            onGridShapeChange={onGridShapeChange}
            onAlignToGrid={onAlignToGrid}
          />
        );

      case 'layers':
        return (
          <LayersPanel
            layers={layers}
            selectedLayerId={selectedLayerId}
            onLayerUpdate={onLayerReorder}
            onLayerSelect={onLayerSelect}
          />
        );

      case 'upload':
        return (
          <UploadPanel
            onFileUpload={onFileUpload}
          />
        );

      default:
        return null;
    }
  };

  const panel = renderToolPanel();
  
  if (!panel) return null;

  return panel;
};

export default ToolPanelManager;