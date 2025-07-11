
import { useState, useCallback } from 'react';

export const useCanvasElementInteraction = (canvasRef: React.RefObject<HTMLDivElement>) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  const handleElementMouseDown = useCallback((e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    setIsDragging(true);
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }, [canvasRef]);

  const handleElementMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !dragStart) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    const deltaX = currentX - dragStart.x;
    const deltaY = currentY - dragStart.y;

    // Update element position
    console.log('Moving element by:', { deltaX, deltaY });
  }, [isDragging, dragStart, canvasRef]);

  const handleElementMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setDragStart(null);
  }, []);

  return {
    isDragging,
    isResizing,
    handleElementMouseDown,
    handleElementMouseMove,
    handleElementMouseUp
  };
};
