/**
 * History Slice - إدارة Undo/Redo
 */

import { StateCreator } from 'zustand';
import type { CanvasElement } from '@/types/canvas';

export interface HistorySlice {
  history: {
    past: CanvasElement[][];
    future: CanvasElement[][];
  };
  
  // History Actions
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
  clearHistory: () => void;
}

export const createHistorySlice: StateCreator<
  any,
  [],
  [],
  HistorySlice
> = (set, get) => ({
  history: {
    past: [],
    future: []
  },
  
  undo: () => {
    set((state: any) => {
      if (state.history.past.length === 0) return state;
      
      const previous = state.history.past[state.history.past.length - 1];
      const newPast = state.history.past.slice(0, -1);
      
      return {
        elements: previous,
        history: {
          past: newPast,
          future: [state.elements, ...state.history.future]
        }
      };
    });
  },
  
  redo: () => {
    set((state: any) => {
      if (state.history.future.length === 0) return state;
      
      const next = state.history.future[0];
      const newFuture = state.history.future.slice(1);
      
      return {
        elements: next,
        history: {
          past: [...state.history.past, state.elements],
          future: newFuture
        }
      };
    });
  },
  
  pushHistory: () => {
    set((state: any) => ({
      history: {
        past: [...state.history.past.slice(-20), state.elements],
        future: []
      }
    }));
  },
  
  clearHistory: () => {
    set({
      history: {
        past: [],
        future: []
      }
    });
  }
});
