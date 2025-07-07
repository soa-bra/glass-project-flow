import React from 'react';
import { TopActionBar, CollabBar, ToolPropsBar, Inspector, MainToolbar } from './';
import AIAssistantPanel from '../AIAssistantPanel';
import { HistoryPanel } from '../sidepanels/HistoryPanel';
import { PropertiesPanel } from '../sidepanels/PropertiesPanel';
import { TemplatePanel } from '../export/TemplatePanel';
import { CanvasElement } from '../types';

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  elements: string[];
}

interface CanvasPanelLayoutProps {
  // History props
  historyIndex: number;
  history: any[];
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onExport: () => void;
  onSettings: () => void;
  
  // Tool props
  selectedTool: string;
  selectedElementId: string | null;
  selectedElements: string[];
  zoom: number;
  selectedSmartElement: string;
  showGrid: boolean;
  snapEnabled: boolean;
  gridSize: number;
  layers: Layer[];
  selectedLayerId: string | null;
  elements: CanvasElement[];
  
  // Handlers
  setSelectedTool: (tool: string) => void;
  setZoom: (zoom: number) => void;
  setShowGrid: (show: boolean) => void;
  setSnapEnabled: (enabled: boolean) => void;
  handleSmartElementSelect: (elementId: string) => void;
  handleGridSizeChange: (size: number) => void;
  handleAlignToGrid: () => void;
  handleLayerUpdate: (layers: Layer[]) => void;
  handleLayerSelect: (layerId: string) => void;
  handleCopy: () => void;
  handleCut: () => void;
  handlePaste: () => void;
  handleDeleteSelected: () => void;
  handleGroup: () => void;
  handleUngroup: () => void;
  handleLock: () => void;
  handleUnlock: () => void;
  updateElement: (elementId: string, updates: any) => void;
  deleteElement: (elementId: string) => void;
}

export const CanvasPanelLayout: React.FC<CanvasPanelLayoutProps> = ({
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
  layers,
  selectedLayerId,
  elements,
  setSelectedTool,
  setZoom,
  setShowGrid,
  setSnapEnabled,
  handleSmartElementSelect,
  handleGridSizeChange,
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
  deleteElement
}) => {
  return (
    <>
      <TopActionBar 
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={onUndo}
        onRedo={onRedo}
        onSave={onSave}
        onExport={onExport}
        onSettings={onSettings}
      />
      
      <CollabBar />
      
      <ToolPropsBar
        selectedTool={selectedTool}
        selectedElementId={selectedElementId}
        selectedElements={selectedElements}
        zoom={zoom}
        selectedSmartElement={selectedSmartElement}
        showGrid={showGrid}
        snapEnabled={snapEnabled}
        gridSize={gridSize}
        layers={layers}
        selectedLayerId={selectedLayerId}
        onZoomChange={setZoom}
        onSmartElementSelect={handleSmartElementSelect}
        onGridToggle={() => setShowGrid(!showGrid)}
        onSnapToggle={() => setSnapEnabled(!snapEnabled)}
        onGridSizeChange={handleGridSizeChange}
        onAlignToGrid={handleAlignToGrid}
        onLayerUpdate={handleLayerUpdate}
        onLayerSelect={handleLayerSelect}
        onCopy={handleCopy}
        onCut={handleCut}
        onPaste={handlePaste}
        onDelete={handleDeleteSelected}
        onGroup={handleGroup}
        onUngroup={handleUngroup}
        onLock={handleLock}
        onUnlock={handleUnlock}
      />
      
      <Inspector 
        selectedElementId={selectedElementId}
        elements={elements}
        onUpdateElement={updateElement}
        onDeleteElement={deleteElement}
      />
      
      {/* Side Panels */}
      <div className="fixed top-24 right-4 z-40 space-y-4">
        <HistoryPanel
          history={[]}
          currentIndex={historyIndex}
          onUndo={onUndo}
          onRedo={onRedo}
          onRevertTo={(index) => console.log('الرجوع للفهرس:', index)}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
        />
        <PropertiesPanel
          selectedElementId={selectedElementId}
          element={selectedElementId ? elements.find(el => el.id === selectedElementId) : null}
          onUpdate={updateElement}
        />
        <TemplatePanel
          currentElements={elements}
          onLoadTemplate={(template) => console.log('تحميل القالب:', template)}
          onSaveAsTemplate={(name, description) => console.log('حفظ كقالب:', name, description)}
        />
      </div>
      
      <div className="fixed top-4 right-4 z-40 w-80">
        <AIAssistantPanel />
      </div>
      
      <MainToolbar
        selectedTool={selectedTool}
        onToolSelect={setSelectedTool}
      />
    </>
  );
};