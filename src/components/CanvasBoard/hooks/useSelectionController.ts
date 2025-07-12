import { useState, useCallback } from 'react';
import { CanvasElement } from '../types';

export interface SelectionController {
  selectedElements: CanvasElement[];
  selectedElementIds: string[];
  hasSelection: boolean;
  multipleSelection: boolean;
  selectElement: (element: CanvasElement) => void;
  selectMultipleElements: (elements: CanvasElement[]) => void;
  addToSelection: (element: CanvasElement) => void;
  removeFromSelection: (elementId: string) => void;
  clearSelection: () => void;
  selectAll: (allElements: CanvasElement[]) => void;
  isSelected: (elementId: string) => boolean;
}

export const useSelectionController = (): SelectionController => {
  const [selectedElements, setSelectedElements] = useState<CanvasElement[]>([]);

  const selectedElementIds = selectedElements.map(el => el.id);
  const hasSelection = selectedElements.length > 0;
  const multipleSelection = selectedElements.length > 1;

  const selectElement = useCallback((element: CanvasElement) => {
    setSelectedElements([element]);
  }, []);

  const selectMultipleElements = useCallback((elements: CanvasElement[]) => {
    setSelectedElements(elements);
  }, []);

  const addToSelection = useCallback((element: CanvasElement) => {
    setSelectedElements(prev => {
      const exists = prev.find(el => el.id === element.id);
      if (exists) return prev;
      return [...prev, element];
    });
  }, []);

  const removeFromSelection = useCallback((elementId: string) => {
    setSelectedElements(prev => prev.filter(el => el.id !== elementId));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedElements([]);
  }, []);

  const selectAll = useCallback((allElements: CanvasElement[]) => {
    setSelectedElements(allElements);
  }, []);

  const isSelected = useCallback((elementId: string) => {
    return selectedElementIds.includes(elementId);
  }, [selectedElementIds]);

  return {
    selectedElements,
    selectedElementIds,
    hasSelection,
    multipleSelection,
    selectElement,
    selectMultipleElements,
    addToSelection,
    removeFromSelection,
    clearSelection,
    selectAll,
    isSelected
  };
};