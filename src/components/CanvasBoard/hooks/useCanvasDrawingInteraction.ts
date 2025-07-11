
import { useState, useCallback } from 'react';

const GRID_SIZE = 24;

export const useCanvasDrawingInteraction = (canvasRef: React.RefObject<HTMLDivElement>) => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [drawEnd, setDrawEnd] = useState<{ x: number; y: number } | null>(null);

  const snapToGrid = (value: number, snapEnabled: boolean) => {
    return snapEnabled ? Math.round(value / GRID_SIZE) * GRID_SIZE : value;
  };

  // Enhanced drawing for smart pen
  const handleSmartPenStart = useCallback((
    e: React.MouseEvent,
    zoom: number,
    canvasPosition: { x: number; y: number },
    snapEnabled: boolean = false
  ) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    let x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    let y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
    
    x = snapToGrid(x, snapEnabled);
    y = snapToGrid(y, snapEnabled);
    
    setIsDrawing(true);
    setDrawStart({ x, y });
    setDrawEnd({ x, y });
  }, []);

  const handleSmartPenMove = useCallback((
    e: React.MouseEvent,
    zoom: number,
    canvasPosition: { x: number; y: number },
    snapEnabled: boolean = false
  ) => {
    if (!isDrawing || !drawStart || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    let x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    let y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
    
    x = snapToGrid(x, snapEnabled);
    y = snapToGrid(y, snapEnabled);
    
    setDrawEnd({ x, y });
  }, [isDrawing, drawStart]);

  const handleSmartPenEnd = useCallback((
    addElement: (type: string, startX: number, startY: number, endX: number, endY: number) => void
  ) => {
    if (!isDrawing || !drawStart || !drawEnd) return;
    
    // Calculate the line dimensions
    const width = Math.abs(drawEnd.x - drawStart.x);
    const height = Math.abs(drawEnd.y - drawStart.y);
    
    // Only create if there's enough movement
    if (width > 10 || height > 10) {
      addElement('line', drawStart.x, drawStart.y, drawEnd.x, drawEnd.y);
    }
    
    setIsDrawing(false);
    setDrawStart(null);
    setDrawEnd(null);
  }, [isDrawing, drawStart, drawEnd]);

  // Shape and smart element drag creation
  const handleDragCreate = useCallback((
    e: React.MouseEvent,
    selectedTool: string,
    zoom: number,
    canvasPosition: { x: number; y: number },
    snapEnabled: boolean = false
  ) => {
    if (!canvasRef?.current || !['shape', 'smart-element', 'text-box'].includes(selectedTool)) {
      return;
    }
    
    const rect = canvasRef.current.getBoundingClientRect();
    let x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    let y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
    
    x = snapToGrid(x, snapEnabled);
    y = snapToGrid(y, snapEnabled);
    
    setIsDrawing(true);
    setDrawStart({ x, y });
    setDrawEnd({ x, y });
  }, []);

  const handleDragCreateMove = useCallback((
    e: React.MouseEvent,
    zoom: number,
    canvasPosition: { x: number; y: number },
    snapEnabled: boolean = false
  ) => {
    if (!isDrawing || !drawStart || !canvasRef?.current) {
      return; // Silent fail for performance
    }
    
    const rect = canvasRef.current.getBoundingClientRect();
    let x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    let y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
    
    x = snapToGrid(x, snapEnabled);
    y = snapToGrid(y, snapEnabled);
    
    setDrawEnd({ x, y });
  }, [isDrawing, drawStart]);

  const handleDragCreateEnd = useCallback((
    selectedTool: string,
    addElement: (type: string, x: number, y: number, width: number, height: number) => void
  ) => {
    if (!isDrawing || !drawStart || !drawEnd) {
      return;
    }
    
    const width = Math.abs(drawEnd.x - drawStart.x);
    const height = Math.abs(drawEnd.y - drawStart.y);
    const x = Math.min(drawStart.x, drawEnd.x);
    const y = Math.min(drawStart.y, drawEnd.y);
    
    if (width > 10 && height > 10) {
      addElement(selectedTool, x, y, Math.max(width, 30), Math.max(height, 30));
    }
    
    setIsDrawing(false);
    setDrawStart(null);
    setDrawEnd(null);
  }, [isDrawing, drawStart, drawEnd]);

  const handleTextClick = useCallback((
    e: React.MouseEvent,
    zoom: number,
    canvasPosition: { x: number; y: number },
    addElement: (type: string, x: number, y: number) => void,
    snapEnabled: boolean = false
  ) => {
    if (!canvasRef?.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    let x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    let y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
    
    x = snapToGrid(x, snapEnabled);
    y = snapToGrid(y, snapEnabled);
    
    addElement('text', x, y);
  }, []);

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
