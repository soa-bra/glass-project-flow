
import { useState, useCallback } from 'react';
import { CanvasElement } from '../types';

const GRID_SIZE = 24;

export const useCanvasSelectionInteraction = (canvasRef: React.RefObject<HTMLDivElement>) => {
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [selectionBox, setSelectionBox] = useState<{ start: { x: number; y: number }; end: { x: number; y: number } } | null>(null);

  const snapToGrid = (value: number, snapEnabled: boolean) => {
    return snapEnabled ? Math.round(value / GRID_SIZE) * GRID_SIZE : value;
  };

  // Selection box handling for drag selection
  const handleSelectionStart = useCallback((
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
    
    setIsSelecting(true);
    setSelectionBox({ start: { x, y }, end: { x, y } });
  }, [canvasRef]);

  const handleSelectionMove = useCallback((
    e: React.MouseEvent,
    zoom: number,
    canvasPosition: { x: number; y: number },
    snapEnabled: boolean = false
  ) => {
    if (!isSelecting || !selectionBox || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    let x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    let y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
    
    x = snapToGrid(x, snapEnabled);
    y = snapToGrid(y, snapEnabled);
    
    setSelectionBox(prev => prev ? { ...prev, end: { x, y } } : null);
  }, [isSelecting, selectionBox, canvasRef]);

  const handleSelectionEnd = useCallback((
    elements: CanvasElement[],
    onSelectionChange: (elementIds: string[]) => void,
    addToSelection: boolean = false
  ) => {
    if (!isSelecting || !selectionBox) return;
    
    const { start, end } = selectionBox;
    const minX = Math.min(start.x, end.x);
    const maxX = Math.max(start.x, end.x);
    const minY = Math.min(start.y, end.y);
    const maxY = Math.max(start.y, end.y);
    
    // Only proceed if selection box is large enough (avoid accidental selection)
    const selectionArea = (maxX - minX) * (maxY - minY);
    if (selectionArea < 100) {
      setIsSelecting(false);
      setSelectionBox(null);
      // If it's a very small selection, clear the selection
      if (!addToSelection) {
        onSelectionChange([]);
      }
      return;
    }
    
    // Find elements within selection box (partial overlap allowed)
    const selectedElements = elements.filter(element => {
      const elemX = element.position.x;
      const elemY = element.position.y;
      const elemMaxX = elemX + element.size.width;
      const elemMaxY = elemY + element.size.height;
      
      // Check for intersection (not just complete containment)
      return !(elemMaxX < minX || elemX > maxX || elemMaxY < minY || elemY > maxY);
    });
    
    const selectedIds = selectedElements.map(el => el.id);
    onSelectionChange(selectedIds);
    
    setIsSelecting(false);
    setSelectionBox(null);
  }, [isSelecting, selectionBox]);

  // Handle single element click selection
  const handleElementClick = useCallback((
    e: React.MouseEvent,
    elementId: string,
    currentSelection: string[],
    onSelectionChange: (elementIds: string[]) => void
  ) => {
    e.stopPropagation();
    
    // Handle multi-selection with Ctrl/Cmd key
    if (e.ctrlKey || e.metaKey) {
      if (currentSelection.includes(elementId)) {
        // Remove from selection
        onSelectionChange(currentSelection.filter(id => id !== elementId));
      } else {
        // Add to selection
        onSelectionChange([...currentSelection, elementId]);
      }
    } else {
      // Single selection
      onSelectionChange([elementId]);
    }
  }, []);

  // Handle canvas click (clear selection)
  const handleCanvasClick = useCallback((
    onSelectionChange: (elementIds: string[]) => void
  ) => {
    onSelectionChange([]);
  }, []);

  return {
    isSelecting,
    selectionBox,
    handleSelectionStart,
    handleSelectionMove,
    handleSelectionEnd,
    handleElementClick,
    handleCanvasClick
  };
};
