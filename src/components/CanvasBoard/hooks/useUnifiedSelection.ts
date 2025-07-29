
import { useState, useCallback } from 'react';
import { CanvasElement } from '@/types/canvas';

export interface UnifiedSelectionState {
  selectedElementIds: string[];
  hasSelection: boolean;
  multipleSelection: boolean;
  selectElement: (elementId: string, addToSelection?: boolean) => void;
  selectMultiple: (elementIds: string[]) => void;
  clearSelection: () => void;
  toggleElementSelection: (elementId: string) => void;
  isSelected: (elementId: string) => boolean;
}

export const useUnifiedSelection = (): UnifiedSelectionState => {
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);

  const hasSelection = selectedElementIds.length > 0;
  const multipleSelection = selectedElementIds.length > 1;

  const selectElement = useCallback((elementId: string, addToSelection: boolean = false) => {
    if (addToSelection) {
      setSelectedElementIds(prev => 
        prev.includes(elementId) ? prev : [...prev, elementId]
      );
    } else {
      setSelectedElementIds([elementId]);
    }
  }, []);

  const selectMultiple = useCallback((elementIds: string[]) => {
    setSelectedElementIds(elementIds);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedElementIds([]);
  }, []);

  const toggleElementSelection = useCallback((elementId: string) => {
    setSelectedElementIds(prev => 
      prev.includes(elementId) 
        ? prev.filter(id => id !== elementId)
        : [...prev, elementId]
    );
  }, []);

  const isSelected = useCallback((elementId: string) => {
    return selectedElementIds.includes(elementId);
  }, [selectedElementIds]);

  return {
    selectedElementIds,
    hasSelection,
    multipleSelection,
    selectElement,
    selectMultiple,
    clearSelection,
    toggleElementSelection,
    isSelected
  };
};
