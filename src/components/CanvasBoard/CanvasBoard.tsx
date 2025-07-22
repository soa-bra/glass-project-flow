
/**
 * @fileoverview Main Canvas Board Application - Complete collaborative editor
 * @author AI Assistant
 * @version 1.0.0
 */

import React from 'react';
import useCanvasState from '@/hooks/useCanvasState';
import SmartAssistantPanel from './panels/SmartAssistantPanel';
import { EnhancedLayersPanel, AppearancePanel } from './components/panels';
import EnhancedCollaborationPanel from './panels/EnhancedCollaborationPanel';
import TopToolbar from './toolbars/TopToolbar';
import { Canvas } from './components/Canvas/Canvas';
import { ToolPanel } from './components/ToolPanel';
import { useCanvasBoardUI } from './hooks/useCanvasBoardUI';
import { useSmartElements } from './hooks/useSmartElements';
import { mockParticipants, mockChatMessages } from './data/mockData';
import { PanelToggleControls } from './components/PanelToggleControls';
import { ToolSelector } from './components/ToolSelector';
import { transformLayersForEnhancedPanel } from './utils/layerUtils';
import { CanvasErrorBoundary } from './components/CanvasErrorBoundary';

/**
 * Main Canvas Board Component with Error Boundary
 * Integrates all panels and provides the complete collaborative editing experience
 */
const CanvasBoard: React.FC = () => {
  return (
    <CanvasErrorBoundary>
      <CanvasBoardContent />
    </CanvasErrorBoundary>
  );
};

/**
 * Internal Canvas Board Content Component
 */
const CanvasBoardContent: React.FC = () => {
  const {
    elements,
    layers,
    selectedElementIds,
    selectedLayerId,
    addElement,
    updateElement,
    deleteElement,
    selectElements,
    addLayer,
    updateLayer,
    deleteLayer,
    selectLayer,
    setActiveTool,
    setZoom,
    setPan,
    toggleGrid,
    toggleSnap,
    undo,
    redo,
    saveCanvas,
    loadCanvas,
    exportCanvas,
    zoom,
    gridVisible,
    snapToGrid,
    participants,
    chatMessages,
    addChatMessage,
    addParticipant,
    activeTool
  } = useCanvasState();

  const {
    showPanels,
    selectedTool,
    selectedSmartElement,
    canvasPosition,
    setSelectedTool,
    setSelectedSmartElement,
    setCanvasPosition,
    togglePanel,
    handleSendMessage,
    handleInviteParticipant
  } = useCanvasBoardUI();

  const { handleAddSmartElement } = useSmartElements(addElement, selectedLayerId, layers);

  const selectedElement = selectedElementIds.length === 1 
    ? elements.find(el => el.id === selectedElementIds[0]) 
    : null;

  // Transform layers for enhanced panel
  const enhancedLayers = transformLayersForEnhancedPanel(layers);

  return (
    <div className="h-screen w-full bg-gray-50 overflow-hidden">
      {/* Top Toolbar */}
      <TopToolbar
        onUndo={undo}
        onRedo={redo}
        onSave={saveCanvas}
        onOpen={() => loadCanvas({})}
        onNew={() => loadCanvas({ elements: [], layers: [] })}
        onDuplicate={() => {}}
        onToggleGrid={toggleGrid}
        onToggleSnap={toggleSnap}
        onGenerateProject={() => {}}
        canUndo={true}
        canRedo={true}
        gridVisible={gridVisible}
        snapEnabled={snapToGrid}
      />
      
      <div className="flex h-[calc(100vh-60px)]">
        {/* Left Panels */}
        <div className="w-80 flex flex-col gap-2 p-2 border-r bg-white">
          {/* Smart Assistant Panel */}
          {showPanels.smartAssistant && (
            <div className="h-1/3">
              <SmartAssistantPanel
                onAddSmartElement={handleAddSmartElement}
                elements={elements}
              />
            </div>
          )}
          
          {/* Tool Panel */}
          {showPanels.tools && (
            <div className="h-1/3">
              <ToolPanel
                selectedTool={selectedTool}
                selectedElements={elements.filter(el => selectedElementIds.includes(el.id))}
                elements={elements}
                selectedElementId={selectedElementIds[0] || null}
                zoom={zoom}
                canvasPosition={canvasPosition}
                panSpeed={1}
                lineWidth={2}
                lineStyle="solid"
                selectedPenMode="pen"
                showGrid={gridVisible}
                snapEnabled={snapToGrid}
                gridSize={20}
                gridShape="dots"
                layers={layers}
                selectedLayerId={selectedLayerId}
                onUpdateElement={updateElement}
                onCopy={() => {}}
                onCut={() => {}}
                onPaste={() => {}}
                onDelete={() => selectedElementIds.forEach(deleteElement)}
                onGroup={() => {}}
                onUngroup={() => {}}
                onLock={() => {}}
                onUnlock={() => {}}
                onRotate={() => {}}
                onFlipHorizontal={() => {}}
                onFlipVertical={() => {}}
                onAlign={() => {}}
                onZoomChange={setZoom}
                onPositionChange={setCanvasPosition}
                onFitToScreen={() => {}}
                onResetView={() => setCanvasPosition({ x: 0, y: 0 })}
                onPanSpeedChange={() => {}}
                onLineWidthChange={() => {}}
                onLineStyleChange={() => {}}
                onPenModeSelect={() => {}}
                onFileUpload={() => {}}
                onLayerReorder={() => {}}
                onLayerSelect={selectLayer}
                onGridToggle={toggleGrid}
                onSnapToggle={toggleSnap}
                onGridSizeChange={() => {}}
                onGridShapeChange={() => {}}
                onAlignToGrid={() => {}}
              />
            </div>
          )}
          
          {/* Collaboration Panel */}
          {showPanels.collaboration && (
            <div className="h-1/3">
              <EnhancedCollaborationPanel
                participants={mockParticipants}
                chatMessages={mockChatMessages}
                onSendMessage={(message) => handleSendMessage(message, addChatMessage)}
                onInviteParticipant={handleInviteParticipant}
              />
            </div>
          )}
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 bg-white relative">
          <Canvas
            selectedTool={selectedTool}
            selectedSmartElement={selectedSmartElement}
            zoom={zoom}
            canvasPosition={canvasPosition}
            showGrid={gridVisible}
            snapEnabled={snapToGrid}
            onElementsChange={(newElements) => {
              // Handle elements change if needed
            }}
            onSelectionChange={selectElements}
          />

          {/* Tool Selection */}
          <ToolSelector
            selectedTool={selectedTool}
            onToolSelect={setSelectedTool}
          />
        </div>

        {/* Right Panels */}
        <div className="w-80 flex flex-col gap-2 p-2 border-l bg-white">
          {/* Layers Panel */}
          {showPanels.layers && (
            <div className="h-1/2">
              <EnhancedLayersPanel
                layers={enhancedLayers}
                selectedLayerId={selectedLayerId}
                onLayerUpdate={() => {}}
                onLayerSelect={selectLayer}
                elements={elements}
              />
            </div>
          )}
          
          {/* Appearance Panel */}
          {showPanels.appearance && (
            <div className="h-1/2">
              <AppearancePanel
                selectedElement={selectedElement}
                onUpdateElement={updateElement}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Panel Toggle Controls */}
      <PanelToggleControls onTogglePanel={togglePanel} />
    </div>
  );
};

export default CanvasBoard;
