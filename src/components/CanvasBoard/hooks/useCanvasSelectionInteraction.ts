
import { useState, useCallback } from 'react';

export const useCanvasSelectionInteraction = (canvasRef: React.RefObject<HTMLDivElement>) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState<{ start: { x: number; y: number }; end: { x: number; y: number } } | null>(null);

  const handleSelectionStart = useCallback((e: React.MouseEvent, zoom: number, canvasPosition: { x: number; y: number }, snapEnabled: boolean) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    const y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;

    setIsSelecting(true);
    setSelectionBox({ start: { x, y }, end: { x, y } });
  }, [canvasRef]);

  const handleSelectionMove = useCallback((e: React.MouseEvent, zoom: number, canvasPosition: { x: number; y: number }, snapEnabled: boolean) => {
    if (!isSelecting || !selectionBox) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    const y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;

    setSelectionBox(prev => prev ? { ...prev, end: { x, y } } : null);
  }, [isSelecting, selectionBox, canvasRef]);

  const handleSelectionEnd = useCallback((elements: any[], setSelectedElementIds: (ids: string[]) => void) => {
    if (!selectionBox) {
      setIsSelecting(false);
      return;
    }

    const selectedIds = elements.filter(element => {
      const elementRight = element.x + (element.width || 100);
      const elementBottom = element.y + (element.height || 100);
      const selectionRight = Math.max(selectionBox.start.x, selectionBox.end.x);
      const selectionBottom = Math.max(selectionBox.start.y, selectionBox.end.y);
      const selectionLeft = Math.min(selectionBox.start.x, selectionBox.end.x);
      const selectionTop = Math.min(selectionBox.start.y, selectionBox.end.y);

      return element.x < selectionRight && elementRight > selectionLeft &&
             element.y < selectionBottom && elementBottom > selectionTop;
    }).map(el => el.id);

    setSelectedElementIds(selectedIds);
    setIsSelecting(false);
    setSelectionBox(null);
  }, [selectionBox]);

  return {
    isSelecting,
    selectionBox,
    handleSelectionStart,
    handleSelectionMove,
    handleSelectionEnd
  };
};
