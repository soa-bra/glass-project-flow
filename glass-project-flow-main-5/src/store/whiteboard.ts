import create from 'zustand';
import { devtools } from 'zustand/middleware';

export type Theme = 'light' | 'dark';

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
}

export interface HistorySnapshot {
  pan: { x: number; y: number };
  zoom: number;
  showGrid: boolean;
}

export interface WhiteboardState {
  pan: { x: number; y: number };
  zoom: number;
  showGrid: boolean;
  theme: Theme;
  openPanels: {
    assistant: boolean;
    layers: boolean;
    appearance: boolean;
    collaboration: boolean;
  };
  chat: ChatMessage[];
  occupants: string[];
  history: HistorySnapshot[];
  historyIndex: number;
  setPan: (pan: { x: number; y: number }) => void;
  setZoom: (zoom: number) => void;
  toggleGrid: () => void;
  setTheme: (theme: Theme) => void;
  togglePanel: (panel: keyof WhiteboardState['openPanels']) => void;
  addChatMessage: (msg: ChatMessage) => void;
  setOccupants: (names: string[]) => void;
  undo: () => void;
  redo: () => void;
}

export const useWhiteboardStore = create<WhiteboardState>()(
  devtools((set, get) => ({
    pan: { x: 0, y: 0 },
    zoom: 1,
    showGrid: true,
    theme: 'light',
    openPanels: {
      assistant: false,
      layers: false,
      appearance: false,
      collaboration: false,
    },
    chat: [],
    occupants: [],
    history: [],
    historyIndex: -1,
    setPan: (pan) => {
      set((state) => {
        const snapshot: HistorySnapshot = {
          pan: state.pan,
          zoom: state.zoom,
          showGrid: state.showGrid,
        };
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(snapshot);
        return {
          pan,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        };
      });
    },
    setZoom: (zoom) => {
      set((state) => {
        const snapshot: HistorySnapshot = {
          pan: state.pan,
          zoom: state.zoom,
          showGrid: state.showGrid,
        };
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(snapshot);
        return {
          zoom,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        };
      });
    },
    toggleGrid: () => {
      set((state) => {
        const snapshot: HistorySnapshot = {
          pan: state.pan,
          zoom: state.zoom,
          showGrid: state.showGrid,
        };
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(snapshot);
        return {
          showGrid: !state.showGrid,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        };
      });
    },
    setTheme: (theme) => set(() => ({ theme })),
    togglePanel: (panel) => set((state) => ({
      openPanels: {
        ...state.openPanels,
        [panel]: !state.openPanels[panel],
      },
    })),
    addChatMessage: (msg) => set((state) => ({ chat: [...state.chat, msg] })),
    setOccupants: (names) => set(() => ({ occupants: names })),
    undo: () => {
      set((state) => {
        if (state.historyIndex < 0) return {} as any;
        const snapshot = state.history[state.historyIndex];
        return {
          pan: snapshot.pan,
          zoom: snapshot.zoom,
          showGrid: snapshot.showGrid,
          historyIndex: state.historyIndex - 1,
        };
      });
    },
    redo: () => {
      set((state) => {
        if (state.historyIndex >= state.history.length - 1) return {} as any;
        const nextSnapshot = state.history[state.historyIndex + 1];
        return {
          pan: nextSnapshot.pan,
          zoom: nextSnapshot.zoom,
          showGrid: nextSnapshot.showGrid,
          historyIndex: state.historyIndex + 1,
        };
      });
    },
  }))
);