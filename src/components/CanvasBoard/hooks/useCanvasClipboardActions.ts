
import { useCallback } from 'react';
import { CanvasElement } from '../types';

export const useCanvasClipboardActions = (
  selectedElementId: string | null,
  elements: CanvasElement[],
  addElement: (type: string, x: number, y: number, width?: number, height?: number) => void,
  deleteElement: (elementId: string) => void
) => {
  const handleCopy = useCallback(async () => {
    if (!selectedElementId) return;
    
    const element = elements.find(el => el.id === selectedElementId);
    if (!element) return;

    try {
      // Check if clipboard API is available and permissions are granted
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(JSON.stringify({
          type: element.type,
          position: element.position,
          size: element.size,
          content: element.content || '',
          style: element.style || {}
        }));
      }
    } catch (error) {
      console.warn('Clipboard copy not available:', error);
      // Silently fail - clipboard functionality is not critical
    }
  }, [selectedElementId, elements]);

  const handlePaste = useCallback(async () => {
    try {
      // Check if clipboard API is available
      if (!navigator.clipboard || !navigator.clipboard.readText) {
        return;
      }

      const text = await navigator.clipboard.readText();
      
      // Validate that the text is not empty and looks like JSON
      if (!text || !text.trim().startsWith('{')) {
        return;
      }

      const element = JSON.parse(text);
      
      // Validate element structure
      if (element && 
          element.type && 
          element.position && 
          element.size &&
          typeof element.position.x === 'number' &&
          typeof element.position.y === 'number' &&
          typeof element.size.width === 'number' &&
          typeof element.size.height === 'number') {
        
        addElement(
          element.type, 
          element.position.x + 10, 
          element.position.y + 10, 
          element.size.width, 
          element.size.height
        );
      }
    } catch (error) {
      // Silently fail for clipboard errors - don't spam console
      if (error instanceof SyntaxError || error.name === 'NotAllowedError') {
        return;
      }
      console.warn('Clipboard paste error:', error);
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
