
import { useState, useCallback } from 'react';

const GRID_SIZE = 24;

export const useCanvasDrawingInteraction = (canvasRef: React.RefObject<HTMLDivElement>) => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [drawEnd, setDrawEnd] = useState<{ x: number; y: number } | null>(null);

  const snapToGrid = (value: number, snapEnabled: boolean) => {
    return snapEnabled ? Math.round(value / GRID_SIZE) * GRID_SIZE : value;
  };

  const getCanvasPosition = useCallback((
    e: React.MouseEvent,
    zoom: number,
    canvasPosition: { x: number; y: number },
    snapEnabled: boolean = false
  ) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const rect = canvasRef.current.getBoundingClientRect();
    let x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    let y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
    
    x = snapToGrid(x, snapEnabled);
    y = snapToGrid(y, snapEnabled);
    
    return { x, y };
  }, [canvasRef]);

  // Smart pen drawing
  const handleSmartPenStart = useCallback((
    e: React.MouseEvent,
    zoom: number,
    canvasPosition: { x: number; y: number },
    snapEnabled: boolean = false
  ) => {
    const pos = getCanvasPosition(e, zoom, canvasPosition, snapEnabled);
    setIsDrawing(true);
    setDrawStart(pos);
    setDrawEnd(pos);
  }, [getCanvasPosition]);

  const handleSmartPenMove = useCallback((
    e: React.MouseEvent,
    zoom: number,
    canvasPosition: { x: number; y: number },
    snapEnabled: boolean = false
  ) => {
    if (!isDrawing) return;
    
    const pos = getCanvasPosition(e, zoom, canvasPosition, snapEnabled);
    setDrawEnd(pos);
  }, [isDrawing, getCanvasPosition]);

  const handleSmartPenEnd = useCallback((
    addElement: (type: string, startX: number, startY: number, endX: number, endY: number) => void
  ) => {
    if (isDrawing && drawStart && drawEnd) {
      addElement('line', drawStart.x, drawStart.y, drawEnd.x, drawEnd.y);
    }
    
    setIsDrawing(false);
    setDrawStart(null);
    setDrawEnd(null);
  }, [isDrawing, drawStart, drawEnd]);

  // Drag to create elements
  const handleDragCreate = useCallback((
    e: React.MouseEvent,
    toolType: string,
    zoom: number,
    canvasPosition: { x: number; y: number },
    snapEnabled: boolean = false
  ) => {
    const pos = getCanvasPosition(e, zoom, canvasPosition, snapEnabled);
    setIsDrawing(true);
    setDrawStart(pos);
    setDrawEnd(pos);
  }, [getCanvasPosition]);

  const handleDragCreateMove = useCallback((
    e: React.MouseEvent,
    zoom: number,
    canvasPosition: { x: number; y: number },
    snapEnabled: boolean = false
  ) => {
    if (!isDrawing) return;
    
    const pos = getCanvasPosition(e, zoom, canvasPosition, snapEnabled);
    setDrawEnd(pos);
  }, [isDrawing, getCanvasPosition]);

  const handleDragCreateEnd = useCallback((
    toolType: string,
    addElement: (type: string, x: number, y: number, width: number, height: number) => void
  ) => {
    if (isDrawing && drawStart && drawEnd) {
      const width = Math.abs(drawEnd.x - drawStart.x);
      const height = Math.abs(drawEnd.y - drawStart.y);
      const x = Math.min(drawStart.x, drawEnd.x);
      const y = Math.min(drawStart.y, drawEnd.y);
      
      addElement(toolType, x, y, Math.max(width, 30), Math.max(height, 30));
    }
    
    setIsDrawing(false);
    setDrawStart(null);
    setDrawEnd(null);
  }, [isDrawing, drawStart, drawEnd]);

  // Text click handling
  const handleTextClick = useCallback((
    e: React.MouseEvent,
    zoom: number,
    canvasPosition: { x: number; y: number },
    addElement: (type: string, x: number, y: number) => void,
    snapEnabled: boolean = false
  ) => {
    const pos = getCanvasPosition(e, zoom, canvasPosition, snapEnabled);
    addElement('text', pos.x, pos.y);
  }, [getCanvasPosition]);

  return {
    isDrawing,
    drawStart,
    drawEnd,
    handleSmartPenStart,
    handleSmartPenMove,
    handleSmartPenEnd,
    handleDragCreate,
    handleDragCreateMove,
    handleDragCreateEnd,
    handleTextClick
  };
};
