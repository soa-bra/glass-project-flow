
/**
 * @fileoverview Main Canvas Board Application - Complete collaborative editor
 * @author AI Assistant
 * @version 1.0.0
 */

import React, { useState } from 'react';
import useCanvasState from '@/hooks/useCanvasState';
import SmartAssistantPanel from './panels/SmartAssistantPanel';
import { EnhancedLayersPanel, AppearancePanel } from './components/panels';
import EnhancedCollaborationPanel from './panels/EnhancedCollaborationPanel';
import TopToolbar from './toolbars/TopToolbar';
import { Canvas } from './components/Canvas/Canvas';
import { ToolPanel } from './components/ToolPanel';
import { ChatMessage, Participant, CanvasElement } from '@/types/canvas';

/**
 * Main Canvas Board Component
 * Integrates all panels and provides the complete collaborative editing experience
 */
const CanvasBoard: React.FC = () => {
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

  const [showPanels, setShowPanels] = useState({
    smartAssistant: true,
    layers: true,
    appearance: true,
    collaboration: true,
    tools: true
  });

  const [selectedSmartElement, setSelectedSmartElement] = useState('');
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });

  // Mock data for collaboration
  const mockParticipants: Participant[] = [
    {
      id: '1',
      name: 'أحمد محمد',
      role: 'host',
      isOnline: true,
      isSpeaking: false
    },
    {
      id: '2', 
      name: 'سارة أحمد',
      role: 'user',
      isOnline: true,
      isSpeaking: true
    },
    {
      id: '3',
      name: 'محمد علي',
      role: 'guest',
      isOnline: false,
      isSpeaking: false
    }
  ];

  const mockChatMessages: ChatMessage[] = [
    {
      id: '1',
      userId: '1',
      userName: 'أحمد محمد',
      message: 'مرحباً بالجميع! هيا نبدأ العمل على المشروع',
      timestamp: new Date(Date.now() - 300000),
      type: 'text'
    },
    {
      id: '2',
      userId: '2',
      userName: 'سارة أحمد',
      message: 'ممتاز! لدي بعض الأفكار للتصميم',
      timestamp: new Date(Date.now() - 120000),
      type: 'text'
    }
  ];

  const handleSendMessage = (message: string) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      userId: 'current-user',
      userName: 'المستخدم الحالي',
      message,
      timestamp: new Date(),
      type: 'text'
    };
    addChatMessage(newMessage);
  };

  const handleInviteParticipant = () => {
    // Implement participant invitation logic
  };

  const handleAddSmartElement = (type: string, config: any) => {
    const newElement = {
      id: `element-${Date.now()}`,
      type: 'smart-element' as const,
      position: { x: 100, y: 100 },
      size: { width: 400, height: 300 },
      rotation: 0,
      layerId: selectedLayerId || layers[0]?.id || 'default',
      style: {
        fillColor: '#f0f0f0',
        borderColor: '#000000',
        borderWidth: 1,
        borderStyle: 'solid' as const,
        opacity: 1
      },
      locked: false,
      visible: true,
      data: config
    };
    
    addElement(newElement);
  };

  const selectedElement = selectedElementIds.length === 1 
    ? elements.find(el => el.id === selectedElementIds[0]) 
    : null;

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
                selectedTool={activeTool}
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
                onSendMessage={handleSendMessage}
                onInviteParticipant={handleInviteParticipant}
              />
            </div>
          )}
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 bg-white relative">
          <Canvas
            selectedTool={activeTool}
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
          <div className="absolute top-4 left-4 flex gap-2 bg-white rounded-lg shadow-md p-2">
            {['select', 'text', 'shape', 'sticky', 'smart-element', 'hand', 'zoom', 'smart-pen', 'upload'].map(tool => (
              <button
                key={tool}
                onClick={() => setActiveTool(tool)}
                className={`px-3 py-2 rounded ${activeTool === tool ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
              >
                {tool}
              </button>
            ))}
          </div>
        </div>

        {/* Right Panels */}
        <div className="w-80 flex flex-col gap-2 p-2 border-l bg-white">
          {/* Layers Panel */}
          {showPanels.layers && (
            <div className="h-1/2">
              <EnhancedLayersPanel
                layers={layers.map(layer => ({ ...layer, type: 'layer' as const, parentId: null, children: [], isOpen: true, color: '#3b82f6', depth: 0 }))}
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
      <div className="fixed bottom-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => setShowPanels(prev => ({ ...prev, smartAssistant: !prev.smartAssistant }))}
          className="p-2 bg-primary text-white rounded shadow"
          title="تبديل المساعد الذكي"
        >
          🤖
        </button>
        <button
          onClick={() => setShowPanels(prev => ({ ...prev, tools: !prev.tools }))}
          className="p-2 bg-primary text-white rounded shadow"
          title="تبديل الأدوات"
        >
          🔧
        </button>
        <button
          onClick={() => setShowPanels(prev => ({ ...prev, collaboration: !prev.collaboration }))}
          className="p-2 bg-primary text-white rounded shadow"
          title="تبديل التعاون"
        >
          👥
        </button>
        <button
          onClick={() => setShowPanels(prev => ({ ...prev, layers: !prev.layers }))}
          className="p-2 bg-primary text-white rounded shadow"
          title="تبديل الطبقات"
        >
          📋
        </button>
        <button
          onClick={() => setShowPanels(prev => ({ ...prev, appearance: !prev.appearance }))}
          className="p-2 bg-primary text-white rounded shadow"
          title="تبديل المظهر"
        >
          🎨
        </button>
      </div>
    </div>
  );
};

export default CanvasBoard;
