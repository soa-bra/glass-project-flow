import { useEffect } from 'react';
import { CanvasElement } from '../types';
import { TOOL_KEYBOARD_SHORTCUTS } from '../constants';

interface UseKeyboardControlsProps {
  selectedElementId: string | null;
  elements: CanvasElement[];
  updateElement: (elementId: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (elementId: string) => void;
  setSelectedElementId: (id: string | null) => void;
}

export const useKeyboardControls = ({
  selectedElementId,
  elements,
  updateElement,
  deleteElement,
  setSelectedElementId
}: UseKeyboardControlsProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedElementId) return;

      const element = elements.find(el => el.id === selectedElementId);
      if (!element) return;

      const moveStep = e.shiftKey ? 10 : 1; // حركة أسرع مع Shift

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          updateElement(selectedElementId, {
            position: {
              ...element.position,
              y: element.position.y - moveStep
            }
          });
          break;
        
        case 'ArrowDown':
          e.preventDefault();
          updateElement(selectedElementId, {
            position: {
              ...element.position,
              y: element.position.y + moveStep
            }
          });
          break;
        
        case 'ArrowLeft':
          e.preventDefault();
          updateElement(selectedElementId, {
            position: {
              ...element.position,
              x: element.position.x - moveStep
            }
          });
          break;
        
        case 'ArrowRight':
          e.preventDefault();
          updateElement(selectedElementId, {
            position: {
              ...element.position,
              x: element.position.x + moveStep
            }
          });
          break;
        
        case 'Delete':
        case 'Backspace':
          e.preventDefault();
          deleteElement(selectedElementId);
          setSelectedElementId(null);
          break;
        
        case 'Escape':
          e.preventDefault();
          setSelectedElementId(null);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, elements, updateElement, deleteElement, setSelectedElementId]);
};