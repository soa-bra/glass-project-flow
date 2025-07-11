
import React, { useState, useCallback, useEffect } from 'react';
import { useEnhancedCanvasState } from '../hooks/useEnhancedCanvasState';
import { EnhancedKeyboardShortcuts } from './EnhancedKeyboardShortcuts';
import PerformanceOptimizedCanvas from './PerformanceOptimizedCanvas';
import { CanvasBottomSection } from './CanvasBottomSection';
import { SmartStatusIndicator } from './SmartStatusIndicator';
import { FloatingPanelControls } from './FloatingPanelControls';
import { FloatingPanels } from './FloatingPanels';
import { CanvasTopSection } from './CanvasTopSection';
import ToolPanelManager from './ToolPanelManager';
import { CanvasElement } from '../types/index';
import { toast } from 'sonner';

interface EnhancedCanvasBoardProps {
  projectId?: string;
  userId?: string;
}

export const EnhancedCanvasBoard: React.FC<EnhancedCanvasBoardProps> = ({
  projectId = 'default',
  userId = 'user1'
}) => {
  // Enhanced canvas state
  const canvasState = useEnhancedCanvasState(projectId, userId);
  
  // Panel states
  const [showSmartAssistant, setShowSmartAssistant] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const [showAppearance, setShowAppearance] = useState(false);
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [showTools, setShowTools] = useState(false);
  
  // Performance and status states
  const [recentTools, setRecentTools] = useState<string[]>(['select']);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [performanceScore, setPerformanceScore] = useState(95);
  const [aiSuggestions, setAiSuggestions] = useState(3);

  const handleTogglePanel = useCallback((panel: string) => {
    switch (panel) {
      case 'smartAssistant':
        setShowSmartAssistant(prev => !prev);
        break;
      case 'layers':
        setShowLayers(prev => !prev);
        break;
      case 'appearance':
        setShowAppearance(prev => !prev);
        break;
      case 'collaboration':
        setShowCollaboration(prev => !prev);
        break;
      case 'tools':
        setShowTools(prev => !prev);
        break;
    }
  }, []);

  const handleToolSelect = useCallback((tool: string) => {
    canvasState.setSelectedTool(tool);
    
    // Update recent tools
    setRecentTools(prev => {
      const filtered = prev.filter(t => t !== tool);
      return [tool, ...filtered].slice(0, 5);
    });
    
    setHasUnsavedChanges(true);
  }, [canvasState]);

  const handleSave = useCallback(() => {
    canvasState.saveCanvas();
    setLastSaved(new Date());
    setHasUnsavedChanges(false);
    toast.success('تم حفظ المشروع بنجاح', {
      icon: '💾',
      duration: 2000,
      className: 'animate-scale-in'
    });
  }, [canvasState]);

  const handleElementsChange = useCallback((elements: CanvasElement[]) => {
    setHasUnsavedChanges(true);
    // Update performance score based on element count
    const score = Math.max(60, 100 - Math.floor(elements.length / 10));
    setPerformanceScore(score);
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges) {
      const autoSaveTimer = setTimeout(() => {
        handleSave();
        toast.info('تم الحفظ التلقائي', {
          icon: '⚡',
          duration: 1500,
          className: 'animate-fade-in'
        });
      }, 30000); // Auto-save after 30 seconds

      return () => clearTimeout(autoSaveTimer);
    }
  }, [hasUnsavedChanges, handleSave]);

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-background via-background to-muted/20 overflow-hidden">
      {/* Enhanced Keyboard Shortcuts */}
      <EnhancedKeyboardShortcuts
        onUndo={canvasState.undo}
        onRedo={canvasState.redo}
        onSave={handleSave}
        onCopy={canvasState.handleCopy}
        onPaste={() => {}} // Implement paste functionality
        onDelete={() => {
          if (canvasState.selectedElementId) {
            canvasState.deleteElement(canvasState.selectedElementId);
            setHasUnsavedChanges(true);
          }
        }}
        onSelectAll={() => {}} // Implement select all
        onZoomIn={() => {}} // Implement zoom in
        onZoomOut={() => {}} // Implement zoom out
        onZoomReset={() => {}} // Implement zoom reset
        onToolSelect={handleToolSelect}
        onToggleGrid={() => canvasState.setShowGrid(!canvasState.showGrid)}
        onToggleSnap={() => canvasState.setSnapEnabled(!canvasState.snapEnabled)}
      />

      {/* Smart Status Indicator */}
      <SmartStatusIndicator
        isOnline={true}
        collaborators={2}
        viewers={5}
        lastSaved={lastSaved}
        hasUnsavedChanges={hasUnsavedChanges}
        performanceScore={performanceScore}
        aiSuggestions={aiSuggestions}
      />

      {/* Top Toolbar */}
      <CanvasTopSection
        historyIndex={canvasState.historyIndex}
        history={canvasState.history}
        onUndo={canvasState.undo}
        onRedo={canvasState.redo}
        onSave={handleSave}
        onNew={() => {}}
        onOpen={() => {}}
        handleCopy={canvasState.handleCopy}
        showGrid={canvasState.showGrid}
        onGridToggle={() => canvasState.setShowGrid(!canvasState.showGrid)}
        snapEnabled={canvasState.snapEnabled}
        onSnapToggle={() => canvasState.setSnapEnabled(!canvasState.snapEnabled)}
        gridSize={canvasState.gridSize}
        onGridSizeChange={canvasState.handleGridSizeChange}
        gridShape="dots"
        onGridShapeChange={() => {}}
        onSmartProjectGenerate={() => {
          setAiSuggestions(prev => prev + 1);
          toast.success('تم توليد اقتراحات ذكية جديدة!', {
            icon: '🧠',
            duration: 2000,
            className: 'animate-scale-in'
          });
        }}
      />

      {/* Main Canvas Area */}
      <div className="absolute inset-0 top-16 bottom-20">
        <PerformanceOptimizedCanvas
          selectedTool={canvasState.selectedTool}
          selectedElementIds={canvasState.selectedElementId ? [canvasState.selectedElementId] : []}
          onElementSelect={canvasState.setSelectedElementId}
          onElementsChange={handleElementsChange}
          zoom={canvasState.zoom}
          canvasPosition={canvasState.canvasPosition || { x: 0, y: 0 }}
          showGrid={canvasState.showGrid}
          snapEnabled={canvasState.snapEnabled}
          theme={{
            colors: {
              background: 'hsl(var(--background))'
            }
          }}
        />
      </div>

      {/* Bottom Toolbar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <CanvasBottomSection
          selectedTool={canvasState.selectedTool}
          onToolSelect={handleToolSelect}
        />
      </div>

      {/* Tool Panel - Right Side */}
      {canvasState.selectedTool && canvasState.selectedTool !== 'select' && (
        <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40">
          <ToolPanelManager
            selectedTool={canvasState.selectedTool}
            selectedElements={canvasState.selectedElementId ? [canvasState.elements.find(e => e.id === canvasState.selectedElementId)].filter(Boolean) as CanvasElement[] : []}
            zoom={canvasState.zoom}
            canvasPosition={canvasState.canvasPosition || { x: 0, y: 0 }}
            panSpeed={1}
            lineWidth={2}
            lineStyle="solid"
            selectedPenMode="smart-draw"
            showGrid={canvasState.showGrid}
            snapEnabled={canvasState.snapEnabled}
            gridSize={canvasState.gridSize}
            gridShape="dots"
            layers={canvasState.layers}
            selectedLayerId={canvasState.selectedLayerId}
            onUpdateElement={(id, updates) => console.log('تحديث عنصر:', id, updates)}
            onCopy={canvasState.handleCopy}
            onCut={() => console.log('قص')}
            onPaste={() => console.log('لصق')}
            onDelete={() => canvasState.selectedElementId && canvasState.deleteElement(canvasState.selectedElementId)}
            onGroup={() => console.log('تجميع')}
            onZoomChange={(zoom) => console.log('تغيير الزوم:', zoom)}
            onPositionChange={(pos) => console.log('تغيير الموضع:', pos)}
            onFitToScreen={() => console.log('ملاءمة الشاشة')}
            onResetView={() => console.log('إعادة تعيين العرض')}
            onPanSpeedChange={(speed) => console.log('تغيير سرعة التحريك:', speed)}
            onLineWidthChange={(width) => console.log('تغيير عرض الخط:', width)}
            onLineStyleChange={(style) => console.log('تغيير نمط الخط:', style)}
            onPenModeSelect={(mode) => console.log('تحديد وضع القلم:', mode)}
            onFileUpload={(files) => console.log('رفع ملفات:', files)}
            onLayerReorder={(layers) => console.log('إعادة ترتيب الطبقات:', layers)}
            onLayerSelect={(id) => console.log('تحديد طبقة:', id)}
            onGridToggle={() => canvasState.setShowGrid(!canvasState.showGrid)}
            onSnapToggle={() => canvasState.setSnapEnabled(!canvasState.snapEnabled)}
            onGridSizeChange={canvasState.handleGridSizeChange}
            onGridShapeChange={(shape) => console.log('تغيير شكل الشبكة:', shape)}
            onAlignToGrid={() => console.log('محاذاة للشبكة')}
          />
        </div>
      )}

      {/* Floating Panel Controls */}
      <FloatingPanelControls
        showSmartAssistant={showSmartAssistant}
        showLayers={showLayers}
        showAppearance={showAppearance}
        showCollaboration={showCollaboration}
        showTools={showTools}
        onTogglePanel={handleTogglePanel}
      />

      {/* Floating Panels */}
      <FloatingPanels
        showSmartAssistant={showSmartAssistant}
        showLayers={showLayers}
        showAppearance={showAppearance}
        showCollaboration={showCollaboration}
        showTools={showTools}
        onTogglePanel={handleTogglePanel}
        layers={canvasState.layers}
        selectedLayerId={canvasState.selectedLayerId}
        onLayerSelect={canvasState.handleLayerSelect}
        selectedElementId={canvasState.selectedElementId}
        elements={canvasState.elements}
      />
    </div>
  );
};
