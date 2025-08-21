// src/features/planning/hooks/useSelection.ts
'use client';
import { useCanvasStore } from '../store/canvas.store';
export const useSelection = ()=> {
  const { selectedId, setSelected } = useCanvasStore();
  return { selectedId, setSelected };
};
