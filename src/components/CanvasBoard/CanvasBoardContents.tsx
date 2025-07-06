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
  const [selectedSmartElement, setSelectedSmartElement] = useState('');
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
    setSelectedTool,
    setSelectedElementId,
    setShowGrid,
    setSnapEnabled,
    setShowDefaultView,
    setZoom,
    handleCanvasClick,
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
    setShowSmartModal(true);
  };

  const handleCreateSmartElement = (elementData: any) => {
    console.log('إنشاء عنصر ذكي:', elementData);
    // هنا يمكن إضافة منطق إنشاء العنصر الذكي
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
        onCanvasClick={handleCanvasClick}
        onElementSelect={setSelectedElementId}
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
        onConvert={convertToProject}
        onSettings={handleSettings}
      />
      <CollabBar />
      <ToolPropsBar
        selectedTool={selectedTool}
        selectedElementId={selectedElementId}
        zoom={zoom}
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
      <div className="fixed bottom-4 right-4 z-40 w-80">
        <AIAssistantPanel />
      </div>
      <MainToolbar
        selectedTool={selectedTool}
        onToolSelect={setSelectedTool}
      />
      
      <SmartElementsModal
        isOpen={showSmartModal}
        onClose={() => setShowSmartModal(false)}
        selectedElement={selectedSmartElement}
        onCreateElement={handleCreateSmartElement}
      />
    </div>
  );
};

export default CanvasBoardContents;