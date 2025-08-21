// src/features/planning/hooks/useGrid.ts
'use client';
import { useCanvasStore } from '../store/canvas.store';
export const useGrid = ()=> useCanvasStore(s=>s.scene.grid);
