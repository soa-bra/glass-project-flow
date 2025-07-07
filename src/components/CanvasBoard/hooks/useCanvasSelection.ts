import { useCallback } from 'react';
import { CanvasElement } from '../types';

export const useCanvasSelection = (
  selectedElements: string[],
  elements: CanvasElement[],
  fitPadding: number,
  setZoom: (zoom: number) => void,
  setCanvasPosition: (position: { x: number; y: number }) => void
) => {
  // Enhanced zoom handlers  
  const handleFitToSelection = useCallback(() => {
    if (selectedElements.length === 0) return;
    
    const selectedElementObjects = selectedElements
      .map(id => elements.find(el => el.id === id))
      .filter(Boolean) as CanvasElement[];
    
    if (selectedElementObjects.length === 0) return;

    // Calculate bounding box of selected elements
    const minX = Math.min(...selectedElementObjects.map(el => el.position.x));
    const minY = Math.min(...selectedElementObjects.map(el => el.position.y));
    const maxX = Math.max(...selectedElementObjects.map(el => el.position.x + el.size.width));
    const maxY = Math.max(...selectedElementObjects.map(el => el.position.y + el.size.height));
    
    const selectionWidth = maxX - minX;
    const selectionHeight = maxY - minY;
    
    // Calculate zoom to fit selection with padding
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    const zoomX = (canvasWidth - fitPadding * 2) / selectionWidth * 100;
    const zoomY = (canvasHeight - fitPadding * 2) / selectionHeight * 100;
    const newZoom = Math.min(zoomX, zoomY, 300); // Max 300%
    
    setZoom(newZoom);
    setCanvasPosition({
      x: -(minX + selectionWidth / 2) + canvasWidth / 2,
      y: -(minY + selectionHeight / 2) + canvasHeight / 2
    });
  }, [selectedElements, elements, fitPadding, setZoom, setCanvasPosition]);

  return {
    handleFitToSelection,
  };
};