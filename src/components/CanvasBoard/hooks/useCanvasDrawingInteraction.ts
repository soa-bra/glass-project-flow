
import { useState, useCallback } from 'react';

const GRID_SIZE = 24;

export const useCanvasDrawingInteraction = (canvasRef: React.RefObject<HTMLDivElement>) => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [drawEnd, setDrawEnd] = useState<{ x: number; y: number } | null>(null);

  const snapToGrid = (value: number, snapEnabled: boolean) => {
    return snapEnabled ? Math.round(value / GRID_SIZE) * GRID_SIZE : value;
  };

  const getCanvasCoordinates = useCallback((
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
  }, []);

  // Smart pen drawing
  const handleSmartPenStart = useCallback((
    e: React.MouseEvent,
    zoom: number,
    canvasPosition: { x: number; y: number },
    snapEnabled: boolean = false
  ) => {
    const coords = getCanvasCoordinates(e, zoom, canvasPosition, snapEnabled);
    setIsDrawing(true);
    setDrawStart(coords);
    setDrawEnd(coords);
  }, [getCanvasCoordinates]);

  const handleSmartPenMove = useCallback((
    e: React.MouseEvent,
    zoom: number,
    canvasPosition: { x: number; y: number },
    snapEnabled: boolean = false
  ) => {
    if (!isDrawing) return;
    
    const coords = getCanvasCoordinates(e, zoom, canvasPosition, snapEnabled);
    setDrawEnd(coords);
  }, [isDrawing, getCanvasCoordinates]);

  const handleSmartPenEnd = useCallback((
    addElement: (type: string, x: number, y: number, width?: number, height?: number) => void
  ) => {
    if (!isDrawing || !drawStart || !drawEnd) return;
    
    // Create a line element
    addElement('line', drawStart.x, drawStart.y, Math.abs(drawEnd.x - drawStart.x), Math.abs(drawEnd.y - drawStart.y));
    
    setIsDrawing(false);
    setDrawStart(null);
    setDrawEnd(null);
  }, [isDrawing, drawStart, drawEnd]);

  // Drag create for shapes and elements
  const handleDragCreate = useCallback((
    e: React.MouseEvent,
    tool: string,
    zoom: number,
    canvasPosition: { x: number; y: number },
    snapEnabled: boolean = false
  ) => {
    const coords = getCanvasCoordinates(e, zoom, canvasPosition, snapEnabled);
    setIsDrawing(true);
    setDrawStart(coords);
    setDrawEnd(coords);
  }, [getCanvasCoordinates]);

  const handleDragCreateMove = useCallback((
    e: React.MouseEvent,
    zoom: number,
    canvasPosition: { x: number; y: number },
    snapEnabled: boolean = false
  ) => {
    if (!isDrawing) return;
    
    const coords = getCanvasCoordinates(e, zoom, canvasPosition, snapEnabled);
    setDrawEnd(coords);
  }, [isDrawing, getCanvasCoordinates]);

  const handleDragCreateEnd = useCallback((
    tool: string,
    addElement: (type: string, x: number, y: number, width?: number, height?: number) => void
  ) => {
    if (!isDrawing || !drawStart || !drawEnd) return;
    
    const width = Math.abs(drawEnd.x - drawStart.x);
    const height = Math.abs(drawEnd.y - drawStart.y);
    const x = Math.min(drawStart.x, drawEnd.x);
    const y = Math.min(drawStart.y, drawEnd.y);
    
    if (width > 10 && height > 10) { // Minimum size threshold
      addElement(tool, x, y, width, height);
    }
    
    setIsDrawing(false);
    setDrawStart(null);
    setDrawEnd(null);
  }, [isDrawing, drawStart, drawEnd]);

  // Text click handler
  const handleTextClick = useCallback((
    e: React.MouseEvent,
    zoom: number,
    canvasPosition: { x: number; y: number },
    addElement: (type: string, x: number, y: number, width?: number, height?: number) => void,
    snapEnabled: boolean = false
  ) => {
    const coords = getCanvasCoordinates(e, zoom, canvasPosition, snapEnabled);
    addElement('text', coords.x, coords.y, 120, 60);
  }, [getCanvasCoordinates]);

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
