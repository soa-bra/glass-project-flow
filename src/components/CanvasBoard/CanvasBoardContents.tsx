
import React from 'react';
import { useEnhancedCanvasState } from './hooks/useEnhancedCanvasState';
import { useToolShortcuts } from './hooks/useToolShortcuts';
import { CanvasBoardContentsProps } from './types';
import { DefaultView } from './components';
import { useCanvasEventHandlers } from './components/CanvasEventHandlers';
import { CleanCanvasPanelLayout } from './components/CleanCanvasPanelLayout';
import { CanvasWrapper } from './components/CanvasWrapper';
import { ShortcutNotification } from './components/ShortcutNotification';
import { useCanvasCollaboration } from '@/hooks/useCanvasCollaboration';
import { SelectionTool } from './tools/SelectionTool';

const CanvasBoardContents: React.FC<CanvasBoardContentsProps> = ({ 
  projectId = 'default', 
  userId = 'user1' 
}) => {
  // Initialize enhanced canvas state
  const canvasState = useEnhancedCanvasState(projectId, userId);
  
  // Initialize tool shortcuts
  const toolShortcuts = useToolShortcuts({
    selectedTool: canvasState.selectedTool,
    onToolSelect: canvasState.setSelectedTool,
    disabled: canvasState.showDefaultView
  });
  
  // Initialize collaboration features
  const collaboration = useCanvasCollaboration({
    projectId,
    userId,
    enable: true
  });
  
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
      {/* Canvas Layer - Behind all UI elements */}
      <div className="absolute inset-0 pointer-events-auto">
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
      </div>
      
      {/* UI Layer - All toolbars and panels */}
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
      
      {/* Selection Tool */}
      <SelectionTool
        selectedTool={canvasState.selectedTool}
        selectedElements={canvasState.selectedElementIds.map(id => 
          canvasState.elements.find(el => el.id === id)
        ).filter(Boolean)}
        onCopy={canvasState.handleCopy}
        onCut={canvasState.handleCut}
        onPaste={canvasState.handlePaste}
        onDelete={eventHandlers.handleDeleteSelected}
        onGroup={canvasState.handleGroup}
        onUngroup={canvasState.handleUngroup}
        onLock={canvasState.handleLock}
        onUnlock={canvasState.handleUnlock}
        onSelectAll={() => canvasState.setSelectedElementIds(canvasState.elements.map(el => el.id))}
        onDeselectAll={() => canvasState.setSelectedElementIds([])}
        onMoveElement={(elementId, direction, distance) => {
          const element = canvasState.elements.find(el => el.id === elementId);
          if (element) {
            const newX = direction === 'left' ? element.position.x - distance :
                        direction === 'right' ? element.position.x + distance : element.position.x;
            const newY = direction === 'up' ? element.position.y - distance :
                        direction === 'down' ? element.position.y + distance : element.position.y;
            canvasState.updateElement(elementId, { position: { x: newX, y: newY } });
          }
        }}
        onRotateElement={(elementId, angle) => {
          const element = canvasState.elements.find(el => el.id === elementId);
          if (element) {
            const currentRotation = element.rotation || 0;
            canvasState.updateElement(elementId, { rotation: currentRotation + angle });
          }
        }}
        onFlipElement={(elementId, direction) => {
          const element = canvasState.elements.find(el => el.id === elementId);
          if (element) {
            const updates = direction === 'horizontal' 
              ? { flipX: !(element.flipX || false) }
              : { flipY: !(element.flipY || false) };
            canvasState.updateElement(elementId, updates);
          }
        }}
        onAlignElements={(elementIds, direction) => {
          // Implement alignment logic
          console.log('Aligning elements:', elementIds, direction);
        }}
        onUpdateElement={canvasState.updateElement}
      />
      
      {/* إشعارات الاختصارات */}
      <ShortcutNotification
        toolName={toolShortcuts.notification.toolName}
        shortcut={toolShortcuts.notification.shortcut}
        show={toolShortcuts.notification.show}
        onHide={toolShortcuts.hideNotification}
      />
    </div>
  );
};

export default CanvasBoardContents;
