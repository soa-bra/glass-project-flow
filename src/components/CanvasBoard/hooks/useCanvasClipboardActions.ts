
import { useCallback } from 'react';
import { CanvasElement } from '../types';

export const useCanvasClipboardActions = (
  selectedElementId: string | null,
  elements: CanvasElement[],
  addElement: (type: string, x: number, y: number, width?: number, height?: number) => void,
  deleteElement: (elementId: string) => void
) => {
  const handleCopy = useCallback(() => {
    if (selectedElementId) {
      const element = elements.find(el => el.id === selectedElementId);
      if (element) {
        navigator.clipboard.writeText(JSON.stringify(element));
      }
    }
  }, [selectedElementId, elements]);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      const element = JSON.parse(text);
      if (element && element.type) {
        addElement(element.type, element.position.x + 10, element.position.y + 10, element.size.width, element.size.height);
      }
    } catch (error) {
      console.error('Could not paste element', error);
    }
  }, [addElement]);

  const handleCut = useCallback(() => {
    handleCopy();
    if (selectedElementId) {
      deleteElement(selectedElementId);
    }
  }, [handleCopy, deleteElement, selectedElementId]);

  return {
    handleCopy,
    handlePaste,
    handleCut
  };
};
