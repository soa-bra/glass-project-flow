import React, { useState } from 'react';
import { useCanvasState } from './hooks/useCanvasState';
import { CanvasBoardContentsProps } from './types';
import { DefaultView } from './components';
import { useCanvasEventHandlers } from './components/CanvasEventHandlers';
import { CanvasPanelLayout } from './components/CanvasPanelLayout';
import { CanvasWrapper } from './components/CanvasWrapper';

const CanvasBoardContents: React.FC<CanvasBoardContentsProps> = ({ 
  projectId = 'default', 
  userId = 'user1' 
}) => {
  const [showSmartModal, setShowSmartModal] = useState(false);
  const canvasState = useCanvasState(projectId, userId);
  
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
      
      <CanvasPanelLayout
        historyIndex={canvasState.historyIndex}
        history={canvasState.history}
        onUndo={canvasState.undo}
        onRedo={canvasState.redo}
        onSave={canvasState.saveCanvas}
        onExport={canvasState.exportCanvas}
        onSettings={eventHandlers.handleSettings}
        selectedTool={canvasState.selectedTool}
        selectedElementId={canvasState.selectedElementId}
        selectedElements={canvasState.selectedElements}
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
        panSpeed={100}
        lineWidth={2}
        lineStyle="solid"
        selectedPenMode="smart-draw"
        setSelectedTool={canvasState.setSelectedTool}
        setZoom={canvasState.setZoom}
        setShowGrid={canvasState.setShowGrid}
        setSnapEnabled={canvasState.setSnapEnabled}
        handleSmartElementSelect={eventHandlers.handleSmartElementSelect}
        handleGridSizeChange={canvasState.handleGridSizeChange}
        handleGridShapeChange={(shape) => console.log('Grid shape:', shape)}
        handleAlignToGrid={canvasState.handleAlignToGrid}
        handleLayerUpdate={canvasState.handleLayerUpdate}
        handleLayerSelect={canvasState.handleLayerSelect}
        handleCopy={eventHandlers.handleCopy}
        handleCut={eventHandlers.handleCut}
        handlePaste={eventHandlers.handlePaste}
        handleDeleteSelected={eventHandlers.handleDeleteSelected}
        handleGroup={canvasState.handleGroup}
        handleUngroup={canvasState.handleUngroup}
        handleLock={canvasState.handleLock}
        handleUnlock={canvasState.handleUnlock}
        updateElement={canvasState.updateElement}
        deleteElement={canvasState.deleteElement}
        onPositionChange={(pos) => console.log('Position change:', pos)}
        onFitToScreen={() => console.log('Fit to screen')}
        onResetView={() => console.log('Reset view')}
        onPanSpeedChange={(speed) => console.log('Pan speed:', speed)}
        onLineWidthChange={(width) => console.log('Line width:', width)}
        onLineStyleChange={(style) => console.log('Line style:', style)}
        onPenModeSelect={(mode) => console.log('Pen mode:', mode)}
        onFileUpload={(files) => console.log('Files uploaded:', files)}
        onNew={() => console.log('New canvas')}
        onOpen={() => console.log('Open canvas')}
        onSmartProjectGenerate={() => console.log('Smart project generate')}
      />
    </div>
  );
};

export default CanvasBoardContents;