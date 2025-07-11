import React from 'react';
import { CanvasPanelLayoutProps } from './CanvasPanelTypes';
import { CanvasTopSection } from './CanvasTopSection';
import { CanvasCollaborationSection } from './CanvasCollaborationSection';
import { CanvasInspectorSection } from './CanvasInspectorSection';
import { CanvasAISection } from './CanvasAISection';
import { CanvasToolsSection } from './CanvasToolsSection';
import { CanvasBottomSection } from './CanvasBottomSection';

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
      
      {/* Collaboration Section */}
      <CanvasCollaborationSection />
      
      {/* Inspector Section */}
      <CanvasInspectorSection 
        selectedElementId={selectedElementId}
        elements={elements}
        onUpdateElement={updateElement}
        onDeleteElement={deleteElement}
      />
      
      {/* AI Assistant Section */}
      <CanvasAISection />
      
      {/* Tools Section */}
      <CanvasToolsSection
        selectedTool={selectedTool}
        selectedElements={selectedElementsAsElements}
        selectedElementIds={selectedElements}
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
      />
      
      {/* Bottom Toolbar Section */}
      <CanvasBottomSection
        selectedTool={selectedTool}
        onToolSelect={setSelectedTool}
      />
    </>
  );
};
