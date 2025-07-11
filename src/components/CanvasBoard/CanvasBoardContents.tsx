
import React, { useState, useCallback, memo } from 'react';
import { useEnhancedCanvasState } from './hooks/useEnhancedCanvasState';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { CanvasBoardContentsProps } from './types';
import { DefaultView } from './components';
import { useCanvasEventHandlers } from './components';
import { CanvasWrapper } from './components/CanvasWrapper';
import { CanvasTopSection } from './components/CanvasTopSection';
import { CanvasBottomSection } from './components/CanvasBottomSection';
import { FloatingPanels } from './components/FloatingPanels';
import { FloatingPanelControls } from './components/FloatingPanelControls';

const CanvasBoardContents: React.FC<CanvasBoardContentsProps> = memo(({ 
  projectId = 'default', 
  userId = 'user1' 
}) => {
  // Initialize enhanced canvas state
  const canvasState = useEnhancedCanvasState(projectId, userId);
  
  // Floating panels state
  const [showSmartAssistant, setShowSmartAssistant] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const [showAppearance, setShowAppearance] = useState(false);
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [showTools, setShowTools] = useState(false);
  
  const eventHandlers = useCanvasEventHandlers({
    selectedElementId: canvasState.selectedElementId,
    setSelectedSmartElement: canvasState.setSelectedSmartElement,
    setShowDefaultView: canvasState.setShowDefaultView,
    setSelectedTool: canvasState.setSelectedTool,
    deleteElement: canvasState.deleteElement
  });

  const handleTogglePanel = useCallback((panel: string) => {
    switch (panel) {
      case 'smartAssistant':
        setShowSmartAssistant(prev => !prev);
        break;
      case 'layers':
        setShowLayers(prev => !prev);
        break;
      case 'appearance':
        setShowAppearance(prev => !prev);
        break;
      case 'collaboration':
        setShowCollaboration(prev => !prev);
        break;
      case 'tools':
        setShowTools(prev => !prev);
        break;
      default:
        break;
    }
  }, []);

  // Enhanced keyboard shortcuts
  useKeyboardShortcuts({
    onUndo: canvasState.undo,
    onRedo: canvasState.redo,
    onSave: canvasState.saveCanvas,
    onCopy: canvasState.handleCopy,
    onDelete: () => {
      if (canvasState.selectedElementId) {
        canvasState.deleteElement(canvasState.selectedElementId);
      }
    },
    onSelectAll: () => {
      // Implement select all logic
      console.log('Select all');
    },
    onZoomIn: () => {
      // Implement zoom in
      console.log('Zoom in');
    },
    onZoomOut: () => {
      // Implement zoom out
      console.log('Zoom out');
    },
    onZoomReset: () => {
      // Implement zoom reset
      console.log('Zoom reset');
    }
  });

  if (canvasState.showDefaultView) {
    return <DefaultView onStartCanvas={eventHandlers.handleStartCanvas} />;
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-background to-muted/10 animate-fade-in">
      {/* Main Canvas Area */}
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
      
      {/* Top Toolbar */}
      <CanvasTopSection
        historyIndex={canvasState.historyIndex}
        history={canvasState.history}
        onUndo={canvasState.undo}
        onRedo={canvasState.redo}
        onSave={canvasState.saveCanvas}
        onNew={() => {}}
        onOpen={() => {}}
        handleCopy={canvasState.handleCopy}
        showGrid={canvasState.showGrid}
        onGridToggle={() => canvasState.setShowGrid(!canvasState.showGrid)}
        snapEnabled={canvasState.snapEnabled}
        onSnapToggle={() => canvasState.setSnapEnabled(!canvasState.snapEnabled)}
        gridSize={canvasState.gridSize}
        onGridSizeChange={canvasState.handleGridSizeChange}
        gridShape="dots"
        onGridShapeChange={(shape) => {}}
        onSmartProjectGenerate={() => {}}
      />
      
      {/* Bottom Toolbar */}
      <CanvasBottomSection
        selectedTool={canvasState.selectedTool}
        onToolSelect={canvasState.setSelectedTool}
      />
      
      {/* Floating Panel Controls */}
      <FloatingPanelControls
        showSmartAssistant={showSmartAssistant}
        showLayers={showLayers}
        showAppearance={showAppearance}
        showCollaboration={showCollaboration}
        showTools={showTools}
        onTogglePanel={handleTogglePanel}
      />
      
      {/* Floating Panels */}
      <FloatingPanels
        showSmartAssistant={showSmartAssistant}
        showLayers={showLayers}
        showAppearance={showAppearance}
        showCollaboration={showCollaboration}
        showTools={showTools}
        onTogglePanel={handleTogglePanel}
        layers={canvasState.layers}
        selectedLayerId={canvasState.selectedLayerId}
        onLayerSelect={canvasState.handleLayerSelect}
        selectedElementId={canvasState.selectedElementId}
        elements={canvasState.elements}
      />
    </div>
  );
});

CanvasBoardContents.displayName = 'CanvasBoardContents';

export default CanvasBoardContents;
