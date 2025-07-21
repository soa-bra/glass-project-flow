import React, { useRef, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Enhanced Components
import { TopFloatingPanel } from './TopFloatingPanel';
import { EnhancedCanvas } from './EnhancedCanvas';
import { MainToolbar } from './';

// Enhanced Hooks
import { useEnhancedCanvasState } from '../hooks/useEnhancedCanvasState';
import { useRefactoredCanvasInteraction } from '../hooks/useRefactoredCanvasInteraction';

// Enhanced Panels
import { SmartAssistantPanel, EnhancedLayersPanel, EnhancedCollaborationPanel, AppearancePanel } from './panels';

// Types
import type { Participant } from '../types/enhanced';

interface CollaborativePlanningWhiteboardProps {
  projectId?: string;
  userId?: string;
  theme?: 'light' | 'dark';
  className?: string;
}

export const CollaborativePlanningWhiteboard: React.FC<CollaborativePlanningWhiteboardProps> = ({
  projectId,
  userId,
  theme = 'light',
  className
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Enhanced state management
  const {
    // Basic state
    selectedTool,
    selectedElementIds,
    selectedLayerId,
    config,
    zoom,
    canvasPosition,
    viewport,
    elements,
    layers,
    showGrid,
    snapEnabled,
    showMiniMap,
    activePanels,
    panelPositions,
    participants,
    isCollaborating,
    widgets,
    
    // Actions
    addElement,
    updateElement,
    deleteElement,
    selectElements,
    selectTool,
    addLayer,
    updateLayer,
    selectLayer,
    setZoom,
    setCanvasPosition,
    toggleGrid,
    toggleSnap,
    toggleMiniMap,
    togglePanel,
    setPanelPosition,
    addParticipant,
    removeParticipant,
    updateParticipant,
    addWidget,
    updateWidget,
    deleteWidget
  } = useEnhancedCanvasState();

  // Enhanced interactions
  const {
    isSelecting,
    selectionBox,
    handleSelectionStart,
    handleSelectionMove,
    handleSelectionEnd,
    isDrawing,
    drawStart,
    drawEnd,
    handleSmartPenStart,
    handleSmartPenMove,
    handleSmartPenEnd,
    handleDragCreate,
    handleDragCreateMove,
    handleDragCreateEnd,
    handleTextClick,
    isDragging,
    isResizing,
    handleElementMouseDown,
    handleElementMouseMove,
    handleElementMouseUp
  } = useRefactoredCanvasInteraction(canvasRef);

  // Canvas event handlers
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    switch (selectedTool) {
      case 'select':
        handleSelectionStart(e, zoom, canvasPosition, snapEnabled);
        break;
      case 'smart-pen':
        handleSmartPenStart(e, zoom, canvasPosition, snapEnabled);
        break;
      case 'text':
        handleTextClick(e, zoom, canvasPosition, snapEnabled, addElement);
        break;
      case 'shape':
      case 'smart-element':
        handleDragCreate(e, selectedTool, zoom, canvasPosition, snapEnabled, addElement);
        break;
      default:
        break;
    }
  }, [selectedTool, zoom, canvasPosition, snapEnabled, handleSelectionStart, handleSmartPenStart, handleTextClick, handleDragCreate, addElement]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (isSelecting) {
      handleSelectionMove(e, zoom, canvasPosition, snapEnabled);
    } else if (isDrawing) {
      handleSmartPenMove(e, zoom, canvasPosition, snapEnabled);
    } else if (isDragging) {
      handleElementMouseMove(e, selectedElementIds, zoom, canvasPosition, updateElement, snapEnabled);
    } else {
      handleDragCreateMove(e, zoom, canvasPosition, snapEnabled);
    }
  }, [isSelecting, isDrawing, isDragging, selectedElementIds, zoom, canvasPosition, snapEnabled, handleSelectionMove, handleSmartPenMove, handleElementMouseMove, handleDragCreateMove, updateElement]);

  const handleCanvasMouseUp = useCallback(() => {
    if (isSelecting) {
      handleSelectionEnd(elements, selectElements, false);
    } else if (isDrawing) {
      handleSmartPenEnd(addElement);
    } else if (isDragging) {
      handleElementMouseUp();
    } else {
      handleDragCreateEnd(addElement);
    }
  }, [isSelecting, isDrawing, isDragging, elements, selectElements, handleSelectionEnd, handleSmartPenEnd, handleElementMouseUp, handleDragCreateEnd, addElement]);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    // Clear selection if clicking on empty canvas
    if (selectedTool === 'select' && e.target === e.currentTarget) {
      selectElements([]);
    }
  }, [selectedTool, selectElements]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    
    if (e.ctrlKey || e.metaKey) {
      // Zoom
      const delta = e.deltaY > 0 ? -10 : 10;
      const newZoom = Math.max(config.features.zoom.min, Math.min(config.features.zoom.max, zoom + delta));
      setZoom(newZoom);
    } else {
      // Pan
      const deltaX = e.deltaX;
      const deltaY = e.deltaY;
      setCanvasPosition({
        x: canvasPosition.x - deltaX,
        y: canvasPosition.y - deltaY
      });
    }
  }, [zoom, canvasPosition, config.features.zoom, setZoom, setCanvasPosition]);

  // Top panel handlers
  const handleInviteParticipant = useCallback(() => {
    // Mock participant for demonstration
    const newParticipant: Participant = {
      id: `participant_${Date.now()}`,
      name: `مستخدم ${participants.length + 1}`,
      role: 'editor',
      isOnline: true
    };
    addParticipant(newParticipant);
  }, [participants.length, addParticipant]);

  const handleExport = useCallback((format: 'pdf' | 'png' | 'svg') => {
    console.log(`Exporting as ${format}...`);
    // Export logic would go here
  }, []);

  const handleSave = useCallback(() => {
    console.log('Saving board...');
    // Save logic would go here
  }, []);

  const handleUpload = useCallback(() => {
    console.log('Opening upload dialog...');
    // Upload logic would go here
  }, []);

  const handleToggleTheme = useCallback(() => {
    console.log('Toggling theme...');
    // Theme toggle logic would go here
  }, []);

  return (
    <div className={cn("relative w-full h-screen overflow-hidden", className)} data-theme={theme}>
      {/* Top Floating Panel */}
      <TopFloatingPanel
        participants={participants}
        onInviteParticipant={handleInviteParticipant}
        onExport={handleExport}
        onSave={handleSave}
        onUpload={handleUpload}
        showGrid={showGrid}
        onToggleGrid={toggleGrid}
        snapEnabled={snapEnabled}
        onToggleSnap={toggleSnap}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        showMiniMap={showMiniMap}
        onToggleMiniMap={toggleMiniMap}
      />

      {/* Main Canvas */}
      <EnhancedCanvas
        config={config}
        elements={elements}
        selectedElementIds={selectedElementIds}
        selectedTool={selectedTool}
        zoom={zoom}
        canvasPosition={canvasPosition}
        showGrid={showGrid}
        snapEnabled={snapEnabled}
        showMiniMap={showMiniMap}
        isDrawing={isDrawing}
        drawStart={drawStart}
        drawEnd={drawEnd}
        selectionBox={selectionBox}
        onCanvasMouseDown={handleCanvasMouseDown}
        onCanvasMouseMove={handleCanvasMouseMove}
        onCanvasMouseUp={handleCanvasMouseUp}
        onCanvasClick={handleCanvasClick}
        onElementSelect={(id) => selectElements([id])}
        onUpdateElement={updateElement}
        onWheel={handleWheel}
      />

      {/* Bottom Toolbar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 pointer-events-auto">
        <MainToolbar
          selectedTool={selectedTool}
          onToolSelect={selectTool}
        />
      </div>

      {/* Side Panels */}
      {activePanels.includes('smart-assistant') && (
        <div className="fixed left-4 top-20 bottom-20 w-80 z-30 pointer-events-auto">
          <SmartAssistantPanel
            isVisible={true}
            onClose={() => togglePanel('smart-assistant')}
            elements={elements}
            onElementCreate={addElement}
            onElementUpdate={updateElement}
            onElementDelete={deleteElement}
            selectedElements={selectedElementIds.map(id => elements.find(el => el.id === id)).filter(Boolean)}
          />
        </div>
      )}

      {activePanels.includes('layers') && (
        <div className="fixed right-4 top-20 w-80 z-30 pointer-events-auto">
          <EnhancedLayersPanel
            layers={layers}
            selectedLayerId={selectedLayerId}
            onLayerSelect={selectLayer}
            onLayerCreate={(name) => addLayer(name)}
            onLayerUpdate={updateLayer}
            onLayerDelete={(layerId) => console.log('Delete layer:', layerId)}
            elements={elements}
            onElementUpdate={updateElement}
          />
        </div>
      )}

      {activePanels.includes('appearance') && (
        <div className="fixed right-4 bottom-20 w-80 z-30 pointer-events-auto">
          <AppearancePanel
            selectedElements={selectedElementIds.map(id => elements.find(el => el.id === id)).filter(Boolean)}
            onElementUpdate={updateElement}
            onClose={() => togglePanel('appearance')}
          />
        </div>
      )}

      {activePanels.includes('collaboration') && (
        <div className="fixed left-4 bottom-20 w-80 h-96 z-30 pointer-events-auto">
          <EnhancedCollaborationPanel
            participants={participants}
            onInviteParticipant={handleInviteParticipant}
            onParticipantRoleChange={(participantId, role) => updateParticipant(participantId, { role })}
            onParticipantRemove={removeParticipant}
            currentUserId={userId || 'current-user'}
            boardId={projectId || 'current-board'}
            isCollaborating={isCollaborating}
          />
        </div>
      )}

      {/* Quick Panel Toggle Buttons */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-30 flex flex-col gap-2 pointer-events-auto">
        <Card className="p-2">
          <button
            onClick={() => togglePanel('smart-assistant')}
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
              activePanels.includes('smart-assistant') ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
            )}
            title="المساعد الذكي"
          >
            🤖
          </button>
        </Card>
        <Card className="p-2">
          <button
            onClick={() => togglePanel('layers')}
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
              activePanels.includes('layers') ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
            )}
            title="الطبقات"
          >
            📋
          </button>
        </Card>
        <Card className="p-2">
          <button
            onClick={() => togglePanel('appearance')}
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
              activePanels.includes('appearance') ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
            )}
            title="المظهر"
          >
            🎨
          </button>
        </Card>
        <Card className="p-2">
          <button
            onClick={() => togglePanel('collaboration')}
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
              activePanels.includes('collaboration') ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
            )}
            title="التعاون"
          >
            👥
          </button>
        </Card>
      </div>

      {/* Development Info */}
      <div className="fixed top-2 right-2 z-20 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
        {config.renderEngine} • {elements.length} عنصر • {participants.length} مشارك
      </div>
    </div>
  );
};