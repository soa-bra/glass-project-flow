
import { create } from 'zustand';

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
  setPanImmediate: (pan: { x: number; y: number }) => void;
  setZoomImmediate: (zoom: number) => void;
  saveSnapshot: () => void;
  toggleGrid: () => void;
  setTheme: (theme: Theme) => void;
  togglePanel: (panel: keyof WhiteboardState['openPanels']) => void;
  addChatMessage: (msg: ChatMessage) => void;
  setOccupants: (names: string[]) => void;
  undo: () => void;
  redo: () => void;
}

export const useWhiteboardStore = create<WhiteboardState>()(
  (set, get) => ({
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
    
    // Safe pan update - only saves snapshot when explicitly requested
    setPan: (pan) => {
      set({ pan });
    },
    
    // Safe zoom update - only saves snapshot when explicitly requested
    setZoom: (zoom) => {
      set({ zoom });
    },
    
    // Immediate updates for smooth interactions (like dragging)
    setPanImmediate: (pan) => {
      set({ pan });
    },
    
    setZoomImmediate: (zoom) => {
      set({ zoom });
    },
    
    // Manual snapshot saving - call this when you want to save to history
    saveSnapshot: () => {
      set((state) => {
        const snapshot: HistorySnapshot = {
          pan: { ...state.pan },
          zoom: state.zoom,
          showGrid: state.showGrid,
        };
        
        // Avoid creating duplicate snapshots
        const currentSnapshot = state.history[state.historyIndex];
        if (currentSnapshot && 
            currentSnapshot.pan.x === snapshot.pan.x && 
            currentSnapshot.pan.y === snapshot.pan.y && 
            currentSnapshot.zoom === snapshot.zoom && 
            currentSnapshot.showGrid === snapshot.showGrid) {
          return {};
        }
        
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(snapshot);
        
        // Limit history to prevent memory issues
        if (newHistory.length > 50) {
          newHistory.shift();
          return {
            history: newHistory,
            historyIndex: newHistory.length - 1,
          };
        }
        
        return {
          history: newHistory,
          historyIndex: newHistory.length - 1,
        };
      });
    },
    
    // Grid toggle - saves snapshot manually
    toggleGrid: () => {
      const currentState = get();
      const snapshot: HistorySnapshot = {
        pan: { ...currentState.pan },
        zoom: currentState.zoom,
        showGrid: currentState.showGrid,
      };
      
      set((state) => {
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(snapshot);
        
        return {
          showGrid: !state.showGrid,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        };
      });
    },
    
    setTheme: (theme) => set({ theme }),
    
    togglePanel: (panel) => set((state) => ({
      openPanels: {
        ...state.openPanels,
        [panel]: !state.openPanels[panel],
      },
    })),
    
    addChatMessage: (msg) => set((state) => ({ 
      chat: [...state.chat, msg] 
    })),
    
    setOccupants: (names) => set({ occupants: names }),
    
    undo: () => {
      set((state) => {
        if (state.historyIndex <= 0) return {};
        
        const snapshot = state.history[state.historyIndex - 1];
        if (!snapshot) return {};
        
        return {
          pan: { ...snapshot.pan },
          zoom: snapshot.zoom,
          showGrid: snapshot.showGrid,
          historyIndex: state.historyIndex - 1,
        };
      });
    },
    
    redo: () => {
      set((state) => {
        if (state.historyIndex >= state.history.length - 1) return {};
        
        const nextSnapshot = state.history[state.historyIndex + 1];
        if (!nextSnapshot) return {};
        
        return {
          pan: { ...nextSnapshot.pan },
          zoom: nextSnapshot.zoom,
          showGrid: nextSnapshot.showGrid,
          historyIndex: state.historyIndex + 1,
        };
      });
    },
  })
);
