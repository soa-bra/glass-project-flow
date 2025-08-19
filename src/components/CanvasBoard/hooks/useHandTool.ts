import { useState, useCallback, useRef } from 'react';

export interface HandToolController {
  isDragging: boolean;
  startPan: (e: React.MouseEvent) => void;
  updatePan: (e: React.MouseEvent) => void;
  endPan: () => void;
  resetView: () => void;
}

export const useHandTool = (
  onPositionChange: (position: { x: number; y: number }) => void,
  currentPosition: { x: number; y: number }
): HandToolController => {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; startPos: { x: number; y: number } } | null>(null);

  const startPan = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startPos: { ...currentPosition }
    };
  }, [currentPosition]);

  const updatePan = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !dragStartRef.current) return;

    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    const newPosition = {
      x: dragStartRef.current.startPos.x + deltaX,
      y: dragStartRef.current.startPos.y + deltaY
    };

    onPositionChange(newPosition);
  }, [isDragging, onPositionChange]);

  const endPan = useCallback(() => {
    setIsDragging(false);
    dragStartRef.current = null;
  }, []);

  const resetView = useCallback(() => {
    onPositionChange({ x: 0, y: 0 });
  }, [onPositionChange]);

  return {
    isDragging,
    startPan,
    updatePan,
    endPan,
    resetView
  };
};