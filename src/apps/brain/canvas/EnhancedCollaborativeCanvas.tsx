// Enhanced Collaborative Canvas with Canvas Engine Integration
import React, { useCallback, useEffect, useState, useRef, useLayoutEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth/auth-provider';
import { useTelemetry } from '@/hooks/useTelemetry';
import { YSupabaseProvider } from '@/lib/yjs/y-supabase-provider';
import { useDebouncedCallback } from '@/hooks/performance/useDebouncedCallback';
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
import { getViewportCenter } from '@/lib/canvas/types';
import { smartElementsRegistry } from '@/apps/brain/plugins/smart-elements/smart-elements-registry';
import FallbackCanvas from '@/components/Whiteboard/FallbackCanvas';
import { useCanvasEngineContext } from '@/components/canvas/CanvasEngineProvider';
import { usePerformanceIntegration } from '@/lib/canvas/integration/performance-integration';

interface EnhancedCollaborativeCanvasProps {
  boardAlias?: string;
  className?: string;
  'data-test-id'?: string;
  useEngineOptimization?: boolean;
}

export default function EnhancedCollaborativeCanvas({
  boardAlias = 'integrated-planning-default',
  className = '',
  'data-test-id': testId,
  useEngineOptimization = true
}: EnhancedCollaborativeCanvasProps) {
  const [boardId, setBoardId] = useState<string | null>(null);
  const { user } = useAuth();
  const { logCanvasOperation, logCustomEvent } = useTelemetry({ boardId: boardId || boardAlias });

  // Canvas Engine Integration (when available)
  let canvasEngine = null;
  let engineState = null;
  let isEngineReady = false;
  
  try {
    const engineContext = useCanvasEngineContext();
    canvasEngine = engineContext.engine;
    engineState = engineContext.state;
    isEngineReady = engineContext.isReady;
  } catch {
    // Context not available - fallback to legacy system
    console.log('Canvas Engine not available, using legacy system');
  }

  // Performance Integration
  const performanceIntegration = usePerformanceIntegration(canvasEngine, {
    enableVirtualization: true,
    enableHitTesting: true,
    enableMetrics: true
  });

  // Auth status flag
  const isAuthed = !!user;

  // Legacy Canvas core systems (fallback)
  const [sceneGraph] = useState(() => new SceneGraph());
  const [connectionManager] = useState(() => new ConnectionManager(sceneGraph, boardAlias));
  const [yDoc] = useState(() => new Y.Doc());
  const [yProvider, setYProvider] = useState<YSupabaseProvider | null>(null);
  const [sceneReady, setSceneReady] = useState(false);

  // Force re-render revision counter
  const [rev, setRev] = useState(0);

  // Canvas state
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [zoom, setZoom] = useState(1);
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
  const [selectedTool, setSelectedTool] = useState('select');
  const [showSmartPanel, setShowSmartPanel] = useState(false);
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(false);
  const [viewport, setViewport] = useState({ width: 1, height: 1, dpr: 1 });

  // Canvas refs and state
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<ResizeObserver | null>(null);

  // Sync Canvas Engine state with local state when available
  useEffect(() => {
    if (!canvasEngine || !engineState || !isEngineReady) return;

    // Sync selection
    setSelectedElements(engineState.selection.selectedIds);
    
    // Sync camera
    setZoom(engineState.camera.zoom);
    setCanvasPosition(engineState.camera.position);
    
    // Sync tool
    setSelectedTool(engineState.tool);

  }, [canvasEngine, engineState, isEngineReady]);

  // Hooks
  const rootConnector = useRootConnector({
    sceneGraph: canvasEngine?.getSceneGraph() || sceneGraph,
    boardId,
    selectedNodeIds: selectedElements
  });

  const wf01Generator = useWF01Generator({
    sceneGraph: canvasEngine?.getSceneGraph() || sceneGraph,
    connectionManager,
    boardId
  });

  // Initialize board and Y.js provider (same as legacy)
  useEffect(() => {
    const initializeBoard = async () => {
      if (!isAuthed) {
        setBoardId(`${boardAlias}-local`);
        setYProvider(null);
        return;
      }

      try {
        let { data: board, error: boardError } = await supabase
          .from('boards')
          .select('*')
          .eq('title', boardAlias)
          .eq('owner_id', user.id)
          .single();

        let actualBoardId = boardAlias;

        if (boardError && boardError.code === 'PGRST116') {
          const { data: newBoard, error: createError } = await supabase
            .from('boards')
            .insert({
              title: boardAlias,
              description: 'لوحة التخطيط التضامني المتكاملة المحسنة',
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
          return;
        } else {
          actualBoardId = board.id;
        }

        setBoardId(actualBoardId);

        const provider = new YSupabaseProvider(yDoc, actualBoardId, user.id, {
          name: user.email?.split('@')[0] || 'User',
          color: '#' + Math.floor(Math.random() * 16777215).toString(16)
        });

        const connectionPromise = provider.connect();
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Connection timeout')), 3000)
        );

        try {
          await Promise.race([connectionPromise, timeoutPromise]);
          setYProvider(provider);
        } catch (error) {
          console.warn('Realtime connection failed, entering local mode:', error);
          provider.disconnect();
        }
      } catch (error) {
        console.error('Failed to initialize board:', error);
      }
    };

    initializeBoard();

    return () => {
      yProvider?.disconnect();
    };
  }, [isAuthed, user, boardAlias]);

  // Debounced viewport update for better performance
  const debouncedViewportUpdate = useDebouncedCallback(
    (width: number, height: number) => {
      const newViewport = {
        width: Math.max(1, width),
        height: Math.max(1, height),
        dpr: window.devicePixelRatio || 1
      };
      setViewport(newViewport);
      
      // Update Canvas Engine viewport if available
      if (canvasEngine) {
        canvasEngine.setViewport(newViewport);
      }
    },
    16,
    []
  );

  // Viewport measurement with ResizeObserver
  useLayoutEffect(() => {
    if (!hostRef.current) return;

    const el = hostRef.current;
    const update = () => {
      debouncedViewportUpdate(el.clientWidth, el.clientHeight);
    };

    update();
    const ro = new ResizeObserver(update);
    resizeRef.current = ro;
    ro.observe(el);

    return () => {
      try {
        ro.disconnect();
      } catch {}
      resizeRef.current = null;
    };
  }, [debouncedViewportUpdate]);

  // Helper: add node with engine integration
  const addNodeAndRender = useCallback((node: any) => {
    if (!node) return;
    
    if (canvasEngine && isEngineReady) {
      // Use Canvas Engine
      const nodeId = canvasEngine.addNode(node);
      if (nodeId) {
        canvasEngine.selectNode(nodeId);
      }
    } else {
      // Fallback to legacy
      sceneGraph.addNode(node);
      setSelectedElements([node.id]);
      setRev((v) => v + 1);
    }
  }, [canvasEngine, isEngineReady, sceneGraph]);

  // Canvas ready callback
  const handleCanvasReady = useCallback(() => {
    setSceneReady(true);
  }, []);

  // Seed default sticky (enhanced version)
  useEffect(() => {
    if (!sceneReady) return;
    
    const nodeCount = canvasEngine ? 
      canvasEngine.getNodes().length : 
      sceneGraph.count();
    
    if (nodeCount > 0) return;

    const center = getViewportCenter(
      viewport,
      { x: canvasPosition.x, y: canvasPosition.y, scale: zoom }
    );

    let stickyNode = smartElementsRegistry.createSmartElementNode('sticky', center, {
      content: '🚀 نظام محسّن — Canvas Engine متفعل! اضغط S لإضافة عنصر ذكي.',
      color: '#a7f3d0'
    });

    if (!stickyNode) {
      const id = 'sticky-enhanced-' + Date.now();
      stickyNode = {
        id,
        type: 'sticky',
        transform: { position: center, rotation: 0, scale: { x: 1, y: 1 } },
        size: { width: 280, height: 180 },
        style: { fill: '#a7f3d0', stroke: '#059669', strokeWidth: 2 },
        content: '🚀 نظام محسّن — Canvas Engine متفعل! اضغط S لإضافة عنصر ذكي.',
        color: '#a7f3d0',
        metadata: { seeded: true, enhanced: true }
      } as const;
    }

    addNodeAndRender(stickyNode as any);

    try {
      logCanvasOperation?.('seed_enhanced_sticky', { 
        id: (stickyNode as any).id, 
        boardId: boardId || boardAlias,
        engineEnabled: !!canvasEngine 
      });
    } catch {}

    if (yProvider?.connected) {
      yProvider.createSnapshot().catch(console.warn);
    }
  }, [sceneReady, canvasEngine, sceneGraph, viewport, canvasPosition, zoom, yProvider, addNodeAndRender, logCanvasOperation, boardId, boardAlias, isEngineReady]);

  // Enhanced event handlers
  const handleToolChange = useCallback((tool: string) => {
    if (canvasEngine && isEngineReady) {
      // Update engine state (this would need to be added to engine)
      const state = canvasEngine.getState();
      state.tool = tool;
    }
    setSelectedTool(tool);
    if (tool === 'smart') {
      setShowSmartPanel(true);
    }
  }, [canvasEngine, isEngineReady]);

  const handleSmartElementCreate = useCallback((type: string) => {
    const center = getViewportCenter(viewport, { x: canvasPosition.x, y: canvasPosition.y, scale: zoom });
    
    const node = smartElementsRegistry.createSmartElementNode(type, center);
    if (node) {
      addNodeAndRender(node);
      try {
        logCanvasOperation?.('insert_enhanced_element', { 
          type, 
          id: node.id,
          engineEnabled: !!canvasEngine 
        });
      } catch {}
    }
    setShowSmartPanel(false);
  }, [viewport, canvasPosition, zoom, addNodeAndRender, logCanvasOperation, canvasEngine]);

  // Enhanced zoom handlers with engine integration
  const handleZoomIn = useCallback(() => {
    if (canvasEngine && isEngineReady) {
      canvasEngine.zoom(0.2);
    } else {
      const newZoom = Math.min(zoom * 1.2, 8);
      setZoom(newZoom);
    }
  }, [canvasEngine, isEngineReady, zoom]);

  const handleZoomOut = useCallback(() => {
    if (canvasEngine && isEngineReady) {
      canvasEngine.zoom(-0.2);
    } else {
      const newZoom = Math.max(zoom / 1.2, 0.1);
      setZoom(newZoom);
    }
  }, [canvasEngine, isEngineReady, zoom]);

  const handleZoomReset = useCallback(() => {
    if (canvasEngine && isEngineReady) {
      canvasEngine.zoom(1 - zoom);
      canvasEngine.pan({ x: -canvasPosition.x, y: -canvasPosition.y });
    } else {
      setZoom(1);
      setCanvasPosition({ x: 0, y: 0 });
    }
  }, [canvasEngine, isEngineReady, zoom, canvasPosition]);

  const handleCanvasMove = useCallback((position: { x: number; y: number }) => {
    if (canvasEngine && isEngineReady) {
      const delta = { 
        x: position.x - canvasPosition.x, 
        y: position.y - canvasPosition.y 
      };
      canvasEngine.pan(delta);
    }
    setCanvasPosition(position);
  }, [canvasEngine, isEngineReady, canvasPosition]);

  // Get current scene graph (engine or legacy)
  const currentSceneGraph = canvasEngine?.getSceneGraph() || sceneGraph;
  const elementsCount = canvasEngine ? canvasEngine.getNodes().length : sceneGraph.count();

  return (
    <div ref={hostRef} className="relative w-full h-full flex flex-col bg-white">
      {/* Loading Overlay */}
      {(!boardId || !currentSceneGraph || !connectionManager || !yDoc || !isAuthed) && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-25">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">
              {!isAuthed ? 'جاري إعداد الوضع المحلي المحسن...' : 'جاري تحضير اللوحة المحسنة...'}
            </p>
            {canvasEngine && (
              <p className="text-xs text-green-600 mt-1">✓ Canvas Engine نشط</p>
            )}
          </div>
        </div>
      )}

      {/* Enhanced Topbar */}
      <div className="flex-shrink-0 z-20 relative">
        <WhiteboardTopbar
          selectedTool={selectedTool}
          onToolChange={handleToolChange}
          onSmartToolClick={() => setShowSmartPanel(true)}
          onConnectorClick={() => setSelectedTool('connector')}
          onWF01Click={isAuthed ? wf01Generator.generateProject : undefined}
          onSaveClick={isAuthed ? yProvider?.createSnapshot.bind(yProvider) : undefined}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onZoomReset={handleZoomReset}
          zoom={zoom}
          onGridToggle={() => {
            console.log('Grid toggle clicked - enhanced mode');
          }}
          data-test-id="btn-smart-tool-enhanced"
        />
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative bg-gray-50 overflow-hidden">
        <WhiteboardRoot
          key={rev}
          sceneGraph={currentSceneGraph}
          connectionManager={connectionManager}
          yProvider={yProvider}
          selectedTool={selectedTool}
          selectedElements={selectedElements}
          onSelectionChange={setSelectedElements}
          zoom={zoom}
          canvasPosition={canvasPosition}
          onCanvasMove={handleCanvasMove}
          onZoomChange={setZoom}
          onReady={handleCanvasReady}
        />

        <FallbackCanvas enabled={!sceneReady} />
      </div>
      
      {/* Enhanced Status Bar */}
      <div className="absolute top-16 right-4 z-15">
        <StatusBar
          fps={60}
          zoom={zoom}
          elementsCount={elementsCount}
          selectedCount={selectedElements.length}
          boardId={boardId ?? `${boardAlias}-enhanced-local`}
          connected={yProvider?.connected ?? false}
          isLocalMode={!yProvider}
          data-test-id="status-enhanced-realtime"
        />
        {canvasEngine && performanceIntegration && (
          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs">
            <div className="text-green-800 font-medium">⚡ محرك الأداء نشط</div>
            <div className="text-green-600">
              عقد: {performanceIntegration.getMetrics().nodeCount} | 
              تكبير: {zoom.toFixed(2)}x
            </div>
          </div>
        )}
      </div>

      {/* Smart Panel */}
      {showSmartPanel && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-30">
          <div className="relative w-[600px] h-[500px] max-w-[90vw] max-h-[90vh] bg-white rounded-lg shadow-xl">
            <SmartElementsPanel
              isOpen={showSmartPanel}
              onClose={() => setShowSmartPanel(false)}
              onElementSelect={handleSmartElementCreate}
              data-test-id="modal-smart-panel-enhanced"
            />
          </div>
        </div>
      )}

      {/* Enhanced Properties Panel */}
      {showPropertiesPanel && selectedElements[0] && (
        <div className="absolute right-4 top-20 bottom-4 w-80 bg-white rounded-lg shadow-lg border p-4 z-25">
          <PropertiesPanel
            sceneGraph={currentSceneGraph}
            selectedId={selectedElements[0]}
            onPropertyChange={(id, patch) => {
              if (canvasEngine && isEngineReady) {
                canvasEngine.updateNode(id, patch);
              } else {
                currentSceneGraph.updateNode(id, patch);
                setRev((v) => v + 1);
              }
            }}
            onClose={() => setShowPropertiesPanel(false)}
          />
        </div>
      )}
    </div>
  );
}