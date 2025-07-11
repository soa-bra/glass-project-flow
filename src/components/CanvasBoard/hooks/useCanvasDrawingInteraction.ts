
import { useState, useCallback } from 'react';

export const useCanvasDrawingInteraction = (canvasRef: React.RefObject<HTMLDivElement>) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [drawEnd, setDrawEnd] = useState<{ x: number; y: number } | null>(null);

  const handleSmartPenStart = useCallback((e: React.MouseEvent, zoom: number, canvasPosition: { x: number; y: number }, snapEnabled: boolean) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    const y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;

    setIsDrawing(true);
    setDrawStart({ x, y });
    setDrawEnd({ x, y });
  }, [canvasRef]);

  const handleSmartPenMove = useCallback((e: React.MouseEvent, zoom: number, canvasPosition: { x: number; y: number }, snapEnabled: boolean) => {
    if (!isDrawing) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    const y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;

    setDrawEnd({ x, y });
  }, [isDrawing, canvasRef]);

  const handleSmartPenEnd = useCallback((addElement: (type: string, startX: number, startY: number, endX: number, endY: number) => void) => {
    if (drawStart && drawEnd) {
      addElement('pen', drawStart.x, drawStart.y, drawEnd.x, drawEnd.y);
    }
    setIsDrawing(false);
    setDrawStart(null);
    setDrawEnd(null);
  }, [drawStart, drawEnd]);

  const handleDragCreate = useCallback((e: React.MouseEvent, tool: string, zoom: number, canvasPosition: { x: number; y: number }, snapEnabled: boolean) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    const y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;

    setIsDrawing(true);
    setDrawStart({ x, y });
    setDrawEnd({ x, y });
  }, [canvasRef]);

  const handleDragCreateMove = useCallback((e: React.MouseEvent, zoom: number, canvasPosition: { x: number; y: number }, snapEnabled: boolean) => {
    if (!isDrawing) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    const y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;

    setDrawEnd({ x, y });
  }, [isDrawing, canvasRef]);

  const handleDragCreateEnd = useCallback((tool: string, addElement: (type: string, x: number, y: number, width: number, height: number) => void) => {
    if (drawStart && drawEnd) {
      const width = Math.abs(drawEnd.x - drawStart.x);
      const height = Math.abs(drawEnd.y - drawStart.y);
      const x = Math.min(drawStart.x, drawEnd.x);
      const y = Math.min(drawStart.y, drawEnd.y);
      
      addElement(tool, x, y, Math.max(width, 30), Math.max(height, 30));
    }
    setIsDrawing(false);
    setDrawStart(null);
    setDrawEnd(null);
  }, [drawStart, drawEnd]);

  const handleTextClick = useCallback((e: React.MouseEvent, zoom: number, canvasPosition: { x: number; y: number }, addElement: (type: string, x: number, y: number) => void, snapEnabled: boolean) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    const y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;

    addElement('text', x, y);
  }, [canvasRef]);

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
