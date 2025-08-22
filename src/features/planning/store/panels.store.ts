import { create } from 'zustand';

interface PanelsState {
  openPanel: (panel: string) => void;
  setCommentsOpen: (open: boolean) => void;
}

export const usePanels = create<PanelsState>((set) => ({
  openPanel: (panel: string) => {
    console.log('Opening panel:', panel);
  },
  setCommentsOpen: (open: boolean) => {
    console.log('Comments open:', open);
  },
}));