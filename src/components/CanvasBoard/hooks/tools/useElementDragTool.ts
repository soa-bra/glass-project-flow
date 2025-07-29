import { useCallback } from 'react';
import { CanvasElement } from '@/types/canvas';

export interface ElementDragController {
  startElementDrag: (e: React.MouseEvent, elementId: string, element: CanvasElement, zoom: number, canvasPosition: { x: number; y: number }) => void;
  updateElementDrag: (e: React.MouseEvent, zoom: number, canvasPosition: { x: number; y: number }, snapEnabled: boolean) => void;
  endElementDrag: () => void;
  isDragging: boolean;
}

export const useElementDragTool = (
  simplifiedInteraction: any,
  elements: CanvasElement[],
  updateElement: (elementId: string, updates: any) => void
): ElementDragController => {
  
  const startElementDrag = useCallback((e: React.MouseEvent, elementId: string, element: CanvasElement, zoom: number, canvasPosition: { x: number; y: number }) => {
    if (simplifiedInteraction?.startElementDrag) {
      // Element already has the correct format with position and size
      simplifiedInteraction.startElementDrag(e, elementId, element, zoom, canvasPosition);
    }
  }, [simplifiedInteraction]);

  const updateElementDrag = useCallback((e: React.MouseEvent, zoom: number, canvasPosition: { x: number; y: number }, snapEnabled: boolean) => {
    if (simplifiedInteraction?.updateElementDrag && simplifiedInteraction.isDragging) {
      simplifiedInteraction.updateElementDrag(e, zoom, canvasPosition, updateElement, snapEnabled);
    }
  }, [simplifiedInteraction, updateElement]);

  const endElementDrag = useCallback(() => {
    if (simplifiedInteraction?.endElementDrag) {
      simplifiedInteraction.endElementDrag();
    }
  }, [simplifiedInteraction]);

  return {
    startElementDrag,
    updateElementDrag,
    endElementDrag,
    isDragging: simplifiedInteraction?.isDragging || false
  };
};