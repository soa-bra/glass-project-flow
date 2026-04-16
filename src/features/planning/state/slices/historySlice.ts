/**
 * History Slice - إدارة Undo/Redo
 */

import { StateCreator } from 'zustand';
import { BoardSnapshot, captureBoardSnapshot, restoreBoardSnapshot } from '../history/boardSnapshot';

const MAX_HISTORY_ENTRIES = 20;

export interface HistorySlice {
  history: {
    past: BoardSnapshot[];
    future: BoardSnapshot[];
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
      const currentSnapshot = captureBoardSnapshot(state);

      return {
        ...restoreBoardSnapshot(previous),
        history: {
          past: newPast,
          future: [currentSnapshot, ...state.history.future],
        },
      };
    });
  },
  
  redo: () => {
    set((state: any) => {
      if (state.history.future.length === 0) return state;

      const next = state.history.future[0];
      const newFuture = state.history.future.slice(1);
      const currentSnapshot = captureBoardSnapshot(state);

      return {
        ...restoreBoardSnapshot(next),
        history: {
          past: [...state.history.past, currentSnapshot].slice(-MAX_HISTORY_ENTRIES),
          future: newFuture,
        },
      };
    });
  },
  
  pushHistory: () => {
    set((state: any) => ({
      history: {
        past: [...state.history.past.slice(-(MAX_HISTORY_ENTRIES - 1)), captureBoardSnapshot(state)],
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
