
import React from 'react';
import { CanvasPanelLayoutProps } from './CanvasPanelTypes';
import { CanvasTopSection } from './CanvasTopSection';
import { CanvasBottomSection } from './CanvasBottomSection';
import CanvasFloatingPanelsManager from './CanvasFloatingPanelsManager';

export const CleanCanvasPanelLayout: React.FC<CanvasPanelLayoutProps> = ({
  historyIndex,
  history,
  onUndo,
  onRedo,
  onSave,
  onExport,
  onSettings,
  selectedTool,
  selectedElementId,
  selectedElements,
  zoom,
  selectedSmartElement,
  showGrid,
  snapEnabled,
  gridSize,
  gridShape,
  layers,
  selectedLayerId,
  elements,
  canvasPosition,
  panSpeed,
  lineWidth,
  lineStyle,
  selectedPenMode,
  setSelectedTool,
  setZoom,
  setShowGrid,
  setSnapEnabled,
  handleSmartElementSelect,
  handleGridSizeChange,
  handleGridShapeChange,
  handleAlignToGrid,
  handleLayerUpdate,
  handleLayerSelect,
  handleCopy,
  handleCut,
  handlePaste,
  handleDeleteSelected,
  handleGroup,
  handleUngroup,
  handleLock,
  handleUnlock,
  updateElement,
  deleteElement,
  onPositionChange,
  onFitToScreen,
  onResetView,
  onPanSpeedChange,
  onLineWidthChange,
  onLineStyleChange,
  onPenModeSelect,
  onFileUpload,
  onNew,
  onOpen,
  onSmartProjectGenerate
}) => {
  return (
    <>
      {/* Top Toolbar Section */}
      <CanvasTopSection
        historyIndex={historyIndex}
        history={history}
        onUndo={onUndo}
        onRedo={onRedo}
        onSave={onSave}
        onNew={onNew}
        onOpen={onOpen}
        handleCopy={handleCopy}
        showGrid={showGrid}
        onGridToggle={() => setShowGrid(!showGrid)}
        snapEnabled={snapEnabled}
        onSnapToggle={() => setSnapEnabled(!snapEnabled)}
        gridSize={gridSize}
        onGridSizeChange={handleGridSizeChange}
        gridShape={gridShape}
        onGridShapeChange={handleGridShapeChange}
        onSmartProjectGenerate={onSmartProjectGenerate}
      />
      
      {/* Floating Panels Manager */}
      <CanvasFloatingPanelsManager
        selectedTool={selectedTool}
        selectedElementId={selectedElementId}
        elements={elements}
        layers={layers}
        selectedLayerId={selectedLayerId}
        onLayerUpdate={handleLayerUpdate}
        onLayerSelect={handleLayerSelect}
        onUpdateElement={updateElement}
      />
      
      {/* Bottom Toolbar Section */}
      <CanvasBottomSection
        selectedTool={selectedTool}
        onToolSelect={setSelectedTool}
      />
    </>
  );
};
