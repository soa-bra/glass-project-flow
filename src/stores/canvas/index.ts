/**
 * Canvas Store - تجميع جميع الـ Slices
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { createElementsSlice, ElementsSlice } from './elementsSlice';
import { createViewportSlice, ViewportSlice } from './viewportSlice';
import { createSelectionSlice, SelectionSlice } from './selectionSlice';
import { createHistorySlice, HistorySlice } from './historySlice';
import { createToolsSlice, ToolsSlice } from './toolsSlice';
import { createLayersSlice, LayersSlice } from './layersSlice';
import { createPenSlice, PenSlice } from './penSlice';
import { createFrameSlice, FrameSlice } from './frameSlice';
import { createMindmapSlice, MindmapSlice } from './mindmapSlice';

// النوع المُجمّع
export type CanvasStore = 
  ElementsSlice & 
  ViewportSlice & 
  SelectionSlice & 
  HistorySlice & 
  ToolsSlice & 
  LayersSlice &
  PenSlice &
  FrameSlice &
  MindmapSlice;

// إنشاء الـ Store
export const useCanvasStore = create<CanvasStore>()(
  devtools(
    (...args) => ({
      ...createElementsSlice(...args),
      ...createViewportSlice(...args),
      ...createSelectionSlice(...args),
      ...createHistorySlice(...args),
      ...createToolsSlice(...args),
      ...createLayersSlice(...args),
      ...createPenSlice(...args),
      ...createFrameSlice(...args),
      ...createMindmapSlice(...args),
    }),
    { name: 'canvas-store' }
  )
);

// تصدير جميع الأنواع
export * from './types';
export * from './selectors';
export * from './helpers';

// تصدير الـ slices للاستخدام الفردي
export type {
  ElementsSlice,
  ViewportSlice,
  SelectionSlice,
  HistorySlice,
  ToolsSlice,
  LayersSlice,
  PenSlice,
  FrameSlice,
  MindmapSlice
};
