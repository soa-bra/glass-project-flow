import React from 'react';
import { CanvasPanelLayoutProps } from './CanvasPanelTypes';
import { CanvasTopSection } from './CanvasTopSection';
import { CanvasBottomSection } from './CanvasBottomSection';
import { FloatingPanelLayout } from './FloatingPanelLayout';

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
  onSmartProjectGenerate,
  collab
}) => {
  const selectedElementsAsElements = selectedElements
    .map(id => elements.find(el => el.id === id))
    .filter(Boolean);

  return (
    <>
      {/* Top Section */}
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
      
      {/* Floating Panels Layout */}
      <FloatingPanelLayout
        selectedTool={selectedTool}
        selectedElements={selectedElementsAsElements}
        elements={elements}
        selectedElementId={selectedElementId}
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
        onUpdateElement={updateElement}
        onCopy={handleCopy}
        onCut={handleCut}
        onPaste={handlePaste}
        onDelete={handleDeleteSelected}
        onGroup={handleGroup}
        onZoomChange={setZoom}
        onPositionChange={onPositionChange}
        onFitToScreen={onFitToScreen}
        onResetView={onResetView}
        onPanSpeedChange={onPanSpeedChange}
        onLineWidthChange={onLineWidthChange}
        onLineStyleChange={onLineStyleChange}
        onPenModeSelect={onPenModeSelect}
        onFileUpload={onFileUpload}
        onLayerReorder={handleLayerUpdate}
        onLayerSelect={handleLayerSelect}
        onGridToggle={() => setShowGrid(!showGrid)}
        onSnapToggle={() => setSnapEnabled(!snapEnabled)}
        onGridSizeChange={handleGridSizeChange}
        onGridShapeChange={handleGridShapeChange}
        onAlignToGrid={handleAlignToGrid}
        onUngroup={handleUngroup}
        onLock={handleLock}
        onUnlock={handleUnlock}
        collab={collab}
      />
      
      {/* Bottom Toolbar Section */}
      <CanvasBottomSection
        selectedTool={selectedTool}
        onToolSelect={setSelectedTool}
      />
    </>
  );
};