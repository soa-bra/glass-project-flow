import React, { useState, useRef, useCallback } from 'react';
import { MainToolbar } from './components/MainToolbar';
import { CanvasLayerSystem } from './components/CanvasLayerSystem';
import { FloatingToolsPanel } from './components/FloatingToolsPanel';
import { Inspector } from './components/Inspector';
import { AIPanel } from './components/AIPanel';
import { CollaborationIndicators } from './components/CollaborationIndicators';
import { ExportPanel } from './components/ExportPanel';

interface CollaborativePlanningCanvasProps {
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
}

export const CollaborativePlanningCanvas: React.FC<CollaborativePlanningCanvasProps> = ({
  selectedCategory
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<CanvasElement | null>(null);
  const [activeUsers, setActiveUsers] = useState<User[]>([
    { id: '1', name: 'أحمد محمد', avatar: '/api/placeholder/32/32', color: '#3B82F6' },
    { id: '2', name: 'فاطمة علي', avatar: '/api/placeholder/32/32', color: '#10B981' },
    { id: '3', name: 'محمد سالم', avatar: '/api/placeholder/32/32', color: '#F59E0B' }
  ]);
  const [currentTool, setCurrentTool] = useState<string>('select');
  const [showFloatingTools, setShowFloatingTools] = useState(true);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showInspector, setShowInspector] = useState(false);
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [canvasLayers, setCanvasLayers] = useState([
    { id: 'background', name: 'الخلفية', visible: true, locked: false },
    { id: 'main', name: 'الطبقة الرئيسية', visible: true, locked: false },
    { id: 'annotations', name: 'التعليقات', visible: true, locked: false }
  ]);

  const handleToolSelect = useCallback((tool: string) => {
    setCurrentTool(tool);
  }, []);

  const handleElementSelect = useCallback((element: CanvasElement) => {
    setSelectedElement(element);
    setShowInspector(true);
  }, []);

  const handleCanvasClick = useCallback((event: React.MouseEvent) => {
    if (canvasRef.current && currentTool !== 'select') {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const newElement: CanvasElement = {
        id: `element-${Date.now()}`,
        type: currentTool as any,
        position: { x, y },
        size: { width: 120, height: 80 },
        content: currentTool === 'sticky-note' ? 'ملاحظة جديدة' : 'عنصر جديد',
        color: '#FEF3C7',
        layer: 1,
        userId: 'current-user'
      };

      setElements(prev => [...prev, newElement]);
      setCurrentTool('select');
    }
  }, [currentTool]);

  const toggleAIPanel = () => setShowAIPanel(prev => !prev);
  const toggleFloatingTools = () => setShowFloatingTools(prev => !prev);

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

      {/* Collaboration Indicators */}
      <CollaborationIndicators activeUsers={activeUsers} />

      {/* Canvas Layer System */}
      <div 
        ref={canvasRef}
        className="absolute inset-0 top-16 cursor-crosshair"
        onClick={handleCanvasClick}
      >
        <CanvasLayerSystem
          elements={elements}
          layers={canvasLayers}
          selectedElement={selectedElement}
          onElementSelect={handleElementSelect}
          currentTool={currentTool}
        />
      </div>

      {/* Floating Tools Panel */}
      {showFloatingTools && (
        <FloatingToolsPanel
          onClose={toggleFloatingTools}
          currentTool={currentTool}
          onToolSelect={handleToolSelect}
        />
      )}

      {/* Inspector Panel */}
      {showInspector && selectedElement && (
        <Inspector
          element={selectedElement}
          onClose={() => setShowInspector(false)}
          onChange={(updated) => {
            setElements(prev => prev.map(el => 
              el.id === updated.id ? updated : el
            ));
            setSelectedElement(updated);
          }}
        />
      )}

      {/* AI Panel */}
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

      {/* Canvas Grid Background */}
      <div 
        className="absolute inset-0 top-16 pointer-events-none opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />
    </div>
  );
};