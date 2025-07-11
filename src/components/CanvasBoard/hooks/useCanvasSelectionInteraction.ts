
import { useState, useCallback } from 'react';

interface SelectionBox {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export const useCanvasSelectionInteraction = (canvasRef: React.RefObject<HTMLDivElement>) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);

  const handleSelectionStart = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsSelecting(true);
    setSelectionBox({
      startX: x,
      startY: y,
      endX: x,
      endY: y
    });
  }, [canvasRef]);

  const handleSelectionMove = useCallback((e: React.MouseEvent) => {
    if (!isSelecting || !selectionBox) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setSelectionBox(prev => prev ? {
      ...prev,
      endX: x,
      endY: y
    } : null);
  }, [isSelecting, selectionBox, canvasRef]);

  const handleSelectionEnd = useCallback(() => {
    setIsSelecting(false);
    setSelectionBox(null);
  }, []);

  return {
    isSelecting,
    selectionBox,
    handleSelectionStart,
    handleSelectionMove,
    handleSelectionEnd
  };
};
