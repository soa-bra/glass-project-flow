import { useCallback } from 'react';
import { CanvasElement } from '@/types/canvas';

export interface SelectionToolController {
  startSelection: (e: React.MouseEvent, zoom: number, canvasPosition: { x: number; y: number }, snapEnabled: boolean) => void;
  updateSelection: (e: React.MouseEvent, zoom: number, canvasPosition: { x: number; y: number }, snapEnabled: boolean) => void;
  endSelection: (elements: CanvasElement[], onSelectionChange: (elementIds: string[]) => void) => void;
  handleElementClick: (e: React.MouseEvent, elementId: string, isMultiSelect: boolean) => void;
}

export const useSelectionTool = (
  simplifiedInteraction: any,
  selectedElementIds: string[],
  selectElement: (id: string) => void,
  selectMultiple: (ids: string[]) => void,
  clearSelection: () => void
): SelectionToolController => {
  
  const startSelection = useCallback((e: React.MouseEvent, zoom: number, canvasPosition: { x: number; y: number }, snapEnabled: boolean) => {
    if (simplifiedInteraction?.startSelectionBox) {
      simplifiedInteraction.startSelectionBox(e, zoom, canvasPosition, snapEnabled);
    }
  }, [simplifiedInteraction]);

  const updateSelection = useCallback((e: React.MouseEvent, zoom: number, canvasPosition: { x: number; y: number }, snapEnabled: boolean) => {
    if (simplifiedInteraction?.updateSelectionBox && simplifiedInteraction.isSelecting) {
      simplifiedInteraction.updateSelectionBox(e, zoom, canvasPosition, snapEnabled);
    }
  }, [simplifiedInteraction]);

  const endSelection = useCallback((elements: CanvasElement[], onSelectionChange: (elementIds: string[]) => void) => {
    if (simplifiedInteraction?.endSelectionBox && simplifiedInteraction.isSelecting) {
      simplifiedInteraction.endSelectionBox(elements, onSelectionChange);
    }
  }, [simplifiedInteraction]);

  const handleElementClick = useCallback((e: React.MouseEvent, elementId: string, isMultiSelect: boolean) => {
    e.stopPropagation();
    
    if (isMultiSelect) {
      if (selectedElementIds.includes(elementId)) {
        selectMultiple(selectedElementIds.filter(id => id !== elementId));
      } else {
        selectMultiple([...selectedElementIds, elementId]);
      }
    } else {
      selectElement(elementId);
    }
  }, [selectedElementIds, selectElement, selectMultiple]);

  return {
    startSelection,
    updateSelection,
    endSelection,
    handleElementClick
  };
};