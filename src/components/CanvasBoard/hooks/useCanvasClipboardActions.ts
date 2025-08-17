
import { useCallback } from 'react';
import { CanvasElement } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface UseCanvasClipboardActionsProps {
  selectedElementIds: string[];
  elements: CanvasElement[];
  addElement: (type: string, x: number, y: number, width?: number, height?: number) => void;
  deleteElement: (elementId: string) => void;
  setElements: (updateFn: (elements: CanvasElement[]) => CanvasElement[]) => void;
  saveToHistory: (elements: CanvasElement[]) => void;
}

export const useCanvasClipboardActions = ({
  selectedElementIds,
  elements,
  addElement,
  deleteElement,
  setElements,
  saveToHistory
}: UseCanvasClipboardActionsProps) => {
  const handleCopy = useCallback(async () => {
    if (selectedElementIds.length === 0) return;
    
    const selectedElements = elements.filter(el => selectedElementIds.includes(el.id));
    if (selectedElements.length === 0) return;

    try {
      // Check if clipboard API is available and permissions are granted
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(JSON.stringify(
          selectedElements.map(element => ({
            type: element.type,
            position: element.position,
            size: element.size,
            content: element.content || '',
            style: element.style || {},
            rotation: element.rotation || 0
          }))
        ));
      }
    } catch (error) {
      // Silently fail - clipboard functionality is not critical
    }
  }, [selectedElementIds, elements]);

  const handlePaste = useCallback(async () => {
    try {
      // Check if clipboard API is available
      if (!navigator.clipboard || !navigator.clipboard.readText) {
        return;
      }

      const text = await navigator.clipboard.readText();
      
      // Validate that the text is not empty and looks like JSON
      if (!text || !text.trim().startsWith('[')) {
        return;
      }

      const clipboardElements = JSON.parse(text);
      
      // Validate it's an array of elements
      if (Array.isArray(clipboardElements)) {
        const newElements = clipboardElements.map((element, index) => {
          // Validate element structure
          if (element && 
              element.type && 
              element.position && 
              element.size &&
              typeof element.position.x === 'number' &&
              typeof element.position.y === 'number' &&
              typeof element.size.width === 'number' &&
              typeof element.size.height === 'number') {
            
            return {
              ...element,
              id: uuidv4(),
              position: {
                x: element.position.x + 20 + (index * 10),
                y: element.position.y + 20 + (index * 10)
              },
              parentId: undefined // Reset parent when pasting
            };
          }
          return null;
        }).filter(Boolean);

        if (newElements.length > 0) {
          setElements(prev => {
            const updated = [...prev, ...newElements];
            saveToHistory(updated);
            return updated;
          });
        }
      }
    } catch (error) {
      // Silently fail for clipboard errors - don't spam console
      if (error instanceof SyntaxError || error.name === 'NotAllowedError') {
        return;
      }
      // Handle paste error silently
    }
  }, [setElements, saveToHistory]);

  const handleCut = useCallback(() => {
    handleCopy();
    selectedElementIds.forEach(elementId => {
      deleteElement(elementId);
    });
  }, [handleCopy, deleteElement, selectedElementIds]);

  return {
    handleCopy,
    handlePaste,
    handleCut
  };
};
