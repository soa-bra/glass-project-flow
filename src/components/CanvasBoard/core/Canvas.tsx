import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas as FabricCanvas, Circle, Rect, FabricText, Line, Group } from 'fabric';
import { toast } from 'sonner';
import useCanvasState from '@/hooks/useCanvasState';
import { useCanvasCollaboration } from '@/hooks/useCanvasCollaboration';
import { CanvasElement, SmartElementType } from '@/types/canvas';
import { CursorTracker } from '../collaboration/CursorTracker';
import { CollaborationBar } from '../collaboration/CollaborationBar';

interface CanvasProps {
  projectId: string;
  userId: string;
  userName: string;
  className?: string;
}

export const Canvas: React.FC<CanvasProps> = ({ 
  projectId, 
  userId, 
  userName, 
  className = "" 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  
  const {
    elements,
    activeTool,
    zoom,
    pan,
    gridVisible,
    selectedElementIds,
    addElement,
    updateElement,
    selectElements,
    setZoom,
    setPan
  } = useCanvasState();

  const {
    isConnected,
    collaborators,
    broadcastCursor,
    lockElement,
    unlockElement,
    isElementLockedByOther,
    sendMessage
  } = useCanvasCollaboration({
    projectId,
    userId,
    userName
  });

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      backgroundColor: 'hsl(var(--background))',
      selection: true,
      preserveObjectStacking: true,
    });

    // Configure drawing brush
    canvas.freeDrawingBrush.color = 'hsl(var(--primary))';
    canvas.freeDrawingBrush.width = 2;

    // Enable grid if visible
    if (gridVisible) {
      drawGrid(canvas);
    }

    setFabricCanvas(canvas);

    // Canvas event handlers
    canvas.on('mouse:move', (e) => {
      if (e.e && isConnected) {
        const pointer = canvas.getViewportPoint(e.e as MouseEvent);
        broadcastCursor(pointer.x, pointer.y);
      }
    });

    canvas.on('selection:created', (e) => {
      const selected = e.selected?.map(obj => (obj as any).id).filter(Boolean) || [];
      selectElements(selected);
    });

    canvas.on('selection:updated', (e) => {
      const selected = e.selected?.map(obj => (obj as any).id).filter(Boolean) || [];
      selectElements(selected);
    });

    canvas.on('selection:cleared', () => {
      selectElements([]);
    });

    canvas.on('object:modified', (e) => {
      if (e.target && (e.target as any).id) {
        const element = elements.find(el => el.id === (e.target as any).id);
        if (element) {
          updateElement((e.target as any).id, {
            position: { x: e.target.left || 0, y: e.target.top || 0 },
            size: { 
              width: e.target.width ? e.target.width * (e.target.scaleX || 1) : 0, 
              height: e.target.height ? e.target.height * (e.target.scaleY || 1) : 0 
            },
            rotation: e.target.angle || 0
          });
        }
      }
    });

    // Handle window resize
    const handleResize = () => {
      if (containerRef.current) {
        canvas.setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
    };
  }, []);

  // Update canvas mode based on active tool
  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = activeTool === 'smart-pen';
    fabricCanvas.selection = activeTool === 'selection';

    if (activeTool === 'smart-pen' && fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = 'hsl(var(--primary))';
      fabricCanvas.freeDrawingBrush.width = 2;
    }
  }, [activeTool, fabricCanvas]);

  // Handle zoom changes
  useEffect(() => {
    if (!fabricCanvas) return;
    fabricCanvas.setZoom(zoom);
  }, [zoom, fabricCanvas]);

  // Handle pan changes
  useEffect(() => {
    if (!fabricCanvas) return;
    fabricCanvas.viewportTransform = [zoom, 0, 0, zoom, pan.x, pan.y];
    fabricCanvas.renderAll();
  }, [pan, zoom, fabricCanvas]);

  // Draw grid helper
  const drawGrid = useCallback((canvas: FabricCanvas) => {
    const gridSize = 20;
    const width = canvas.getWidth();
    const height = canvas.getHeight();

    for (let i = 0; i < width / gridSize; i++) {
      const line = new Line([i * gridSize, 0, i * gridSize, height], {
        stroke: 'hsl(var(--border))',
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        excludeFromExport: true
      });
      canvas.add(line);
    }

    for (let i = 0; i < height / gridSize; i++) {
      const line = new Line([0, i * gridSize, width, i * gridSize], {
        stroke: 'hsl(var(--border))',
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        excludeFromExport: true
      });
      canvas.add(line);
    }
  }, []);

  // Add smart element
  const addSmartElement = useCallback((elementType: SmartElementType, position?: { x: number; y: number }) => {
    if (!fabricCanvas) return;

    const pos = position || { x: 100, y: 100 };
    const elementId = `element-${Date.now()}`;

    let fabricObject;

    switch (elementType) {
      case 'think_board':
        fabricObject = new Rect({
          left: pos.x,
          top: pos.y,
          width: 300,
          height: 200,
          fill: 'hsl(var(--accent))',
          stroke: 'hsl(var(--border))',
          strokeWidth: 2,
          rx: 8,
          ry: 8
        });
        break;

      case 'kanban_board':
        fabricObject = new Group([
          new Rect({ width: 250, height: 300, fill: 'hsl(var(--card))', rx: 8, ry: 8 }),
          new FabricText('Kanban Board', { top: 10, left: 10, fontSize: 16, fill: 'hsl(var(--foreground))' })
        ], {
          left: pos.x,
          top: pos.y
        });
        break;

      case 'timeline':
        fabricObject = new Line([pos.x, pos.y, pos.x + 400, pos.y], {
          stroke: 'hsl(var(--primary))',
          strokeWidth: 4
        });
        break;

      default:
        fabricObject = new Circle({
          left: pos.x,
          top: pos.y,
          radius: 50,
          fill: 'hsl(var(--primary))',
          stroke: 'hsl(var(--border))',
          strokeWidth: 2
        });
    }

    (fabricObject as any).id = elementId;
    fabricCanvas.add(fabricObject);

    // Add to state
    const element: CanvasElement = {
      id: elementId,
      type: 'smart-element',
      position: pos,
      size: { width: fabricObject.width || 100, height: fabricObject.height || 100 },
      data: { smartType: elementType }
    };

    addElement(element);
    toast(`تم إضافة ${elementType} بنجاح`);
  }, [fabricCanvas, addElement]);

  // Handle canvas click for adding elements
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (!fabricCanvas || activeTool === 'selection' || activeTool === 'hand') return;

    const pointer = fabricCanvas.getViewportPoint(e.nativeEvent);

    switch (activeTool) {
      case 'shapes':
        const rect = new Rect({
          left: pointer.x,
          top: pointer.y,
          width: 100,
          height: 100,
          fill: 'hsl(var(--primary))',
          stroke: 'hsl(var(--border))',
          strokeWidth: 2
        });
        (rect as any).id = `rect-${Date.now()}`;
        fabricCanvas.add(rect);
        break;

      case 'text':
        const text = new FabricText('نص جديد', {
          left: pointer.x,
          top: pointer.y,
          fontSize: 16,
          fill: 'hsl(var(--foreground))',
          fontFamily: 'Arial'
        });
        (text as any).id = `text-${Date.now()}`;
        fabricCanvas.add(text);
        break;
    }
  }, [fabricCanvas, activeTool]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden bg-background ${className}`}
    >
      {/* Collaboration Bar */}
      <CollaborationBar
        isConnected={isConnected}
        isReconnecting={false}
        isSyncing={false}
        collaborators={collaborators}
        currentUserId={userId}
        conflicts={0}
        pendingOperations={0}
        lastSyncTime={new Date()}
        messages={0}
        
      />

      {/* Main Canvas */}
      <div className="w-full h-full relative">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="border border-border cursor-crosshair"
        />
        
        {/* Cursor Tracker */}
        <CursorTracker
          collaborators={collaborators}
          currentUserId={userId}
          canvasOffset={pan}
          scale={zoom}
        />
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <div className="absolute bottom-4 left-4 px-3 py-2 bg-destructive text-destructive-foreground rounded-md text-sm">
          غير متصل
        </div>
      )}
    </div>
  );
};