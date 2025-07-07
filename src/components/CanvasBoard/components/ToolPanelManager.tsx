import React from 'react';
import { SelectionPanel, SmartPenPanel, ZoomPanel, HandPanel, UploadPanel } from '../panels';
import { CanvasElement } from '../types';

interface ToolPanelManagerProps {
  selectedTool: string;
  selectedElements: CanvasElement[];
  zoom: number;
  canvasPosition: { x: number; y: number };
  panSpeed: number;
  lineWidth: number;
  lineStyle: string;
  selectedPenMode: string;
  
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
  layers: any[];
  onLayerReorder: (layers: any[]) => void;
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
  layers,
  onLayerReorder
}) => {
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

      case 'smart-pen':
        return (
          <SmartPenPanel
            selectedMode={selectedPenMode}
            onModeSelect={onPenModeSelect}
            lineWidth={lineWidth}
            onLineWidthChange={onLineWidthChange}
            lineStyle={lineStyle}
            onLineStyleChange={onLineStyleChange}
          />
        );

      case 'zoom':
        return (
          <ZoomPanel
            zoom={zoom}
            onZoomChange={onZoomChange}
            canvasPosition={canvasPosition}
            onPositionChange={onPositionChange}
            onFitToScreen={onFitToScreen}
            onResetView={onResetView}
          />
        );

      case 'hand':
        return (
          <HandPanel
            panSpeed={panSpeed}
            onPanSpeedChange={onPanSpeedChange}
            canvasPosition={canvasPosition}
            onPositionChange={onPositionChange}
            onResetPosition={onResetView}
            onFitToScreen={onFitToScreen}
          />
        );

      case 'upload':
        return (
          <UploadPanel
            onFileUpload={onFileUpload}
            maxFileSize={10}
            allowedTypes={['image/*', 'video/*', 'application/pdf', '.txt', '.doc', '.docx']}
          />
        );

      default:
        return null;
    }
  };

  const panel = renderToolPanel();
  
  if (!panel) return null;

  return (
    <div className="fixed bottom-24 right-6 z-40">
      {panel}
    </div>
  );
};

export default ToolPanelManager;