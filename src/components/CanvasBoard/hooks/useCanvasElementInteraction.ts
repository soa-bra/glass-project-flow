
import { useState, useCallback } from 'react';
import { CanvasElement } from '../types';

const GRID_SIZE = 24;

export const useCanvasElementInteraction = (canvasRef: React.RefObject<HTMLDivElement>) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState<string>('');
  const [initialPositions, setInitialPositions] = useState<Map<string, { x: number; y: number }>>(new Map());

  const snapToGrid = (value: number, snapEnabled: boolean) => {
    return snapEnabled ? Math.round(value / GRID_SIZE) * GRID_SIZE : value;
  };

  const handleElementMouseDown = useCallback((
    e: React.MouseEvent,
    elementId: string,
    selectedTool: string,
    elements: CanvasElement[],
    zoom: number,
    canvasPosition: { x: number; y: number },
    setSelectedElementId: (id: string | null) => void,
    selectedElementIds: string[],
    setSelectedElementIds: (ids: string[]) => void
  ) => {
    if (selectedTool !== 'select') return;
    
    e.stopPropagation();
    
    const element = elements.find(el => el.id === elementId);
    if (!element || element.locked) return;
    
    // Handle multi-selection with Ctrl/Cmd key
    if (e.ctrlKey || e.metaKey) {
      if (selectedElementIds.includes(elementId)) {
        const newSelection = selectedElementIds.filter(id => id !== elementId);
        setSelectedElementIds(newSelection);
        setSelectedElementId(newSelection.length > 0 ? newSelection[0] : null);
      } else {
        const newSelection = [...selectedElementIds, elementId];
        setSelectedElementIds(newSelection);
        setSelectedElementId(elementId);
      }
    } else {
      // Single selection or start dragging if already selected
      if (!selectedElementIds.includes(elementId)) {
        setSelectedElementId(elementId);
        setSelectedElementIds([elementId]);
      }
    }
    
    const rect = canvasRef?.current?.getBoundingClientRect();
    if (!rect) return;
    
    const mouseX = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    const mouseY = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
    
    // Store initial positions for all selected elements
    const elementsToMove = selectedElementIds.includes(elementId) ? selectedElementIds : [elementId];
    const positions = new Map<string, { x: number; y: number }>();
    
    elementsToMove.forEach(id => {
      const el = elements.find(e => e.id === id);
      if (el) {
        positions.set(id, { x: el.position.x, y: el.position.y });
      }
    });
    
    setInitialPositions(positions);
    setIsDragging(true);
    setDragOffset({
      x: mouseX - element.position.x,
      y: mouseY - element.position.y
    });
  }, []);

  const handleElementMouseMove = useCallback((
    e: React.MouseEvent,
    selectedElementIds: string[],
    zoom: number,
    canvasPosition: { x: number; y: number },
    updateElement: (elementId: string, updates: Partial<CanvasElement>) => void,
    snapEnabled: boolean = false
  ) => {
    if (!isDragging || selectedElementIds.length === 0 || !canvasRef?.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    let mouseX = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    let mouseY = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
    
    let newX = mouseX - dragOffset.x;
    let newY = mouseY - dragOffset.y;
    
    newX = snapToGrid(newX, snapEnabled);
    newY = snapToGrid(newY, snapEnabled);
    
    // Calculate the delta from the primary element's initial position
    const primaryElementId = selectedElementIds[0];
    const primaryInitialPos = initialPositions.get(primaryElementId);
    
    if (primaryInitialPos) {
      const deltaX = newX - primaryInitialPos.x;
      const deltaY = newY - primaryInitialPos.y;
      
      // Move all selected elements by the same delta
      selectedElementIds.forEach(elementId => {
        const initialPos = initialPositions.get(elementId);
        if (initialPos) {
          updateElement(elementId, {
            position: { 
              x: initialPos.x + deltaX, 
              y: initialPos.y + deltaY 
            }
          });
        }
      });
    }
  }, [isDragging, dragOffset, initialPositions]);

  const handleElementMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    setIsResizing(false);
    setResizeHandle('');
    setInitialPositions(new Map());
  }, []);

  return {
    isDragging,
    isResizing,
    dragOffset,
    resizeHandle,
    handleElementMouseDown,
    handleElementMouseMove,
    handleElementMouseUp
  };
};
