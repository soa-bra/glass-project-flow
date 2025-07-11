
import { useState, useCallback } from 'react';

export const useCanvasElementInteraction = (canvasRef: React.RefObject<HTMLDivElement>) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleElementMouseDown = useCallback((
    e: React.MouseEvent, 
    elementId: string, 
    selectedTool: string, 
    elements: any[], 
    zoom: number, 
    canvasPosition: { x: number; y: number }, 
    setSelectedElementId: (id: string | null) => void, 
    selectedElementIds: string[], 
    setSelectedElementIds: (ids: string[]) => void
  ) => {
    e.stopPropagation();
    
    if (selectedTool !== 'select') return;

    setSelectedElementId(elementId);
    
    if (!selectedElementIds.includes(elementId)) {
      setSelectedElementIds([elementId]);
    }

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const element = elements.find(el => el.id === elementId);
    if (!element) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const elementX = element.x * (zoom / 100) + canvasPosition.x;
    const elementY = element.y * (zoom / 100) + canvasPosition.y;

    setDragOffset({ x: mouseX - elementX, y: mouseY - elementY });
    setIsDragging(true);
  }, [canvasRef]);

  const handleElementMouseMove = useCallback((
    e: React.MouseEvent, 
    selectedElementIds: string[], 
    zoom: number, 
    canvasPosition: { x: number; y: number }, 
    updateElement: (elementId: string, updates: any) => void, 
    snapEnabled: boolean
  ) => {
    if (!isDragging || selectedElementIds.length === 0) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    let newX = (mouseX - dragOffset.x - canvasPosition.x) / (zoom / 100);
    let newY = (mouseY - dragOffset.y - canvasPosition.y) / (zoom / 100);

    if (snapEnabled) {
      const gridSize = 24;
      newX = Math.round(newX / gridSize) * gridSize;
      newY = Math.round(newY / gridSize) * gridSize;
    }

    selectedElementIds.forEach(elementId => {
      updateElement(elementId, { x: newX, y: newY });
    });
  }, [isDragging, dragOffset, canvasRef]);

  const handleElementMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  return {
    isDragging,
    isResizing,
    handleElementMouseDown,
    handleElementMouseMove,
    handleElementMouseUp
  };
};
