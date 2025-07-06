import React, { useState, useRef, useCallback } from 'react';
import { MainToolbar } from './MainToolbar';
import { CanvasLayerSystem } from './CanvasLayerSystem';
import { FloatingToolsPanel } from './FloatingToolsPanel';
import { Inspector } from './Inspector';
import { AIPanel } from './AIPanel';
import { CollaborationIndicators } from './CollaborationIndicators';
import { ExportPanel } from './ExportPanel';
import { CollabBar } from './CollabBar';
import { ToolPropsBar } from './ToolPropsBar';
import { CommandConsole } from './CommandConsole';
import { MindMapPanel } from './MindMapPanel';
import { TimelinePanel } from './TimelinePanel';
import { BottomCenterToolbar } from './BottomCenterToolbar';

interface CanvasBoardContentsProps {
  selectedCategory?: string | null;
}

interface CanvasElement {
  id: string;
  type: 'sticky-note' | 'shape' | 'text' | 'connection' | 'mindmap-node' | 'smart-element' | 'root-connector';
  position: { x: number; y: number };
  size: { width: number; height: number };
  content: string;
  color: string;
  locked?: boolean;
  userId?: string;
  layer: number;
  rotation?: number;
  groupId?: string;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  cursor?: { x: number; y: number };
  color: string;
  role: 'project_manager' | 'team_member' | 'guest';
}

export const CanvasBoardContents: React.FC<CanvasBoardContentsProps> = ({
  selectedCategory
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElements, setSelectedElements] = useState<CanvasElement[]>([]);
  const [activeUsers, setActiveUsers] = useState<User[]>([
    { id: '1', name: 'أحمد محمد', avatar: '/api/placeholder/32/32', color: '#3B82F6', role: 'project_manager' },
    { id: '2', name: 'فاطمة علي', avatar: '/api/placeholder/32/32', color: '#10B981', role: 'team_member' },
    { id: '3', name: 'محمد سالم', avatar: '/api/placeholder/32/32', color: '#F59E0B', role: 'guest' }
  ]);
  
  // Tool states
  const [currentTool, setCurrentTool] = useState<string>('select');
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [canvasMode, setCanvasMode] = useState<'select' | 'pan'>('select');
  
  // Panel states
  const [showFloatingTools, setShowFloatingTools] = useState(true);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showInspector, setShowInspector] = useState(false);
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [showCollabBar, setShowCollabBar] = useState(true);
  const [showToolPropsBar, setShowToolPropsBar] = useState(true);
  const [showCommandConsole, setShowCommandConsole] = useState(false);
  const [showMindMapPanel, setShowMindMapPanel] = useState(false);
  const [showTimelinePanel, setShowTimelinePanel] = useState(false);
  
  // Canvas layers
  const [canvasLayers, setCanvasLayers] = useState([
    { id: 'background', name: 'الخلفية', visible: true, locked: false },
    { id: 'main', name: 'الطبقة الرئيسية', visible: true, locked: false },
    { id: 'annotations', name: 'التعليقات', visible: true, locked: false }
  ]);

  // Tool handlers
  const handleToolSelect = useCallback((tool: string) => {
    setCurrentTool(tool);
    if (tool === 'pan') {
      setCanvasMode('pan');
    } else {
      setCanvasMode('select');
    }
  }, []);

  const handleElementSelect = useCallback((element: CanvasElement) => {
    setSelectedElements([element]);
    setShowInspector(true);
  }, []);

  const handleMultiSelect = useCallback((elements: CanvasElement[]) => {
    setSelectedElements(elements);
    setShowInspector(elements.length > 0);
  }, []);

  const handleCanvasClick = useCallback((event: React.MouseEvent) => {
    if (canvasRef.current && currentTool !== 'select' && currentTool !== 'pan') {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Snap to grid if enabled
      const snapX = snapToGrid ? Math.round(x / 20) * 20 : x;
      const snapY = snapToGrid ? Math.round(y / 20) * 20 : y;

      const newElement: CanvasElement = {
        id: `element-${Date.now()}`,
        type: currentTool as any,
        position: { x: snapX, y: snapY },
        size: getDefaultSize(currentTool),
        content: getDefaultContent(currentTool),
        color: getDefaultColor(currentTool),
        layer: 1,
        userId: 'current-user',
        rotation: 0
      };

      setElements(prev => [...prev, newElement]);
      setCurrentTool('select');
    } else if (currentTool === 'select') {
      // Clear selection when clicking on empty canvas
      setSelectedElements([]);
      setShowInspector(false);
    }
  }, [currentTool, snapToGrid]);

  const getDefaultSize = (tool: string) => {
    switch (tool) {
      case 'sticky-note': return { width: 120, height: 80 };
      case 'text': return { width: 200, height: 40 };
      case 'shape': return { width: 80, height: 80 };
      case 'smart-element': return { width: 150, height: 100 };
      case 'root-connector': return { width: 200, height: 60 };
      default: return { width: 120, height: 80 };
    }
  };

  const getDefaultContent = (tool: string) => {
    switch (tool) {
      case 'sticky-note': return 'ملاحظة جديدة';
      case 'text': return 'نص جديد';
      case 'shape': return '';
      case 'smart-element': return 'عنصر ذكي';
      case 'root-connector': return 'موصل رئيسي';
      default: return 'عنصر جديد';
    }
  };

  const getDefaultColor = (tool: string) => {
    switch (tool) {
      case 'sticky-note': return '#FEF3C7';
      case 'text': return 'transparent';
      case 'shape': return '#E0E7FF';
      case 'smart-element': return '#F3E8FF';
      case 'root-connector': return '#DCFCE7';
      default: return '#F3F4F6';
    }
  };

  // Panel toggles
  const toggleAIPanel = () => setShowAIPanel(prev => !prev);
  const toggleFloatingTools = () => setShowFloatingTools(prev => !prev);
  const toggleCommandConsole = () => setShowCommandConsole(prev => !prev);
  const toggleMindMapPanel = () => setShowMindMapPanel(prev => !prev);
  const toggleTimelinePanel = () => setShowTimelinePanel(prev => !prev);

  // Canvas utilities
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 25));
  const handleToggleGrid = () => setShowGrid(prev => !prev);
  const handleToggleSnap = () => setSnapToGrid(prev => !prev);

  // Element operations
  const handleGroupElements = () => {
    if (selectedElements.length > 1) {
      const groupId = `group-${Date.now()}`;
      const updatedElements = elements.map(el => 
        selectedElements.find(sel => sel.id === el.id) 
          ? { ...el, groupId }
          : el
      );
      setElements(updatedElements);
    }
  };

  const handleUngroupElements = () => {
    if (selectedElements.length > 0) {
      const updatedElements = elements.map(el => 
        selectedElements.find(sel => sel.id === el.id) 
          ? { ...el, groupId: undefined }
          : el
      );
      setElements(updatedElements);
    }
  };

  const handleDuplicateElements = () => {
    const duplicates = selectedElements.map(el => ({
      ...el,
      id: `element-${Date.now()}-${Math.random()}`,
      position: { x: el.position.x + 20, y: el.position.y + 20 }
    }));
    setElements(prev => [...prev, ...duplicates]);
  };

  const handleDeleteElements = () => {
    const selectedIds = selectedElements.map(el => el.id);
    setElements(prev => prev.filter(el => !selectedIds.includes(el.id)));
    setSelectedElements([]);
    setShowInspector(false);
  };

  return (
    <div className="h-full w-full relative overflow-hidden" style={{ 
      background: 'var(--backgrounds-project-mgmt-board-bg)' 
    }}>
      {/* Main Toolbar */}
      <MainToolbar
        currentTool={currentTool}
        onToolSelect={handleToolSelect}
        onToggleFloatingTools={toggleFloatingTools}
        onToggleAI={toggleAIPanel}
        onExport={() => setShowExportPanel(true)}
      />

      {/* Collaboration Bar - Top Left */}
      {showCollabBar && (
        <CollabBar 
          activeUsers={activeUsers}
          onClose={() => setShowCollabBar(false)}
        />
      )}

      {/* Collaboration Indicators */}
      <CollaborationIndicators activeUsers={activeUsers} />

      {/* Main Canvas Area */}
      <div 
        ref={canvasRef}
        className={`absolute inset-0 top-16 ${canvasMode === 'pan' ? 'cursor-grab' : 'cursor-crosshair'}`}
        onClick={handleCanvasClick}
        style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
      >
        <CanvasLayerSystem
          elements={elements}
          layers={canvasLayers}
          selectedElement={selectedElements[0] || null}
          onElementSelect={handleElementSelect}
          currentTool={currentTool}
        />

        {/* Canvas Grid Background */}
        {showGrid && (
          <div 
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />
        )}
      </div>

      {/* Bottom Center Toolbar */}
      <BottomCenterToolbar
        currentTool={currentTool}
        onToolSelect={handleToolSelect}
        showGrid={showGrid}
        snapToGrid={snapToGrid}
        zoomLevel={zoomLevel}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onToggleGrid={handleToggleGrid}
        onToggleSnap={handleToggleSnap}
        onExport={() => setShowExportPanel(true)}
        selectedElements={selectedElements}
        onGroup={handleGroupElements}
        onUngroup={handleUngroupElements}
        onDuplicate={handleDuplicateElements}
        onDelete={handleDeleteElements}
      />

      {/* Floating Panels */}
      
      {/* Tool Properties Bar - Bottom Left */}
      {showToolPropsBar && (
        <ToolPropsBar 
          currentTool={currentTool}
          selectedElements={selectedElements}
          onClose={() => setShowToolPropsBar(false)}
        />
      )}

      {/* Command Console - Bottom Left */}
      {showCommandConsole && (
        <CommandConsole 
          onClose={toggleCommandConsole}
          canvasElements={elements}
          onElementsUpdate={setElements}
        />
      )}

      {/* Mind Map Panel - Bottom Left */}
      {showMindMapPanel && (
        <MindMapPanel 
          onClose={toggleMindMapPanel}
          elements={elements}
          onElementsUpdate={setElements}
        />
      )}

      {/* Timeline Panel - Bottom Left */}
      {showTimelinePanel && (
        <TimelinePanel 
          onClose={toggleTimelinePanel}
          elements={elements}
          onElementsUpdate={setElements}
        />
      )}

      {/* Floating Tools Panel */}
      {showFloatingTools && (
        <FloatingToolsPanel
          onClose={toggleFloatingTools}
          currentTool={currentTool}
          onToolSelect={handleToolSelect}
        />
      )}

      {/* Inspector Panel - Top Right */}
      {showInspector && selectedElements.length > 0 && (
        <Inspector
          element={selectedElements[0]}
          onClose={() => setShowInspector(false)}
          onChange={(updated) => {
            setElements(prev => prev.map(el => 
              el.id === updated.id ? updated : el
            ));
            setSelectedElements([updated]);
          }}
        />
      )}

      {/* AI Panel - Bottom Right */}
      {showAIPanel && (
        <AIPanel
          onClose={() => setShowAIPanel(false)}
          canvasElements={elements}
          selectedCategory={selectedCategory}
        />
      )}

      {/* Export Panel */}
      {showExportPanel && (
        <ExportPanel
          elements={elements}
          onClose={() => setShowExportPanel(false)}
        />
      )}

      {/* Quick Access Floating Button */}
      <div className="fixed bottom-6 left-6 flex flex-col space-y-2 z-50">
        <button
          onClick={toggleCommandConsole}
          className={`w-12 h-12 rounded-full glass-section flex items-center justify-center transition-all ${
            showCommandConsole ? 'bg-blue-500 text-white' : 'hover:bg-white/30'
          }`}
          title="وحدة التحكم بالأوامر"
        >
          <span className="text-sm font-bold">AI</span>
        </button>
        
        <button
          onClick={toggleMindMapPanel}
          className={`w-12 h-12 rounded-full glass-section flex items-center justify-center transition-all ${
            showMindMapPanel ? 'bg-purple-500 text-white' : 'hover:bg-white/30'
          }`}
          title="لوحة الخريطة الذهنية"
        >
          <span className="text-xs">🧠</span>
        </button>
        
        <button
          onClick={toggleTimelinePanel}
          className={`w-12 h-12 rounded-full glass-section flex items-center justify-center transition-all ${
            showTimelinePanel ? 'bg-green-500 text-white' : 'hover:bg-white/30'
          }`}
          title="لوحة الجدول الزمني"
        >
          <span className="text-xs">📅</span>
        </button>
      </div>
    </div>
  );
};