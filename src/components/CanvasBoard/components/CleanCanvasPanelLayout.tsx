import React from 'react';
import { CollabBar, Inspector, MainToolbar } from './';
import ToolPanelManager from './ToolPanelManager';
import NewTopToolbar from './NewTopToolbar';
import AIAssistantPanel from '../AIAssistantPanel';
import { CanvasElement } from '../types';

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  elements: string[];
}

interface CleanCanvasPanelLayoutProps {
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
  gridShape: string;
  layers: Layer[];
  selectedLayerId: string | null;
  elements: CanvasElement[];
  canvasPosition: { x: number; y: number };
  panSpeed: number;
  lineWidth: number;
  lineStyle: string;
  selectedPenMode: string;
  
  // Handlers
  setSelectedTool: (tool: string) => void;
  setZoom: (zoom: number) => void;
  setShowGrid: (show: boolean) => void;
  setSnapEnabled: (enabled: boolean) => void;
  handleSmartElementSelect: (elementId: string) => void;
  handleGridSizeChange: (size: number) => void;
  handleGridShapeChange: (shape: string) => void;
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
  onPositionChange: (position: { x: number; y: number }) => void;
  onFitToScreen: () => void;
  onResetView: () => void;
  onPanSpeedChange: (speed: number) => void;
  onLineWidthChange: (width: number) => void;
  onLineStyleChange: (style: string) => void;
  onPenModeSelect: (mode: string) => void;
  onFileUpload: (files: File[]) => void;
  onNew: () => void;
  onOpen: () => void;
  onSmartProjectGenerate: () => void;
}

export const CleanCanvasPanelLayout: React.FC<CleanCanvasPanelLayoutProps> = ({
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
    .filter(Boolean) as CanvasElement[];

  return (
    <>
      {/* البار العلوي الجديد */}
      <NewTopToolbar
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={onUndo}
        onRedo={onRedo}
        onSave={onSave}
        onNew={onNew}
        onOpen={onOpen}
        onCopy={handleCopy}
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
      
      <CollabBar />
      
      
      <Inspector 
        selectedElementId={selectedElementId}
        elements={elements}
        onUpdateElement={updateElement}
        onDeleteElement={deleteElement}
      />
      
      {/* مساعد الذكاء الاصطناعي */}
      <div className="fixed bottom-4 right-4 z-40 w-80">
        <AIAssistantPanel />
      </div>
      
      {/* مدير اللوحات حسب الأداة المحددة */}
      <div className="fixed bottom-24 left-6 z-40">
        <ToolPanelManager
          selectedTool={selectedTool}
          selectedElements={selectedElementsAsElements}
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
      </div>
      
      {/* البار السفلي الجديد */}
      <MainToolbar
        selectedTool={selectedTool}
        onToolSelect={setSelectedTool}
      />
    </>
  );
};