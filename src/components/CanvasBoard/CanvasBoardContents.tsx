import React, { useState } from 'react';
import { useCanvasState } from './hooks/useCanvasState';
import { CanvasBoardContentsProps } from './types';
import {
  DefaultView,
  TopActionBar,
  MainToolbar,
  CollabBar,
  ToolPropsBar,
  Inspector,
  Canvas
} from './components';
import AIAssistantPanel from './AIAssistantPanel';
import SmartElementsModal from './components/SmartElementsModal';

const CanvasBoardContents: React.FC<CanvasBoardContentsProps> = ({ 
  projectId = 'default', 
  userId = 'user1' 
}) => {
  const [showSmartModal, setShowSmartModal] = useState(false);
  const {
    selectedTool,
    selectedElementId,
    showGrid,
    snapEnabled,
    elements,
    showDefaultView,
    zoom,
    canvasPosition,
    canvasRef,
    history,
    historyIndex,
    isDrawing,
    drawStart,
    drawEnd,
    selectedSmartElement,
    isDragging,
    isResizing,
    setSelectedTool,
    setSelectedElementId,
    setShowGrid,
    setSnapEnabled,
    setShowDefaultView,
    setZoom,
    setSelectedSmartElement,
    handleCanvasClick,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleElementMouseDown,
    handleElementMouseMove,
    handleElementMouseUp,
    handleResizeMouseDown,
    handleResizeMouseMove,
    undo,
    redo,
    saveCanvas,
    exportCanvas,
    convertToProject,
    updateElement,
    deleteElement
  } = useCanvasState(projectId, userId);

  const handleSmartElementSelect = (elementId: string) => {
    setSelectedSmartElement(elementId);
    // لا نحتاج modal بعد الآن، سيتم الرسم مباشرة على الكانفس
  };

  const handleCopy = () => {
    if (selectedElementId) {
      console.log('نسخ العنصر:', selectedElementId);
    }
  };

  const handleCut = () => {
    if (selectedElementId) {
      console.log('قص العنصر:', selectedElementId);
    }
  };

  const handlePaste = () => {
    console.log('لصق العنصر');
  };

  const handleStartCanvas = () => {
    setShowDefaultView(false);
    setSelectedTool('select');
  };

  const handleSettings = () => {
    console.log('فتح الإعدادات');
  };

  if (showDefaultView) {
    return <DefaultView onStartCanvas={handleStartCanvas} />;
  }

  return (
    <div className="relative w-full h-full">
      <Canvas
        showGrid={showGrid}
        snapEnabled={snapEnabled}
        zoom={zoom}
        canvasPosition={canvasPosition}
        elements={elements}
        selectedElementId={selectedElementId}
        selectedTool={selectedTool}
        canvasRef={canvasRef}
        isDrawing={isDrawing}
        drawStart={drawStart}
        drawEnd={drawEnd}
        isDragging={isDragging}
        isResizing={isResizing}
        onCanvasClick={handleCanvasClick}
        onCanvasMouseDown={handleCanvasMouseDown}
        onCanvasMouseMove={handleCanvasMouseMove}
        onCanvasMouseUp={handleCanvasMouseUp}
        onElementSelect={setSelectedElementId}
        onElementMouseDown={handleElementMouseDown}
        onElementMouseMove={handleElementMouseMove}
        onElementMouseUp={handleElementMouseUp}
        onResizeMouseDown={handleResizeMouseDown}
        onResizeMouseMove={handleResizeMouseMove}
        onToggleGrid={() => setShowGrid(!showGrid)}
        onToggleSnap={() => setSnapEnabled(!snapEnabled)}
      />
      <TopActionBar 
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={undo}
        onRedo={redo}
        onSave={saveCanvas}
        onExport={exportCanvas}
        onSettings={handleSettings}
      />
      <CollabBar />
      <ToolPropsBar
        selectedTool={selectedTool}
        selectedElementId={selectedElementId}
        zoom={zoom}
        selectedSmartElement={selectedSmartElement}
        onZoomChange={setZoom}
        onSmartElementSelect={handleSmartElementSelect}
        onCopy={handleCopy}
        onCut={handleCut}
        onPaste={handlePaste}
        onDelete={() => selectedElementId && deleteElement(selectedElementId)}
      />
      <Inspector 
        selectedElementId={selectedElementId}
        elements={elements}
        onUpdateElement={updateElement}
        onDeleteElement={deleteElement}
      />
      <div className="fixed bottom-24 right-4 z-40 w-80">
        <AIAssistantPanel />
      </div>
      <MainToolbar
        selectedTool={selectedTool}
        onToolSelect={setSelectedTool}
      />
    </div>
  );
};

export default CanvasBoardContents;