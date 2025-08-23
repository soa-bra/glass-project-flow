import { useCallback, useEffect } from 'react';
import { useToolsStore } from '../store/tools.store';
import { useCanvasStore } from '../store/canvas.store';
import { useSnapping } from './useSnapping';
import { Position } from '../types/canvas';

export const useToolInteraction = () => {
  const { 
    activeTool, 
    selectionTool, 
    panTool, 
    zoomTool,
    startDragging,
    stopDragging,
    startPanning,
    stopPanning,
    updatePanPosition,
    startZooming,
    stopZooming
  } = useToolsStore();
  
  const { 
    viewport, 
    setViewport, 
    grid,
    addElement,
    updateElement 
  } = useCanvasStore();

  const { snap } = useSnapping({
    snapToGrid: grid.snapEnabled,
    snapToObjects: false,
    gridSize: grid.size,
    snapThreshold: 8
  });

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const position: Position = {
      x: (event.clientX - rect.left - viewport.x) / viewport.zoom,
      y: (event.clientY - rect.top - viewport.y) / viewport.zoom
    };

    switch (activeTool) {
      case 'select':
        if (!selectionTool.isDragging) {
          startDragging(position);
        }
        break;
      
      case 'pan':
        startPanning(position);
        break;
      
      case 'zoom':
        startZooming(position);
        break;
      
      case 'text':
        // Add text element at clicked position
        const snappedPos = snap(position);
        addElement({
          type: 'text',
          transform: {
            x: snappedPos.x,
            y: snappedPos.y,
            scale: 1,
            rotation: 0
          },
          style: {
            fontSize: 16,
            fontFamily: 'IBM Plex Sans Arabic',
            textAlign: 'right'
          },
          data: { text: 'نص جديد' },
          permissions: {
            movable: true,
            resizable: true,
            editable: true,
            deletable: true
          },
          zIndex: 1,
          createdBy: 'current-user'
        });
        break;
      
      case 'shapes':
        // Start drawing shape
        const shapePos = snap(position);
        addElement({
          type: 'shape',
          transform: {
            x: shapePos.x,
            y: shapePos.y,
            scale: 1,
            rotation: 0
          },
          style: {
            fill: 'transparent',
            stroke: 'hsl(var(--foreground))',
            strokeWidth: 2
          },
          data: { shapeType: 'rectangle', width: 100, height: 100 },
          permissions: {
            movable: true,
            resizable: true,
            editable: true,
            deletable: true
          },
          zIndex: 1,
          createdBy: 'current-user'
        });
        break;
    }
  }, [
    activeTool,
    selectionTool.isDragging,
    viewport,
    snap,
    startDragging,
    startPanning,
    startZooming,
    addElement
  ]);

  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const position: Position = {
      x: (event.clientX - rect.left - viewport.x) / viewport.zoom,
      y: (event.clientY - rect.top - viewport.y) / viewport.zoom
    };

    switch (activeTool) {
      case 'pan':
        if (panTool.isPanning) {
          updatePanPosition(position);
          // Update viewport position
          const deltaX = position.x - (panTool.lastPosition?.x || 0);
          const deltaY = position.y - (panTool.lastPosition?.y || 0);
          
          setViewport({
            ...viewport,
            x: viewport.x + deltaX * viewport.zoom,
            y: viewport.y + deltaY * viewport.zoom
          });
        }
        break;
    }
  }, [
    activeTool,
    panTool.isPanning,
    panTool.lastPosition,
    viewport,
    updatePanPosition,
    setViewport
  ]);

  const handlePointerUp = useCallback(() => {
    switch (activeTool) {
      case 'select':
        if (selectionTool.isDragging) {
          stopDragging();
        }
        break;
      
      case 'pan':
        if (panTool.isPanning) {
          stopPanning();
        }
        break;
      
      case 'zoom':
        if (zoomTool.isZooming) {
          stopZooming();
        }
        break;
    }
  }, [
    activeTool,
    selectionTool.isDragging,
    panTool.isPanning,
    zoomTool.isZooming,
    stopDragging,
    stopPanning,
    stopZooming
  ]);

  const handleWheel = useCallback((event: React.WheelEvent) => {
    event.preventDefault();
    
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.min(Math.max(viewport.zoom * zoomFactor, 0.1), 5);
    
    // Zoom towards cursor position
    const rect = event.currentTarget.getBoundingClientRect();
    const cursorX = event.clientX - rect.left;
    const cursorY = event.clientY - rect.top;
    
    const zoomRatio = newZoom / viewport.zoom;
    const newX = cursorX - (cursorX - viewport.x) * zoomRatio;
    const newY = cursorY - (cursorY - viewport.y) * zoomRatio;
    
    setViewport({
      ...viewport,
      zoom: newZoom,
      x: newX,
      y: newY
    });
  }, [viewport, setViewport]);

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleWheel
  };
};