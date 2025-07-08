import React from 'react';
import { useEnhancedCanvasState } from './hooks/useEnhancedCanvasState';
import { CanvasBoardContentsProps } from './types';
import { DefaultView } from './components';
import { useCanvasEventHandlers } from './components/CanvasEventHandlers';
import { CanvasWrapper } from './components/CanvasWrapper';
import { CanvasStatusBar } from './components/CanvasStatusBar';
import NewTopToolbar from './components/NewTopToolbar';
import NewMainToolbar from './components/NewMainToolbar';
import { 
  SmartAssistantPanel,
  LayersPanel, 
  ElementCustomizationPanel,
  CollaborationPanel,
  ToolCustomizationPanel 
} from './FloatingPanels';

const CanvasBoardContents: React.FC<CanvasBoardContentsProps> = ({ 
  projectId = 'default', 
  userId = 'user1' 
}) => {
  // Initialize enhanced canvas state - تحسين حالة الكانفاس
  const canvasState = useEnhancedCanvasState(projectId, userId);
  
  const eventHandlers = useCanvasEventHandlers({
    selectedElementId: canvasState.selectedElementId,
    setSelectedSmartElement: canvasState.setSelectedSmartElement,
    setShowDefaultView: canvasState.setShowDefaultView,
    setSelectedTool: canvasState.setSelectedTool,
    deleteElement: canvasState.deleteElement
  });


  // Create wrapper functions to match CanvasWrapper interface
  const wrappedHandleElementMouseDown = (e: React.MouseEvent, elementId: string) => {
    canvasState.handleElementMouseDown(e, elementId);
  };

  const wrappedHandleElementMouseMove = (e: React.MouseEvent) => {
    canvasState.handleElementMouseMove(e);
  };

  const wrappedHandleResizeMouseDown = (e: React.MouseEvent, handle: string) => {
    canvasState.handleResizeMouseDown(e, handle);
  };

  const wrappedHandleResizeMouseMove = (e: React.MouseEvent) => {
    canvasState.handleResizeMouseMove(e);
  };

  if (canvasState.showDefaultView) {
    return <DefaultView onStartCanvas={eventHandlers.handleStartCanvas} />;
  }

  return (
    <div className="relative w-full h-full">
      {/* شريط الأدوات العلوي */}
      <NewTopToolbar 
        canUndo={canvasState.history.length > 0}
        canRedo={false}
        onUndo={canvasState.undo}
        onRedo={canvasState.redo}
        onSave={() => console.log('Save')}
        onNew={() => console.log('New')}
        onOpen={() => console.log('Open')}
        onCopy={() => console.log('Copy')}
        showGrid={canvasState.showGrid}
        onGridToggle={() => canvasState.setShowGrid(!canvasState.showGrid)}
        snapEnabled={canvasState.snapEnabled}
        onSnapToggle={() => canvasState.setSnapEnabled(!canvasState.snapEnabled)}
        gridSize={20}
        onGridSizeChange={(size) => console.log('Grid size:', size)}
        gridShape="dots"
        onGridShapeChange={(shape) => console.log('Grid shape:', shape)}
        onSmartProjectGenerate={() => console.log('Smart project')}
      />

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
        handleElementMouseDown={wrappedHandleElementMouseDown}
        handleElementMouseMove={wrappedHandleElementMouseMove}
        handleElementMouseUp={canvasState.handleElementMouseUp}
        handleResizeMouseDown={wrappedHandleResizeMouseDown}
        handleResizeMouseMove={wrappedHandleResizeMouseMove}
      />

      {/* شريط الأدوات الرئيسي السفلي */}
      <NewMainToolbar 
        selectedTool={canvasState.selectedTool}
        onToolSelect={canvasState.setSelectedTool}
      />

      {/* شريط الحالة السفلي */}
      <CanvasStatusBar 
        elements={canvasState.elements}
        selectedElementId={canvasState.selectedElementId}
        zoom={canvasState.zoom}
        selectedTool={canvasState.selectedTool}
        showGrid={canvasState.showGrid}
        snapEnabled={canvasState.snapEnabled}
        onToggleGrid={() => canvasState.setShowGrid(!canvasState.showGrid)}
        onToggleSnap={() => canvasState.setSnapEnabled(!canvasState.snapEnabled)}
      />
      
      {/* اللوحات العائمة الجديدة */}
      <SmartAssistantPanel visible={true} />
      <LayersPanel 
        visible={true}
        layers={canvasState.layers.map(layer => ({
          ...layer,
          type: 'element' as const
        }))}
        selectedLayerId={canvasState.selectedLayerId}
        onLayerUpdate={canvasState.handleLayerUpdate}
        onLayerSelect={canvasState.handleLayerSelect}
      />
      <ElementCustomizationPanel 
        visible={!!canvasState.selectedElementId}
        selectedElement={canvasState.elements.find(el => el.id === canvasState.selectedElementId)}
        onElementUpdate={canvasState.updateElement}
      />
      <CollaborationPanel visible={true} />
      <ToolCustomizationPanel 
        visible={true}
        selectedTool={canvasState.selectedTool}
        onToolAction={(action, data) => console.log(action, data)}
      />
      
    </div>
  );
};

export default CanvasBoardContents;