// Collaborative Canvas - Main Integration Component
import React, { useCallback, useEffect, useState, useRef, useLayoutEffect } from 'react';
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
import { getViewportCenter } from '@/lib/canvas/types';
import { smartElementsRegistry } from '@/lib/smart-elements/smart-elements-registry';
import FallbackCanvas from '@/components/Whiteboard/FallbackCanvas';

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
  const { user } = useAuth();
  const { logCanvasOperation, logCustomEvent } = useTelemetry({ boardId: boardId || boardAlias });

  // Auth status flag
  const isAuthed = !!user;

  // Canvas core systems
  const [sceneGraph] = useState(() => new SceneGraph());
  const [connectionManager] = useState(() => new ConnectionManager(sceneGraph, boardAlias));
  const [yDoc] = useState(() => new Y.Doc());
  const [yProvider, setYProvider] = useState<YSupabaseProvider | null>(null);
  const [sceneReady, setSceneReady] = useState(false);

  // Force re-render revision counter
  const [rev, setRev] = useState(0);

  // Safety timeout to ensure scene ready
  useEffect(() => {
    const t = setTimeout(() => {
      setSceneReady((v) => v || true);
    }, 1200);
    return () => clearTimeout(t);
  }, []);

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
    const initializeBoard = async () => {
      if (!isAuthed) {
        // Local mode - no Supabase integration
        setBoardId(`${boardAlias}-local`);
        setYProvider(null);
        return;
      }

      try {
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
          return;
        } else {
          actualBoardId = board.id;
        }

        setBoardId(actualBoardId);

        // Initialize Y.js provider with connection timeout
        const provider = new YSupabaseProvider(yDoc, actualBoardId, user.id, {
          name: user.email?.split('@')[0] || 'User',
          color: '#' + Math.floor(Math.random() * 16777215).toString(16)
        });

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

  // Viewport measurement with ResizeObserver
  useLayoutEffect(() => {
    if (!hostRef.current) return;

    const el = hostRef.current;
    const update = () => {
      setViewport({
        width: Math.max(1, el.clientWidth),
        height: Math.max(1, el.clientHeight),
        dpr: window.devicePixelRatio || 1
      });
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
  }, []);

  // Helper: add node + bump revision
  const addNodeAndRender = useCallback((node: any) => {
    if (!node) return;
    sceneGraph.addNode(node);
    setSelectedElements([node.id]);
    setRev((v) => v + 1);
  }, [sceneGraph]);

  // Canvas ready callback
  const handleCanvasReady = useCallback(() => {
    setSceneReady(true);
  }, []);

  // Seed default sticky after scene becomes ready (even if onReady came late)
  useEffect(() => {
    if (!sceneReady) return;
    if (sceneGraph.count() > 0) return;

    const center = getViewportCenter(
      viewport,
      { x: canvasPosition.x, y: canvasPosition.y, scale: zoom }
    );

    let stickyNode = smartElementsRegistry.createSmartElementNode('sticky', center, {
      content: 'تم التشغيل ✓ — كبّر وصغّر/اسحب. اضغط S لإضافة عنصر ذكي.',
      color: '#fef3c7'
    });

    if (!stickyNode) {
      const id = 'sticky-' + Date.now();
      stickyNode = {
        id,
        type: 'sticky',
        transform: { position: center, rotation: 0, scale: { x: 1, y: 1 } },
        size: { width: 260, height: 180 },
        style: { fill: '#fef3c7', stroke: '#d1b892', strokeWidth: 1 },
        content: 'تم التشغيل ✓ — كبّر وصغّر/اسحب. اضغط S لإضافة عنصر ذكي.',
        color: '#fef3c7',
        metadata: { seeded: true }
      } as const;
    }

    addNodeAndRender(stickyNode as any);

    // Telemetry (إشارة زرع أولي)
    try {
      // @ts-ignore - لو الأنواع تختلف في مشروعك
      logCanvasOperation?.('seed_sticky', { id: (stickyNode as any).id, boardId: boardId || boardAlias });
    } catch {}

    if (yProvider?.connected) {
      yProvider.createSnapshot().catch(console.warn);
    }
  }, [sceneReady, sceneGraph, viewport, canvasPosition, zoom, yProvider, addNodeAndRender, logCanvasOperation, boardId, boardAlias]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case 's':
          if (!event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            setShowSmartPanel(prev => !prev);
          }
          break;
        case '+':
        case '=':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            handleZoomIn();
          }
          break;
        case '-':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            handleZoomOut();
          }
          break;
        case '0':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            handleZoomReset();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Event handlers
  const handleToolChange = useCallback((tool: string) => {
    setSelectedTool(tool);
    if (tool === 'smart') {
      setShowSmartPanel(true);
    }
  }, []);

  const insertSmartElement = useCallback((elementData: { type: string; position: { x: number; y: number } }) => {
    const node = smartElementsRegistry.createSmartElementNode(
      elementData.type,
      elementData.position
    );
    if (node) {
      addNodeAndRender(node);
      // Telemetry
      try {
        // @ts-ignore
        logCanvasOperation?.('insert_element', { type: elementData.type, id: node.id });
      } catch {}
    }
  }, [addNodeAndRender, logCanvasOperation]);

  const handleSmartElementCreate = useCallback((type: string) => {
    const center = getViewportCenter(viewport, { x: canvasPosition.x, y: canvasPosition.y, scale: zoom });
    insertSmartElement({ type, position: center });
    setShowSmartPanel(false);
  }, [viewport, canvasPosition, zoom, insertSmartElement]);

  const handleWF01Generate = useCallback(async () => {
    try {
      const result = await wf01Generator.generateProject();
      return result;
    } catch (error) {
      throw error;
    }
  }, [wf01Generator]);

  const handleSaveSnapshot = useCallback(async () => {
    if (!yProvider) return;

    try {
      await yProvider.createSnapshot();
    } catch (error) {
      console.error('Manual save failed:', error);
    }
  }, [yProvider]);

  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(zoom * 1.2, 8);
    setZoom(newZoom);
  }, [zoom]);

  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(zoom / 1.2, 0.1);
    setZoom(newZoom);
  }, [zoom]);

  const handleZoomReset = useCallback(() => {
    setZoom(1);
    setCanvasPosition({ x: 0, y: 0 });
  }, []);

  return (
    <div ref={hostRef} className="relative w-full h-full flex flex-col">
      {/* Overlay عند عدم وجود مستخدم وعدم الجاهزية */}
      {!isAuthed && !sceneReady && (
        <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground">جارٍ التحضير… وضع محلي مؤقت</p>
          </div>
        </div>
      )}

      {/* Topbar - طبقة علوية ثابتة */}
      <div className="relative z-30 flex-shrink-0">
        <WhiteboardTopbar
          selectedTool={selectedTool}
          onToolChange={handleToolChange}
          onSmartToolClick={() => setShowSmartPanel(true)}
          onConnectorClick={() => setSelectedTool('connector')}
          onWF01Click={isAuthed ? handleWF01Generate : undefined}
          onSaveClick={isAuthed ? handleSaveSnapshot : undefined}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onZoomReset={handleZoomReset}
          zoom={zoom}
          onGridToggle={() => {}}
          data-test-id="btn-smart-tool"
        />
      </div>

      {/* Canvas Area - المنطقة المتبقية */}
      <div className="relative flex-1 overflow-hidden" data-test-id="canvas-stage">
        <WhiteboardRoot
          key={rev}  // يجبر إعادة تركيب المكوّن عند أي تغيير في المشهد
          sceneGraph={sceneGraph}
          connectionManager={connectionManager}
          yProvider={yProvider}
          selectedTool={selectedTool}
          selectedElements={selectedElements}
          onSelectionChange={setSelectedElements}
          zoom={zoom}
          canvasPosition={canvasPosition}
          onReady={handleCanvasReady}
        />

        <FallbackCanvas enabled={!sceneReady} />
        
        {/* Status Bar - داخل منطقة الكانفاس */}
        <StatusBar
          fps={0}
          zoom={zoom}
          elementsCount={sceneGraph.count()}
          selectedCount={selectedElements.length}
          boardId={boardId ?? `${boardAlias}-local`}
          connected={yProvider?.connected ?? false}
          isLocalMode={!yProvider}
          data-test-id="status-realtime"
        />
      </div>

      {/* Panels - طبقة عالية للألواح */}
      {showSmartPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-[600px] h-[500px] max-w-[90vw] max-h-[90vh]">
            <SmartElementsPanel
              isOpen={showSmartPanel}
              onClose={() => setShowSmartPanel(false)}
              onElementSelect={handleSmartElementCreate}
              data-test-id="modal-smart-panel"
            />
          </div>
        </div>
      )}

      {showPropertiesPanel && selectedElements[0] && (
        <PropertiesPanel
          sceneGraph={sceneGraph}
          selectedId={selectedElements[0]}
          onPropertyChange={(id, patch) => {
            sceneGraph.updateNode(id, patch);
            setRev((v) => v + 1);
          }}
          onClose={() => setShowPropertiesPanel(false)}
        />
      )}
    </div>
  );
}
