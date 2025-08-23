// ===============================
// Canvas Surface - Main Drawing Area
// سطح الكانفاس - منطقة الرسم الرئيسية
// ===============================

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { COLORS, LAYOUT } from '@/components/shared/design-system/constants';
import { useCanvasStore } from '../../store/canvas.store';
import { useToolsStore } from '../../store/tools.store';
import { Grid } from './Grid';
import { ViewportController } from './ViewportController';
import { ElementsLayer } from './ElementsLayer';
import { SelectionLayer } from './SelectionLayer';
import { PresenceLayer } from './PresenceLayer';

export const CanvasSurface: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  
  const { 
    board, 
    viewport, 
    selection,
    panViewport,
    zoomViewport,
    setViewport,
    incrementRenderCount 
  } = useCanvasStore();
  
  const { 
    activeTool,
    selectionTool,
    panTool,
    zoomTool,
    startPanning,
    updatePanPosition,
    stopPanning,
    startDragging,
    stopDragging,
    updateSelectionBox
  } = useToolsStore();

  // Update canvas size on resize
  useEffect(() => {
    const updateSize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setCanvasSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Handle mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const position = {
      x: (e.clientX - rect.left - viewport.x) / viewport.zoom,
      y: (e.clientY - rect.top - viewport.y) / viewport.zoom,
    };

    switch (activeTool) {
      case 'pan':
        startPanning({ x: e.clientX, y: e.clientY });
        break;
      case 'select':
        if (!e.shiftKey) {
          startDragging(position);
        }
        break;
      case 'zoom':
        // Handle zoom click
        const newZoom = e.shiftKey ? viewport.zoom * 0.8 : viewport.zoom * 1.25;
        zoomViewport(Math.max(0.1, Math.min(5, newZoom)), position);
        break;
    }
  }, [activeTool, viewport, startPanning, startDragging, zoomViewport]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const position = {
      x: (e.clientX - rect.left - viewport.x) / viewport.zoom,
      y: (e.clientY - rect.top - viewport.y) / viewport.zoom,
    };

    if (panTool.isPanning) {
      const deltaX = e.clientX - (panTool.lastPosition?.x || e.clientX);
      const deltaY = e.clientY - (panTool.lastPosition?.y || e.clientY);
      panViewport(deltaX, deltaY);
      updatePanPosition({ x: e.clientX, y: e.clientY });
    }

    if (selectionTool.isDragging && selectionTool.dragStartPos) {
      updateSelectionBox(selectionTool.dragStartPos, position);
    }

    incrementRenderCount();
  }, [
    viewport, 
    panTool.isPanning, 
    panTool.lastPosition, 
    selectionTool.isDragging, 
    selectionTool.dragStartPos,
    panViewport,
    updatePanPosition,
    updateSelectionBox,
    incrementRenderCount
  ]);

  const handleMouseUp = useCallback(() => {
    if (panTool.isPanning) {
      stopPanning();
    }
    
    if (selectionTool.isDragging) {
      stopDragging();
    }
  }, [panTool.isPanning, selectionTool.isDragging, stopPanning, stopDragging]);

  // Handle wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const centerPoint = {
        x: (e.clientX - rect.left - viewport.x) / viewport.zoom,
        y: (e.clientY - rect.top - viewport.y) / viewport.zoom,
      };

      const zoomDelta = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.1, Math.min(5, viewport.zoom * zoomDelta));
      
      zoomViewport(newZoom, centerPoint);
    } else {
      // Pan with wheel
      panViewport(-e.deltaX, -e.deltaY);
    }
  }, [viewport, panViewport, zoomViewport]);

  // Cursor styles based on active tool
  const getCursorStyle = () => {
    switch (activeTool) {
      case 'pan':
        return panTool.isPanning ? 'cursor-grabbing' : 'cursor-grab';
      case 'zoom':
        return zoomTool.zoomMode === 'zoom-in' ? 'cursor-zoom-in' : 'cursor-zoom-out';
      case 'text':
        return 'cursor-text';
      case 'smart-pen':
        return 'cursor-crosshair';
      default:
        return 'cursor-default';
    }
  };

  if (!board) {
    return (
      <div className={cn(
        "h-full w-full",
        LAYOUT.FLEX_CENTER,
        COLORS.CANVAS_BACKGROUND
      )}>
        <div className="text-sb-ink/50">لا توجد لوحة متاحة</div>
      </div>
    );
  }

  return (
    <div 
      ref={canvasRef}
      className={cn(
        "h-full w-full relative overflow-hidden",
        COLORS.CANVAS_BACKGROUND,
        getCursorStyle()
      )}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Viewport Controller */}
      <ViewportController />
      
      {/* Grid Layer */}
      <Grid />
      
      {/* Main Canvas Transform Container */}
      <div
        className="absolute inset-0 origin-top-left"
        style={{
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
          transformOrigin: '0 0',
        }}
      >
        {/* Elements Layer */}
        <ElementsLayer elements={Object.values(board.elements)} />
        
        {/* Connectors Layer */}
        <div className="absolute inset-0 pointer-events-none">
          {Object.values(board.connectors || {}).map(connector => (
            <div key={connector.id}>
              {/* TODO: Render connectors */}
            </div>
          ))}
        </div>
      </div>
      
      {/* UI Layers (not affected by zoom/pan) */}
      <SelectionLayer />
      <PresenceLayer />
      
      {/* Canvas Info */}
      <div className="absolute bottom-4 left-4 text-xs text-sb-ink/40 font-mono">
        Zoom: {Math.round(viewport.zoom * 100)}% | 
        X: {Math.round(viewport.x)} | 
        Y: {Math.round(viewport.y)}
      </div>
      
      {/* Selection Box */}
      {selectionTool.selectionBox && (
        <div
          className="absolute border-2 border-blue-500 bg-blue-500/10 pointer-events-none"
          style={{
            left: Math.min(
              selectionTool.selectionBox.start.x * viewport.zoom + viewport.x,
              selectionTool.selectionBox.end.x * viewport.zoom + viewport.x
            ),
            top: Math.min(
              selectionTool.selectionBox.start.y * viewport.zoom + viewport.y,
              selectionTool.selectionBox.end.y * viewport.zoom + viewport.y
            ),
            width: Math.abs(
              (selectionTool.selectionBox.end.x - selectionTool.selectionBox.start.x) * viewport.zoom
            ),
            height: Math.abs(
              (selectionTool.selectionBox.end.y - selectionTool.selectionBox.start.y) * viewport.zoom
            ),
          }}
        />
      )}
    </div>
  );
};

export default CanvasSurface;