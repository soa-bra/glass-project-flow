import { useState, useCallback } from 'react';

const GRID_SIZE = 24;

export const useRefactoredCanvasInteraction = (canvasRef: React.RefObject<HTMLDivElement>) => {
  // Selection state
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [selectionBox, setSelectionBox] = useState<{ start: { x: number; y: number }; end: { x: number; y: number } } | null>(null);
  
  // Drawing state
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [drawEnd, setDrawEnd] = useState<{ x: number; y: number } | null>(null);
  
  // Element interaction state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState<string>('');

  const snapToGrid = (value: number, snapEnabled: boolean) => {
    return snapEnabled ? Math.round(value / GRID_SIZE) * GRID_SIZE : value;
  };

  // Simplified combined interaction methods
  const resetAllStates = useCallback(() => {
    setIsSelecting(false);
    setIsDrawing(false);
    setIsDragging(false);
    setIsResizing(false);
    setSelectionBox(null);
    setDrawStart(null);
    setDrawEnd(null);
    setDragOffset({ x: 0, y: 0 });
    setResizeHandle('');
  }, []);

  return {
    // States
    isSelecting,
    selectionBox,
    isDrawing,
    drawStart,
    drawEnd,
    isDragging,
    isResizing,
    dragOffset,
    resizeHandle,
    
    // Setters
    setIsSelecting,
    setSelectionBox,
    setIsDrawing,
    setDrawStart,
    setDrawEnd,
    setIsDragging,
    setIsResizing,
    setDragOffset,
    setResizeHandle,
    
    // Utilities
    snapToGrid,
    resetAllStates
  };
};