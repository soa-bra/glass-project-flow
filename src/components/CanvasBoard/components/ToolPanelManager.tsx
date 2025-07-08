import React from 'react';
import { 
  TextPanel, 
  ShapePanel, 
  HandPanel,
  UploadPanel,
  GridPanel,
  LayersPanel
} from '../panels';
import { 
  EnhancedSelectionPanel,
  EnhancedSmartPenPanel,
  EnhancedSmartElementPanel,
  EnhancedZoomPanel,
  EnhancedCommentPanel
} from '../panels/enhanced';
import { CanvasElement } from '../types';

import { Layer } from './CanvasPanelTypes';

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
  console.log('🔧 ToolPanelManager render:', {
    selectedTool,
    selectedElementsCount: selectedElements.length,
    zoom
  });
  const renderToolPanel = () => {
    switch (selectedTool) {
      case 'select':
        return (
          <EnhancedSelectionPanel
            selectedElements={selectedElements}
            onUpdateElement={onUpdateElement}
            onCopy={onCopy}
            onCut={onCut}
            onPaste={onPaste}
            onDelete={onDelete}
            onGroup={onGroup}
            onUngroup={() => console.log('إلغاء التجميع')}
            onLock={() => console.log('قفل')}
            onUnlock={() => console.log('إلغاء القفل')}
            onDuplicate={() => console.log('تكرار')}
            onFlipHorizontal={() => console.log('قلب أفقي')}
            onFlipVertical={() => console.log('قلب عمودي')}
            onRotate={(angle) => console.log('دوران:', angle)}
            onAlign={(type) => console.log('محاذاة:', type)}
            onDistribute={(type) => console.log('توزيع:', type)}
            layers={layers}
            onLayerReorder={onLayerReorder}
          />
        );

      case 'comment':
        return (
          <EnhancedCommentPanel
            onAddComment={(text, type, tags) => console.log('تعليق:', text, type, tags)}
            onToggleCommentPen={() => console.log('تبديل قلم التعليق')}
            onResolveComment={(id) => console.log('حل تعليق:', id)}
            onReplyToComment={(id, reply) => console.log('رد:', id, reply)}
            isCommentPenActive={false}
            isVoiceEnabled={true}
            comments={[]}
            collaborators={['محمد', 'فاطمة', 'أحمد']}
            onToggleVoice={(enabled) => console.log('تبديل الصوت:', enabled)}
            onMentionUser={(username) => console.log('ذكر:', username)}
          />
        );

      case 'text':
        return (
          <TextPanel
            onAddText={(type, config) => {
              console.log('نص:', type, config);
              // This will be handled by the canvas click event when text tool is selected
            }}
          />
        );

      case 'shape':
        return (
          <ShapePanel
            onAddShape={(type, data) => {
              console.log('شكل:', type, data);
              // This will be handled by the canvas click/drag event when shape tool is selected
            }}
          />
        );

      case 'smart-element':
        return (
          <EnhancedSmartElementPanel
            onAddSmartElement={(type, config) => {
              console.log('عنصر ذكي:', type, config);
              // This will be handled by canvas click when smart-element tool is selected
            }}
            onPreviewElement={(type, config) => console.log('معاينة:', type, config)}
            isAIEnabled={true}
            onToggleAI={(enabled) => console.log('تبديل الذكاء الاصطناعي:', enabled)}
          />
        );

      case 'smart-pen':
        return (
          <EnhancedSmartPenPanel
            selectedPenMode={selectedPenMode}
            lineWidth={lineWidth}
            lineStyle={lineStyle}
            penColor="#000000"
            smoothing={50}
            snapSensitivity={20}
            autoGroup={true}
            smartRecognition={true}
            onPenModeSelect={onPenModeSelect}
            onLineWidthChange={onLineWidthChange}
            onLineStyleChange={onLineStyleChange}
            onColorChange={(color) => console.log('لون:', color)}
            onSmoothingChange={(smoothing) => console.log('تنعيم:', smoothing)}
            onSnapSensitivityChange={(sensitivity) => console.log('حساسية:', sensitivity)}
            onAutoGroupToggle={(enabled) => console.log('تجميع تلقائي:', enabled)}
            onSmartRecognitionToggle={(enabled) => console.log('تعرف ذكي:', enabled)}
            onCalibratePen={() => console.log('معايرة القلم')}
          />
        );

      case 'zoom':
        return (
          <EnhancedZoomPanel
            zoom={zoom}
            canvasPosition={canvasPosition}
            panSpeed={panSpeed}
            smoothZoom={true}
            zoomToMouse={true}
            fitPadding={20}
            onZoomChange={onZoomChange}
            onPositionChange={onPositionChange}
            onFitToScreen={onFitToScreen}
            onFitToSelection={() => console.log('ملاءمة التحديد')}
            onResetView={onResetView}
            onPanSpeedChange={onPanSpeedChange}
            onSmoothZoomToggle={(enabled) => console.log('زوم سلس:', enabled)}
            onZoomToMouseToggle={(enabled) => console.log('زوم للماوس:', enabled)}
            onFitPaddingChange={(padding) => console.log('هامش:', padding)}
            onCenterOnElement={(id) => console.log('توسيط العنصر:', id)}
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