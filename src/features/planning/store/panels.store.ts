// src/features/planning/store/panels.store.ts
'use client';
import { create } from 'zustand';

type PanelsState = {
  boardName: string;
  setBoardName: (v:string)=>void;
};
export const usePanelsStore = create<PanelsState>((set)=>({
  boardName: 'لوحة بلا عنوان',
  setBoardName: (v)=>set({boardName:v})
}));
