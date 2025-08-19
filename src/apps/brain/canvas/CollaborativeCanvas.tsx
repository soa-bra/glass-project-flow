// Collaborative Canvas - Main Integration Component
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth/auth-provider';
import { useTelemetry } from '@/hooks/useTelemetry';
import { YSupabaseProvider } from '@/lib/yjs/y-supabase-provider';
import * as Y from 'yjs';
import WhiteboardTopbar from '@/components/Whiteboard/WhiteboardTopbar';
import WhiteboardRoot from '@/components/Whiteboard/WhiteboardRoot';
import PropertiesPanel from '@/components/Whiteboard/PropertiesPanel';
import StatusBar from '@/components/Whiteboard/StatusBar';
import { SceneGraph } from '@/lib/canvas/utils/scene-graph';
import { ConnectionManager } from '@/lib/canvas/controllers/connection-manager';
import { useRootConnector } from '@/hooks/useRootConnector';
import { useWF01Generator } from '@/hooks/useWF01Generator';
import { SmartElementsPanel } from '@/components/smart-elements/smart-elements-panel';
import { getViewportCenter, type SmartElementType } from './types';
import { smartElementsRegistry } from '@/lib/smart-elements/smart-elements-registry';

interface CollaborativeCanvasProps {
  boardId?: string;
  className?: string;
}

export default function CollaborativeCanvas({ 
  boardId = 'integrated-planning-default', 
  className = '' 
}: CollaborativeCanvasProps) {
  const { user, hasPermission } = useAuth();
  const { logCanvasOperation, logWF01Event, logCustomEvent } = useTelemetry({ boardId });
  
  // Core canvas state
  const [isInitialized, setIsInitialized] = useState(false);
  const [sceneGraph] = useState(() => new SceneGraph());
  const [connectionManager] = useState(() => new ConnectionManager(sceneGraph, boardId));
  const [yDoc] = useState(() => new Y.Doc());
  const [yProvider, setYProvider] = useState<YSupabaseProvider | null>(null);
  
  // Canvas state
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [zoom, setZoom] = useState(1);
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
  const [selectedTool, setSelectedTool] = useState('select');
  const [showSmartPanel, setShowSmartPanel] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [fps, setFps] = useState(0);
  
  // Refs
  const canvasRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  
  // Hooks
  const rootConnector = useRootConnector({
    sceneGraph,
    boardId,
    selectedNodeIds: selectedElements
  });
  
  const wf01Generator = useWF01Generator({
    sceneGraph,
    connectionManager,
    boardId
  });

  // Initialize board and Y.js provider
  useEffect(() => {
    if (!user) return;

    const initializeBoard = async () => {
      try {
        logCanvasOperation('canvas_init_start', {});
        
        // Check if board exists
        let { data: board, error: boardError } = await supabase
          .from('boards')
          .select('*')
          .eq('id', boardId)
          .single();

        if (boardError && boardError.code === 'PGRST116') {
          // Create default board
          const { data: newBoard, error: createError } = await supabase
            .from('boards')
            .insert({
              id: boardId,
              title: 'التخطيط التضامني',
              description: 'لوحة التخطيط التضامني المتكاملة',
              owner_id: user.id,
              is_public: false
            })
            .select()
            .single();

          if (createError) throw createError;
          board = newBoard;
        } else if (boardError) {
          throw boardError;
        }

        // Initialize Y.js provider
        const provider = new YSupabaseProvider(yDoc, boardId, user.id, {
          name: user.email?.split('@')[0] || 'User',
          color: '#' + Math.floor(Math.random()*16777215).toString(16)
        });

        provider.onConnectionChange = setIsConnected;
        
        await provider.connect();
        setYProvider(provider);
        setIsInitialized(true);

        logCanvasOperation('canvas_init_complete', {});
        logCustomEvent('canvas_initialized', { boardId });
        
      } catch (error) {
        console.error('Failed to initialize board:', error);
        logCustomEvent('canvas_init_error', { error: error.message });
      }
    };

    initializeBoard();

    return () => {
      yProvider?.disconnect();
    };
  }, [user, boardId, logCanvasOperation, logCustomEvent]);

  // Resize observer setup
  useEffect(() => {
    if (!canvasRef.current) return;

    resizeObserverRef.current = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        // Handle resize
        logCanvasOperation('canvas_resized', { width, height });
      }
    });

    resizeObserverRef.current.observe(canvasRef.current);

    return () => {
      resizeObserverRef.current?.disconnect();
    };
  }, [logCanvasOperation]);

  // FPS tracking
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        setFps(Math.round(frameCount * 1000 / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    if (isInitialized) {
      requestAnimationFrame(measureFPS);
    }
  }, [isInitialized]);

  // Auto-save every 10 seconds
  useEffect(() => {
    if (!yProvider || !isInitialized) return;

    const autoSave = setInterval(async () => {
      try {
        await yProvider.createSnapshot();
        logCanvasOperation('canvas_auto_saved', { boardId });
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 10000);

    return () => clearInterval(autoSave);
  }, [yProvider, isInitialized, boardId, logCanvasOperation]);

  // Tool handlers
  const handleToolChange = useCallback((tool: string) => {
    setSelectedTool(tool);
    if (tool === 'smart') {
      setShowSmartPanel(true);
    }
    logCanvasOperation('tool_selected', { tool });
  }, [logCanvasOperation]);

  const insertSmartElement = useCallback((elementType: SmartElementType, position?: { x: number; y: number }) => {
    const insertPosition = position || getViewportCenter({ 
      x: canvasPosition.x, 
      y: canvasPosition.y, 
      zoom, 
      width: 800, 
      height: 600 
    });
    
    const newNode = smartElementsRegistry.createSmartElementNode(elementType, insertPosition);
    if (newNode && sceneGraph) {
      sceneGraph.addNode(newNode);
      logCustomEvent('smart_element_created', { elementType, position: insertPosition });
    }
  }, [sceneGraph, canvasPosition, zoom, logCustomEvent]);

  const handleSmartElementCreate = useCallback((elementType: SmartElementType, initialState?: any) => {
    insertSmartElement(elementType);
    setShowSmartPanel(false);
  }, [insertSmartElement]);

  const handleWF01Generate = useCallback(async () => {
    try {
      logWF01Event('wf01_generation_started', { boardId });
      const result = await wf01Generator.generateProject();
      
      if (result.success) {
        logWF01Event('wf01_generation_success', {
          boardId,
          mappedElements: result.statistics.mappedElements,
          successRate: result.statistics.successRate
        });
      } else {
        logWF01Event('wf01_generation_failed', {
          boardId,
          error: result.error
        });
      }
      
      return result;
    } catch (error) {
      logWF01Event('wf01_generation_error', { boardId, error: error.message });
      throw error;
    }
  }, [wf01Generator, boardId, logWF01Event]);

  const handleSaveSnapshot = useCallback(async () => {
    if (!yProvider) return;
    
    try {
      await yProvider.createSnapshot();
      logCanvasOperation('manual_save', { boardId });
    } catch (error) {
      console.error('Manual save failed:', error);
    }
  }, [yProvider, boardId, logCanvasOperation]);

  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(zoom * 1.2, 8);
    setZoom(newZoom);
    logCanvasOperation('zoom_in', { zoom: newZoom });
  }, [zoom, logCanvasOperation]);

  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(zoom / 1.2, 0.1);
    setZoom(newZoom);
    logCanvasOperation('zoom_out', { zoom: newZoom });
  }, [zoom, logCanvasOperation]);

  const handleZoomReset = useCallback(() => {
    setZoom(1);
    setCanvasPosition({ x: 0, y: 0 });
    logCanvasOperation('zoom_reset', {});
  }, [logCanvasOperation]);

  if (!user || !isInitialized) {
    return (
      <div 
        className={`flex items-center justify-center h-full ${className}`}
        data-test-id="canvas-loading"
      >
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">جاري تحضير اللوحة...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative h-full w-full flex flex-col overflow-hidden ${className}`}
      data-test-id="collaborative-canvas"
      ref={canvasRef}
    >
      {/* Top Toolbar */}
      <WhiteboardTopbar
        selectedTool={selectedTool}
        onToolChange={handleToolChange}
        onSmartToolClick={() => setShowSmartPanel(true)}
        onConnectorClick={() => handleToolChange('connector')}
        onWF01Click={handleWF01Generate}
        onSaveClick={handleSaveSnapshot}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
        zoom={zoom}
        data-test-id="canvas-topbar"
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Main Canvas Area */}
        <div className="flex-1 relative">
          <WhiteboardRoot
            sceneGraph={sceneGraph}
            connectionManager={connectionManager}
            yProvider={yProvider}
            selectedTool={selectedTool}
            selectedElements={selectedElements}
            onSelectionChange={setSelectedElements}
            zoom={zoom}
            onZoomChange={setZoom}
            canvasPosition={canvasPosition}
            onCanvasPositionChange={setCanvasPosition}
            data-test-id="canvas-stage"
          />

          {/* Smart Elements Panel Overlay */}
          {showSmartPanel && (
            <div className="absolute inset-y-0 left-0 w-80 bg-background/95 backdrop-blur-sm border-r shadow-lg z-50">
              <SmartElementsPanel
                isOpen={showSmartPanel}
                onClose={() => setShowSmartPanel(false)}
                onElementSelect={handleSmartElementCreate}
                data-test-id="modal-smart-panel"
              />
            </div>
          )}
        </div>

        {/* Properties Panel */}
        {selectedElements.length > 0 && (
          <div className="w-80 bg-background/95 backdrop-blur-sm border-l">
            <PropertiesPanel
              selectedElements={selectedElements}
              sceneGraph={sceneGraph}
              onUpdate={(elementId, updates) => {
                // Handle element updates
                logCanvasOperation('element_updated', { elementId, updates });
              }}
              data-test-id="panel-properties"
            />
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      <StatusBar
        isConnected={isConnected}
        fps={fps}
        zoom={zoom}
        elementsCount={sceneGraph.getAllNodes().length}
        selectedCount={selectedElements.length}
        data-test-id="status-bar"
      />
    </div>
  );
}