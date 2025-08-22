
import { create } from 'zustand';

export type Tool = 'select' | 'pan' | 'rect' | 'ellipse' | 'pen' | 'text' | 'comment' | 'zoom';

interface ToolsState {
  tool: Tool;
  setTool: (tool: Tool) => void;
}

export const useTools = create<ToolsState>((set) => ({
  tool: 'select',
  setTool: (tool) => set({ tool }),
}));
