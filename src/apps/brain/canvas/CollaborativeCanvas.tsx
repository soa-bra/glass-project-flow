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
import FallbackCanvas from '@/components/Whiteboard/FallbackCanvas';
import { YSupabaseProvider as LocalYSupabaseProvider } from '@/apps/brain/realtime/ySupabaseProvider';

interface CollaborativeCanvasProps {
  boardAlias?: string;
  className?: string;
  'data-test-id'?: string;
}

export default function CollaborativeCanvas({ 
  boardAlias = 'integrated-planning-default', 
  className = '',
  'data-test-id': testId
}: CollaborativeCanvasProps) {
  const [boardId, setBoardId] = useState<string | null>(null);
  const { user, hasPermission } = useAuth();
  const { logCanvasOperation, logWF01Event, logCustomEvent } = useTelemetry({ boardId: boardId || boardAlias });
  
  // Core canvas state
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLocalMode, setIsLocalMode] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [sceneGraph] = useState(() => new SceneGraph());
  const [connectionManager] = useState(() => new ConnectionManager(sceneGraph, boardAlias));
  const [yDoc] = useState(() => new Y.Doc());
  const [yProvider, setYProvider] = useState<LocalYSupabaseProvider | null>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const [viewport, setViewport] = useState({ width: 800, height: 600, dpr: 1 });
  
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
  const hostRef = useRef<HTMLDivElement>(null);
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
        
        // Try to find board by alias first
        let { data: board, error: boardError } = await supabase
          .from('boards')
          .select('*')
          .eq('title', boardAlias)
          .eq('owner_id', user.id)
          .single();

        let actualBoardId = boardAlias;

        if (boardError && boardError.code === 'PGRST116') {
          // Create default board
          const { data: newBoard, error: createError } = await supabase
            .from('boards')
            .insert({
              title: boardAlias,
              description: 'لوحة التخطيط التضامني المتكاملة',
              owner_id: user.id,
              is_public: false
            })
            .select()
            .single();

          if (createError) throw createError;
          board = newBoard;
          actualBoardId = newBoard.id;
        } else if (boardError) {
          console.warn('Board access failed, entering local mode:', boardError);
          setIsLocalMode(true);
          setIsInitialized(true);
          return;
        } else {
          actualBoardId = board.id;
        }

        setBoardId(actualBoardId);

        // Initialize Y.js provider with connection timeout
        const provider = new LocalYSupabaseProvider(yDoc, actualBoardId, user.id, {
          name: user.email?.split('@')[0] || 'User',
          color: '#' + Math.floor(Math.random()*16777215).toString(16)
        });

        provider.onConnectionChange = setIsConnected;
        
        // Try to connect with 3 second timeout
        const connectionPromise = provider.connect();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection timeout')), 3000)
        );

        try {
          await Promise.race([connectionPromise, timeoutPromise]);
          setYProvider(provider);
        } catch (error) {
          console.warn('Realtime connection failed, entering local mode:', error);
          setIsLocalMode(true);
          provider.disconnect();
        }

        setIsInitialized(true);
        logCanvasOperation('canvas_init_complete', {});
        logCustomEvent('canvas_initialized', { boardId: actualBoardId });
        
      } catch (error) {
        console.error('Failed to initialize board:', error);
        setIsLocalMode(true);
        setIsInitialized(true);
        logCustomEvent('canvas_init_error', { error: error.message });
      }
    };

    initializeBoard();

    return () => {
      yProvider?.disconnect();
    };
  }, [user, boardAlias, logCanvasOperation, logCustomEvent]);

  // Resize observer and viewport setup
  useEffect(() => {
    if (!hostRef.current) return;

    resizeObserverRef.current = new ResizeObserver(([entry]) => {
      const cr = entry.contentRect;
      const newViewport = {
        width: Math.max(cr.width, 1),
        height: Math.max(cr.height, 1),
        dpr: window.devicePixelRatio || 1
      };
      setViewport(newViewport);
      logCanvasOperation('canvas_resized', { width: cr.width, height: cr.height });
    });

    resizeObserverRef.current.observe(hostRef.current);

    return () => {
      resizeObserverRef.current?.disconnect();
    };
  }, [logCanvasOperation]);

  // Scene ready timeout - show fallback if WhiteboardRoot takes too long
  useEffect(() => {
    if (!isInitialized) return;

    const timeout = setTimeout(() => {
      if (!sceneReady) {
        console.log('WhiteboardRoot taking too long, showing fallback');
      }
    }, 300);

    // Simulate scene ready after initialization
    const readyTimeout = setTimeout(() => {
      setSceneReady(true);
    }, 100);

    return () => {
      clearTimeout(timeout);
      clearTimeout(readyTimeout);
    };
  }, [isInitialized, sceneReady]);

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

  // Auto-save every 10 seconds and seed default sticky
  useEffect(() => {
    if (!isInitialized) return;

    // Seed default sticky if canvas is empty
    const seedDefaultSticky = async () => {
      try {
        // Check if canvas is empty
        const nodes = sceneGraph.getAllNodes();
        if (nodes.length === 0) {
          // Check if there are any board_objects
          if (boardId && !isLocalMode) {
            const { data: objects } = await supabase
              .from('board_objects')
              .select('id')
              .eq('board_id', boardId)
              .limit(1);
            
            if (objects && objects.length === 0) {
              // Insert default sticky with proper structure
              const defaultSticky = {
                id: 'default-sticky-' + Date.now(),
                type: 'sticky' as const,
                transform: {
                  position: { x: 0, y: 0 },
                  rotation: 0,
                  scale: { x: 1, y: 1 }
                },
                size: { width: 260, height: 180 },
                style: { 
                  fill: '#fef3c7', 
                  stroke: '#92400e',
                  strokeWidth: 2,
                  opacity: 1 
                },
                content: 'أهلًا! جرّب التكبير والسحب أو اضغط S لإضافة عنصر ذكي.',
                color: '#92400e',
                metadata: { seeded: true }
              };
              
              sceneGraph.addNode(defaultSticky);
              logCustomEvent('default_sticky_seeded', { boardId });
            }
          } else if (isLocalMode) {
            // Local mode - add directly to sceneGraph with proper structure
            const defaultSticky = {
              id: 'default-sticky-local-' + Date.now(),
              type: 'sticky' as const,
              transform: {
                position: { x: 0, y: 0 },
                rotation: 0,
                scale: { x: 1, y: 1 }
              },
              size: { width: 260, height: 180 },
              style: { 
                fill: '#fef3c7', 
                stroke: '#92400e',
                strokeWidth: 2,
                opacity: 1 
              },
              content: 'أهلًا! أنت في الوضع المحلي. جرّب التكبير والسحب أو اضغط S لإضافة عنصر ذكي.',
              color: '#92400e',
              metadata: { seeded: true, local: true }
            };
            
            sceneGraph.addNode(defaultSticky);
            logCustomEvent('default_sticky_seeded_local', {});
          }
        }
      } catch (error) {
        console.error('Failed to seed default sticky:', error);
      }
    };

    seedDefaultSticky();

    // Auto-save for non-local mode
    if (!isLocalMode && yProvider) {
      const autoSave = setInterval(async () => {
        try {
          await yProvider.createSnapshot();
          logCanvasOperation('canvas_auto_saved', { boardId });
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }, 10000);

      return () => clearInterval(autoSave);
    }
  }, [yProvider, isInitialized, boardId, isLocalMode, sceneGraph, logCanvasOperation, logCustomEvent]);

  // Tool handlers
  const handleToolChange = useCallback((tool: string) => {
    setSelectedTool(tool);
    if (tool === 'smart') {
      setShowSmartPanel(true);
    }
    logCanvasOperation('tool_selected', { tool });
  }, [logCanvasOperation]);

  const insertSmartElement = useCallback((params: { type: string; position?: { x: number; y: number } }) => {
    const insertPosition = params.position || getViewportCenter({ 
      x: canvasPosition.x, 
      y: canvasPosition.y, 
      zoom, 
      width: viewport.width, 
      height: viewport.height 
    });
    
    const newNode = smartElementsRegistry.createSmartElementNode(params.type, insertPosition);
    if (newNode && sceneGraph) {
      sceneGraph.addNode(newNode);
      logCustomEvent('smart_element_created', { elementType: params.type, position: insertPosition });
    }
  }, [sceneGraph, canvasPosition, zoom, viewport, logCustomEvent]);

  const handleSmartElementCreate = useCallback((type: string, initialState?: any) => {
    insertSmartElement({ type });
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
      className={`relative w-full h-full ${className}`}
      data-test-id={testId}
      ref={hostRef}
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
        showGrid={showGrid}
        onGridToggle={() => setShowGrid(prev => !prev)}
        data-test-id="canvas-topbar"
      />

      <div className="absolute inset-0 top-12 bottom-8">
        {/* Main Canvas Area */}
        <div className="relative w-full h-full" data-test-id="canvas-stage">
          {/* Fallback Canvas - Emergency Layer */}
          <FallbackCanvas enabled={!sceneReady} />
          
          <WhiteboardRoot
            sceneGraph={sceneGraph}
            connectionManager={connectionManager}
            yProvider={yProvider as any}
            selectedTool={selectedTool}
            selectedElements={selectedElements}
            onSelectionChange={setSelectedElements}
            zoom={zoom}
            onZoomChange={setZoom}
            canvasPosition={canvasPosition}
            onCanvasPositionChange={setCanvasPosition}
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
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-background/95 backdrop-blur-sm border-l">
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
        isLocalMode={isLocalMode}
        fps={fps}
        zoom={zoom}
        elementsCount={sceneGraph.getAllNodes().length}
        selectedCount={selectedElements.length}
        boardId={boardId}
        data-test-id="status-bar"
      />
    </div>
  );
}