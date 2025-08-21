// src/features/planning/store/history.store.ts
'use client';
import { create } from 'zustand';
import { useCanvasStore } from './canvas.store';

type Entry = any;
type HistoryState = {
  stack: Entry[];
  idx: number;
  snapshot: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};
export const useHistory = create<HistoryState>((set, get)=>({
  stack: [],
  idx: -1,
  snapshot: ()=>{
    const state = useCanvasStore.getState().scene;
    const clone = JSON.parse(JSON.stringify(state));
    const { stack, idx } = get();
    const next = stack.slice(0, idx+1).concat([clone]).slice(-50);
    set({ stack: next, idx: next.length-1, canUndo: next.length>0, canRedo: false });
  },
  undo: ()=>{
    const { idx, stack } = get();
    if (idx<=0) return;
    const target = stack[idx-1];
    useCanvasStore.setState({ scene: JSON.parse(JSON.stringify(target)) });
    set({ idx: idx-1, canUndo: idx-1>0, canRedo: true });
  },
  redo: ()=>{
    const { idx, stack } = get();
    if (idx>=stack.length-1) return;
    const target = stack[idx+1];
    useCanvasStore.setState({ scene: JSON.parse(JSON.stringify(target)) });
    set({ idx: idx+1, canUndo: true, canRedo: idx+1<stack.length-1 });
  },
  canUndo: false,
  canRedo: false
}));

if (typeof window !== 'undefined') {
  (window as any).__undo = () => useHistory.getState().undo();
  (window as any).__redo = () => useHistory.getState().redo();
}
