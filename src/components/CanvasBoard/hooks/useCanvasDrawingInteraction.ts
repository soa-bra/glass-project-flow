
import { useState, useCallback } from 'react';

const GRID_SIZE = 24;

export const useCanvasDrawingInteraction = (canvasRef: React.RefObject<HTMLDivElement>) => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [drawEnd, setDrawEnd] = useState<{ x: number; y: number } | null>(null);

  const snapToGrid = (value: number, snapEnabled: boolean) => {
    return snapEnabled ? Math.round(value / GRID_SIZE) * GRID_SIZE : value;
  };

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
    addElement: (type: string, x: number, y: number, width?: number, height?: number) => void
  ) => {
    if (!isDrawing || !drawStart || !drawEnd) return;
    
    const width = Math.abs(drawEnd.x - drawStart.x);
    const height = Math.abs(drawEnd.y - drawStart.y);
    const x = Math.min(drawStart.x, drawEnd.x);
    const y = Math.min(drawStart.y, drawEnd.y);
    
    if (width > 10 && height > 10) {
      addElement('smart-pen', x, y, width, height);
    }
    
    setIsDrawing(false);
    setDrawStart(null);
    setDrawEnd(null);
  }, [isDrawing, drawStart, drawEnd]);

  const handleDragCreate = useCallback((
    e: React.MouseEvent,
    selectedTool: string,
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

  const handleDragCreateMove = useCallback((
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

  const handleDragCreateEnd = useCallback((
    selectedTool: string,
    addElement: (type: string, x: number, y: number, width?: number, height?: number) => void
  ) => {
    if (!isDrawing || !drawStart || !drawEnd) return;
    
    const width = Math.abs(drawEnd.x - drawStart.x);
    const height = Math.abs(drawEnd.y - drawStart.y);
    const x = Math.min(drawStart.x, drawEnd.x);
    const y = Math.min(drawStart.y, drawEnd.y);
    
    if (width > 10 && height > 10) {
      addElement(selectedTool, x, y, width, height);
    }
    
    setIsDrawing(false);
    setDrawStart(null);
    setDrawEnd(null);
  }, [isDrawing, drawStart, drawEnd]);

  const handleTextClick = useCallback((
    e: React.MouseEvent,
    zoom: number,
    canvasPosition: { x: number; y: number },
    addElement: (type: string, x: number, y: number, width?: number, height?: number) => void,
    snapEnabled: boolean = false
  ) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    let x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    let y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
    
    x = snapToGrid(x, snapEnabled);
    y = snapToGrid(y, snapEnabled);
    
    addElement('text', x, y, 200, 40);
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
