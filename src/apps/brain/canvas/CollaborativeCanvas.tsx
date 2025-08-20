// Collaborative Canvas - Main Integration Component
import React, { useCallback, useEffect, useState, useRef, useLayoutEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth/auth-provider';
import { useTelemetry } from '@/hooks/useTelemetry';
import { YSupabaseProvider } from '@/apps/brain/realtime/ySupabaseProvider';
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
          color: '#' + Math.floor(Math.random()*16777215).toString(16)
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

  // Canvas ready callback  
  const handleCanvasReady = useCallback(() => {
    setSceneReady(true);
    
    // Seed default sticky note if no content exists
    if (sceneGraph.count() === 0) {
      const center = getViewportCenter(viewport, { x: canvasPosition.x, y: canvasPosition.y, scale: zoom });
      const stickyNode = smartElementsRegistry.createSmartElementNode('sticky-note', center, {
        content: 'تم التشغيل ✓ — كبّر وصغّر/اسحب. اضغط S لإضافة عنصر ذكي.',
        color: '#fef3c7'
      });
      
      if (stickyNode) {
        sceneGraph.addNode(stickyNode);
        
        // Save to Supabase if connected
        if (yProvider?.isConnected()) {
          yProvider.createSnapshot().catch(console.warn);
        }
      }
    }
  }, [sceneGraph, viewport, canvasPosition, zoom, yProvider]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return; // Don't interfere with form inputs
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
      sceneGraph.addNode(node);
      setSelectedElements([node.id]);
    }
  }, [sceneGraph]);

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
    <div ref={hostRef} className="relative w-full h-full">
      {/* Overlay عند عدم وجود مستخدم */}
      {!isAuthed && (
        <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground">جارٍ التحضير… وضع محلي مؤقت</p>
          </div>
        </div>
      )}

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
      
      <div className="absolute inset-0" data-test-id="canvas-stage">
        <WhiteboardRoot
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
      </div>

      <StatusBar
        fps={0}
        zoom={zoom}
        elementsCount={sceneGraph.count()}
        selectedCount={selectedElements.length}
        boardId={boardId ?? `${boardAlias}-local`}
        data-test-id="status-realtime"
      />

      <SmartElementsPanel
        isOpen={showSmartPanel}
        onClose={() => setShowSmartPanel(false)}
        onElementSelect={handleSmartElementCreate}
        data-test-id="modal-smart-panel"
      />

      {showPropertiesPanel && selectedElements[0] && (
        <PropertiesPanel
          sceneGraph={sceneGraph}
          selectedId={selectedElements[0]}
          onPropertyChange={(id, patch) => {
            sceneGraph.updateNode(id, patch);
          }}
          onClose={() => setShowPropertiesPanel(false)}
        />
      )}
    </div>
  );
}