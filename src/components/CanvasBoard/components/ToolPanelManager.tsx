import React from 'react';
import { 
  SelectionPanel, 
  CommentPanel, 
  TextPanel, 
  ShapePanel, 
  SmartElementPanel,
  SmartPenPanel,
  ZoomPanel,
  HandPanel,
  UploadPanel
} from '../panels';
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

      case 'comment':
        return (
          <CommentPanel
            onAddComment={(text, useAI) => console.log('تعليق:', text, useAI)}
            onToggleCommentPen={() => console.log('تبديل قلم التعليق')}
            isCommentPenActive={false}
          />
        );

      case 'text':
        return (
          <TextPanel
            onAddText={(type, config) => console.log('نص:', type, config)}
          />
        );

      case 'shape':
        return (
          <ShapePanel
            onAddShape={(type, data) => console.log('شكل:', type, data)}
          />
        );

      case 'smart-element':
        return (
          <SmartElementPanel
            onAddSmartElement={(type, config) => console.log('عنصر ذكي:', type, config)}
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