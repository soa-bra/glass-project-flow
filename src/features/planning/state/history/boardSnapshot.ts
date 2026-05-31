/**
 * Board Snapshot - لقطة كاملة لحالة اللوحة
 */

import type { CanvasElement, LayerInfo } from '@/types/canvas';

export interface BoardViewportSnapshot {
  zoom: number;
  pan: { x: number; y: number };
}

export interface BoardSnapshot {
  elements: CanvasElement[];
  layers: LayerInfo[];
  selectedElementIds: string[];
  viewport: BoardViewportSnapshot;
  activeLayerId: string | null;
}

function safeClone<T>(value: T): T {
  try {
    return structuredClone(value);
  } catch {
    return JSON.parse(JSON.stringify(value));
  }
}

export function captureBoardSnapshot(state: {
  elements: CanvasElement[];
  layers: LayerInfo[];
  selectedElementIds?: string[];
  viewport?: BoardViewportSnapshot;
  activeLayerId?: string | null;
}): BoardSnapshot {
  return {
    elements: safeClone(state.elements || []),
    layers: safeClone(state.layers || []),
    selectedElementIds: safeClone(state.selectedElementIds || []),
    viewport: safeClone(state.viewport || { zoom: 1, pan: { x: 0, y: 0 } }),
    activeLayerId: state.activeLayerId ?? 'default',
  };
}

export function restoreBoardSnapshot(snapshot: BoardSnapshot): {
  elements: CanvasElement[];
  layers: LayerInfo[];
  selectedElementIds: string[];
  viewport: BoardViewportSnapshot;
  activeLayerId: string | null;
  settings: { zoom: number; pan: { x: number; y: number } };
} {
  const restoredViewport = safeClone(snapshot.viewport || { zoom: 1, pan: { x: 0, y: 0 } });

  return {
    elements: safeClone(snapshot.elements || []),
    layers: safeClone(snapshot.layers || []),
    selectedElementIds: safeClone(snapshot.selectedElementIds || []),
    viewport: restoredViewport,
    activeLayerId: snapshot.activeLayerId ?? 'default',
    settings: {
      zoom: restoredViewport.zoom,
      pan: safeClone(restoredViewport.pan),
    },
  };
}
