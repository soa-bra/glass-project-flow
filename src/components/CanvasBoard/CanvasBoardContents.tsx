
import React from 'react';
import { useEnhancedCanvasState } from './hooks/useEnhancedCanvasState';
import { CanvasBoardContentsProps } from './types';
import { DefaultView } from './components';
import { useCanvasEventHandlers } from './components';
import { CleanCanvasPanelLayout } from './components/CleanCanvasPanelLayout';
import { CanvasWrapper } from './components/CanvasWrapper';

const CanvasBoardContents: React.FC<CanvasBoardContentsProps> = ({ 
  projectId = 'default', 
  userId = 'user1' 
}) => {
  // Initialize enhanced canvas state
  const canvasState = useEnhancedCanvasState(projectId, userId);
  
  const eventHandlers = useCanvasEventHandlers({
    selectedElementId: canvasState.selectedElementId,
    setSelectedSmartElement: canvasState.setSelectedSmartElement,
    setShowDefaultView: canvasState.setShowDefaultView,
    setSelectedTool: canvasState.setSelectedTool,
    deleteElement: canvasState.deleteElement
  });

  if (canvasState.showDefaultView) {
    return <DefaultView onStartCanvas={eventHandlers.handleStartCanvas} />;
  }

  return (
    <div className="relative w-full h-full">
      <CanvasWrapper
        showGrid={canvasState.showGrid}
        snapEnabled={canvasState.snapEnabled}
        zoom={canvasState.zoom}
        canvasPosition={canvasState.canvasPosition}
        elements={canvasState.elements}
        selectedElementId={canvasState.selectedElementId}
        selectedTool={canvasState.selectedTool}
        canvasRef={canvasState.canvasRef}
        isDrawing={canvasState.isDrawing}
        drawStart={canvasState.drawStart}
        drawEnd={canvasState.drawEnd}
        isDragging={canvasState.isDragging}
        isResizing={canvasState.isResizing}
        isSelecting={canvasState.isSelecting}
        selectionBox={canvasState.selectionBox}
        setSelectedElementId={canvasState.setSelectedElementId}
        setShowGrid={canvasState.setShowGrid}
        setSnapEnabled={canvasState.setSnapEnabled}
        handleCanvasClick={canvasState.handleCanvasClick}
        handleCanvasMouseDown={canvasState.handleCanvasMouseDown}
        handleCanvasMouseMove={canvasState.handleCanvasMouseMove}
        handleCanvasMouseUp={canvasState.handleCanvasMouseUp}
        handleElementMouseDown={canvasState.handleElementMouseDown}
        handleElementMouseMove={canvasState.handleElementMouseMove}
        handleElementMouseUp={canvasState.handleElementMouseUp}
        handleResizeMouseDown={canvasState.handleResizeMouseDown}
        handleResizeMouseMove={canvasState.handleResizeMouseMove}
      />
      
      <CleanCanvasPanelLayout
        historyIndex={canvasState.historyIndex}
        history={canvasState.history}
        onUndo={canvasState.undo}
        onRedo={canvasState.redo}
        onSave={canvasState.saveCanvas}
        onExport={canvasState.exportCanvas}
        onSettings={eventHandlers.handleSettings}
        selectedTool={canvasState.selectedTool}
        selectedElementId={canvasState.selectedElementId}
        selectedElements={canvasState.selectedElementIds}
        zoom={canvasState.zoom}
        selectedSmartElement={canvasState.selectedSmartElement}
        showGrid={canvasState.showGrid}
        snapEnabled={canvasState.snapEnabled}
        gridSize={canvasState.gridSize}
        gridShape="dots"
        layers={canvasState.layers}
        selectedLayerId={canvasState.selectedLayerId}
        elements={canvasState.elements}
        canvasPosition={canvasState.canvasPosition || { x: 0, y: 0 }}
        panSpeed={canvasState.panSpeed}
        lineWidth={canvasState.lineWidth}
        lineStyle={canvasState.lineStyle}
        selectedPenMode={canvasState.selectedPenMode}
        setSelectedTool={canvasState.setSelectedTool}
        setZoom={canvasState.setZoom}
        setShowGrid={canvasState.setShowGrid}
        setSnapEnabled={canvasState.setSnapEnabled}
        handleSmartElementSelect={eventHandlers.handleSmartElementSelect}
        handleGridSizeChange={canvasState.handleGridSizeChange}
        handleGridShapeChange={(shape) => {}}
        handleAlignToGrid={canvasState.handleAlignToGrid}
        handleLayerUpdate={canvasState.handleLayerUpdate}
        handleLayerSelect={canvasState.handleLayerSelect}
        handleCopy={canvasState.handleCopy}
        handleCut={canvasState.handleCut}
        handlePaste={canvasState.handlePaste}
        handleDeleteSelected={eventHandlers.handleDeleteSelected}
        handleGroup={canvasState.handleGroup}
        handleUngroup={canvasState.handleUngroup}
        handleLock={canvasState.handleLock}
        handleUnlock={canvasState.handleUnlock}
        updateElement={canvasState.updateElement}
        deleteElement={canvasState.deleteElement}
        onPositionChange={canvasState.setCanvasPosition}
        onFitToScreen={() => {}}
        onResetView={() => {}}
        onPanSpeedChange={canvasState.setPanSpeed}
        onLineWidthChange={canvasState.setLineWidth}
        onLineStyleChange={canvasState.setLineStyle}
        onPenModeSelect={canvasState.setSelectedPenMode}
        onFileUpload={(files) => {}}
        onNew={() => {}}
        onOpen={() => {}}
        onSmartProjectGenerate={() => {}}
      />
    </div>
  );
};

export default CanvasBoardContents;
