
import { useState, useCallback } from 'react';

interface DrawPoint {
  x: number;
  y: number;
}

export const useCanvasDrawingInteraction = (canvasRef: React.RefObject<HTMLDivElement>) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<DrawPoint | null>(null);
  const [drawEnd, setDrawEnd] = useState<DrawPoint | null>(null);

  const getCanvasPoint = useCallback((e: React.MouseEvent): DrawPoint | null => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return null;

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }, [canvasRef]);

  const handleSmartPenStart = useCallback((e: React.MouseEvent) => {
    const point = getCanvasPoint(e);
    if (!point) return;

    setIsDrawing(true);
    setDrawStart(point);
    setDrawEnd(point);
  }, [getCanvasPoint]);

  const handleSmartPenMove = useCallback((e: React.MouseEvent) => {
    if (!isDrawing) return;
    
    const point = getCanvasPoint(e);
    if (!point) return;

    setDrawEnd(point);
  }, [isDrawing, getCanvasPoint]);

  const handleSmartPenEnd = useCallback(() => {
    setIsDrawing(false);
    setDrawStart(null);
    setDrawEnd(null);
  }, []);

  const handleDragCreate = useCallback((e: React.MouseEvent) => {
    const point = getCanvasPoint(e);
    if (!point) return;

    setIsDrawing(true);
    setDrawStart(point);
    setDrawEnd(point);
  }, [getCanvasPoint]);

  const handleDragCreateMove = useCallback((e: React.MouseEvent) => {
    if (!isDrawing) return;
    
    const point = getCanvasPoint(e);
    if (!point) return;

    setDrawEnd(point);
  }, [isDrawing, getCanvasPoint]);

  const handleDragCreateEnd = useCallback(() => {
    setIsDrawing(false);
    setDrawStart(null);
    setDrawEnd(null);
  }, []);

  const handleTextClick = useCallback((e: React.MouseEvent) => {
    const point = getCanvasPoint(e);
    if (!point) return;

    // Create text element at clicked position
    console.log('Creating text at:', point);
  }, [getCanvasPoint]);

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
