/**
 * Selection Slice - إدارة التحديد والحافظة
 */

import { StateCreator } from 'zustand';
import type { CanvasElement } from '@/types/canvas';

export interface SelectionSlice {
  selectedElementIds: string[];
  clipboard: CanvasElement[];
  
  // Selection Actions
  selectElement: (elementId: string, multiSelect?: boolean) => void;
  selectElements: (elementIds: string[]) => void;
  clearSelection: () => void;
  
  // Clipboard Actions
  copyElements: (elementIds: string[]) => void;
  pasteElements: () => void;
  cutElements: (elementIds: string[]) => void;
}

export const createSelectionSlice: StateCreator<
  any,
  [],
  [],
  SelectionSlice
> = (set, get) => ({
  selectedElementIds: [],
  clipboard: [],
  
  selectElement: (elementId, multiSelect = false) => {
    set((state: any) => {
      if (multiSelect) {
        const isSelected = state.selectedElementIds.includes(elementId);
        const newSelection = isSelected
          ? state.selectedElementIds.filter((id: string) => id !== elementId)
          : [...state.selectedElementIds, elementId];
        
        return { selectedElementIds: Array.from(new Set(newSelection)) };
      }
      
      return { selectedElementIds: [elementId] };
    });
  },
  
  selectElements: (elementIds) => {
    set({ selectedElementIds: elementIds });
  },
  
  clearSelection: () => {
    set({ selectedElementIds: [] });
  },
  
  copyElements: (elementIds) => {
    const elements = get().elements.filter((el: CanvasElement) => elementIds.includes(el.id));
    set({ clipboard: elements.map((el: CanvasElement) => ({ ...el })) });
  },
  
  pasteElements: () => {
    const clipboard = get().clipboard;
    if (clipboard.length === 0) return;
    
    clipboard.forEach((el: CanvasElement) => {
      const copy = { ...el };
      delete (copy as any).id;
      copy.position = { x: copy.position.x + 20, y: copy.position.y + 20 };
      get().addElement(copy);
    });
  },
  
  cutElements: (elementIds) => {
    get().copyElements(elementIds);
    get().deleteElements(elementIds);
  }
});
