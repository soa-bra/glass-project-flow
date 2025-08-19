import { useCallback } from 'react';
import { CanvasElement } from '../types';

export interface SelectionOperations {
  copyElements: (elements: CanvasElement[]) => void;
  cutElements: (elements: CanvasElement[]) => void;
  pasteElements: () => CanvasElement[];
  deleteElements: (elementIds: string[]) => void;
  groupElements: (elementIds: string[]) => string; // Returns group ID
  ungroupElements: (groupId: string) => string[]; // Returns ungrouped element IDs
  lockElements: (elementIds: string[]) => void;
  unlockElements: (elementIds: string[]) => void;
  moveElements: (elementIds: string[], direction: 'up' | 'down' | 'left' | 'right', distance: number) => void;
  rotateElements: (elementIds: string[], angle: number) => void;
  flipElements: (elementIds: string[], direction: 'horizontal' | 'vertical') => void;
  alignElements: (elementIds: string[], direction: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
}

interface UseSelectionOperationsProps {
  elements: CanvasElement[];
  onElementsChange: (elements: CanvasElement[]) => void;
  onElementUpdate: (elementId: string, updates: any) => void;
}

export const useSelectionOperations = ({
  elements,
  onElementsChange,
  onElementUpdate
}: UseSelectionOperationsProps): SelectionOperations => {
  // الحافظة المؤقتة للعناصر المنسوخة
  let clipboard: CanvasElement[] = [];

  const copyElements = useCallback((selectedElements: CanvasElement[]) => {
    clipboard = [...selectedElements];
  }, []);

  const cutElements = useCallback((selectedElements: CanvasElement[]) => {
    clipboard = [...selectedElements];
    const elementIds = selectedElements.map(el => el.id);
    const updatedElements = elements.filter(el => !elementIds.includes(el.id));
    onElementsChange(updatedElements);
  }, [elements, onElementsChange]);

  const pasteElements = useCallback((): CanvasElement[] => {
    if (clipboard.length === 0) return [];

    const newElements = clipboard.map(el => ({
      ...el,
      id: `${el.id}_copy_${Date.now()}`,
      position: {
        x: el.position.x + 20,
        y: el.position.y + 20
      }
    }));

    onElementsChange([...elements, ...newElements]);
    return newElements;
  }, [clipboard, elements, onElementsChange]);

  const deleteElements = useCallback((elementIds: string[]) => {
    const updatedElements = elements.filter(el => !elementIds.includes(el.id));
    onElementsChange(updatedElements);
  }, [elements, onElementsChange]);

  const groupElements = useCallback((elementIds: string[]): string => {
    const groupId = `group_${Date.now()}`;
    
    // تحديث العناصر لتصبح جزءاً من المجموعة
    elementIds.forEach(elementId => {
      onElementUpdate(elementId, { groupId });
    });

    return groupId;
  }, [onElementUpdate]);

  const ungroupElements = useCallback((groupId: string): string[] => {
    const groupedElements = elements.filter(el => (el as any).groupId === groupId);
    
    // إزالة المجموعة من العناصر
    groupedElements.forEach(element => {
      onElementUpdate(element.id, { groupId: null });
    });

    return groupedElements.map(el => el.id);
  }, [elements, onElementUpdate]);

  const lockElements = useCallback((elementIds: string[]) => {
    elementIds.forEach(elementId => {
      onElementUpdate(elementId, { locked: true });
    });
  }, [onElementUpdate]);

  const unlockElements = useCallback((elementIds: string[]) => {
    elementIds.forEach(elementId => {
      onElementUpdate(elementId, { locked: false });
    });
  }, [onElementUpdate]);

  const moveElements = useCallback((elementIds: string[], direction: 'up' | 'down' | 'left' | 'right', distance: number) => {
    elementIds.forEach(elementId => {
      const element = elements.find(el => el.id === elementId);
      if (!element) return;

      let newPosition = { ...element.position };

      switch (direction) {
        case 'up':
          newPosition.y -= distance;
          break;
        case 'down':
          newPosition.y += distance;
          break;
        case 'left':
          newPosition.x -= distance;
          break;
        case 'right':
          newPosition.x += distance;
          break;
      }

      onElementUpdate(elementId, { position: newPosition });
    });
  }, [elements, onElementUpdate]);

  const rotateElements = useCallback((elementIds: string[], angle: number) => {
    elementIds.forEach(elementId => {
      const element = elements.find(el => el.id === elementId);
      if (!element) return;

      const currentRotation = (element as any).rotation || 0;
      const newRotation = (currentRotation + angle) % 360;
      
      onElementUpdate(elementId, { rotation: newRotation });
    });
  }, [elements, onElementUpdate]);

  const flipElements = useCallback((elementIds: string[], direction: 'horizontal' | 'vertical') => {
    elementIds.forEach(elementId => {
      const element = elements.find(el => el.id === elementId);
      if (!element) return;

      const currentFlip = (element as any).flip || { horizontal: false, vertical: false };
      const newFlip = {
        ...currentFlip,
        [direction]: !currentFlip[direction]
      };

      onElementUpdate(elementId, { flip: newFlip });
    });
  }, [elements, onElementUpdate]);

  const alignElements = useCallback((elementIds: string[], direction: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (elementIds.length < 2) return;

    const selectedElements = elements.filter(el => elementIds.includes(el.id));
    
    let referenceValue: number;

    switch (direction) {
      case 'left':
        referenceValue = Math.min(...selectedElements.map(el => el.position.x));
        selectedElements.forEach(el => {
          onElementUpdate(el.id, { 
            position: { ...el.position, x: referenceValue } 
          });
        });
        break;
      case 'right':
        referenceValue = Math.max(...selectedElements.map(el => el.position.x + el.size.width));
        selectedElements.forEach(el => {
          onElementUpdate(el.id, { 
            position: { ...el.position, x: referenceValue - el.size.width } 
          });
        });
        break;
      case 'center':
        const centerX = selectedElements.reduce((sum, el) => 
          sum + el.position.x + el.size.width / 2, 0) / selectedElements.length;
        selectedElements.forEach(el => {
          onElementUpdate(el.id, { 
            position: { ...el.position, x: centerX - el.size.width / 2 } 
          });
        });
        break;
      case 'top':
        referenceValue = Math.min(...selectedElements.map(el => el.position.y));
        selectedElements.forEach(el => {
          onElementUpdate(el.id, { 
            position: { ...el.position, y: referenceValue } 
          });
        });
        break;
      case 'bottom':
        referenceValue = Math.max(...selectedElements.map(el => el.position.y + el.size.height));
        selectedElements.forEach(el => {
          onElementUpdate(el.id, { 
            position: { ...el.position, y: referenceValue - el.size.height } 
          });
        });
        break;
      case 'middle':
        const centerY = selectedElements.reduce((sum, el) => 
          sum + el.position.y + el.size.height / 2, 0) / selectedElements.length;
        selectedElements.forEach(el => {
          onElementUpdate(el.id, { 
            position: { ...el.position, y: centerY - el.size.height / 2 } 
          });
        });
        break;
    }
  }, [elements, onElementUpdate]);

  return {
    copyElements,
    cutElements,
    pasteElements,
    deleteElements,
    groupElements,
    ungroupElements,
    lockElements,
    unlockElements,
    moveElements,
    rotateElements,
    flipElements,
    alignElements
  };
};