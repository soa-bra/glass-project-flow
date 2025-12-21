/**
 * Planning Store - تجميع جميع الـ Slices
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import {
  createElementsSlice,
  createViewportSlice,
  createSelectionSlice,
  createHistorySlice,
  createToolsSlice,
  createLayersSlice,
  createPenSlice,
  createFrameSlice,
  createMindmapSlice,
  type ElementsSlice,
  type ViewportSlice,
  type SelectionSlice,
  type HistorySlice,
  type ToolsSlice,
  type LayersSlice,
  type PenSlice,
  type FrameSlice,
  type MindmapSlice,
} from './slices';

// النوع المُجمّع
export type PlanningStore = 
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
export const usePlanningStore = create<PlanningStore>()(
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
    { name: 'planning-store' }
  )
);

// تصدير الأنواع للاستخدام الخارجي
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
