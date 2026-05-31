/**
 * Layers Slice - إدارة الطبقات
 */

import { StateCreator } from 'zustand';
import { nanoid } from 'nanoid';
import type { CanvasElement, LayerInfo } from '@/types/canvas';
import { DEFAULT_LAYER } from '../types';
import { runCanvasTransaction } from '../transactions/runCanvasTransaction';

export interface LayersSlice {
  layers: LayerInfo[];
  activeLayerId: string | null;
  
  // Layer Actions
  addLayer: (name: string) => void;
  updateLayer: (layerId: string, updates: Partial<LayerInfo>) => void;
  deleteLayer: (layerId: string) => void;
  toggleLayerVisibility: (layerId: string) => void;
  toggleLayerLock: (layerId: string) => void;
  setActiveLayer: (layerId: string) => void;
  reorderLayers: (layerIds: string[]) => void;
}

function ensureFallbackLayer(layers: LayerInfo[]): LayerInfo[] {
  return layers.length > 0 ? layers : [{ ...DEFAULT_LAYER, elements: [] }];
}

function resolveActiveLayerId(currentActiveLayerId: string | null, layers: LayerInfo[]): string | null {
  if (currentActiveLayerId && layers.some((layer) => layer.id === currentActiveLayerId)) {
    return currentActiveLayerId;
  }

  return layers[0]?.id ?? DEFAULT_LAYER.id;
}

export const createLayersSlice: StateCreator<
  any,
  [],
  [],
  LayersSlice
> = (set, get) => ({
  layers: [DEFAULT_LAYER],
  activeLayerId: 'default',
  
  addLayer: (name) => {
    const newLayer: LayerInfo = {
      id: nanoid(),
      name,
      visible: true,
      locked: false,
      elements: []
    };
    
    runCanvasTransaction(set, (state: any) => ({
      layers: [...ensureFallbackLayer(state.layers || []), newLayer],
      activeLayerId: newLayer.id
    }));
  },
  
  updateLayer: (layerId, updates) => {
    runCanvasTransaction(set, (state: any) => {
      const layers = ensureFallbackLayer(state.layers || []);
      if (!layers.some((layer: LayerInfo) => layer.id === layerId)) return {};

      return {
        layers: layers.map((layer: LayerInfo) =>
          layer.id === layerId ? { ...layer, ...updates } : layer
        )
      };
    });
  },
  
  deleteLayer: (layerId) => {
    runCanvasTransaction(set, (state: any) => {
      const layers = ensureFallbackLayer(state.layers || []);
      const layer = layers.find((entry: LayerInfo) => entry.id === layerId);
      if (!layer) return {};

      const remainingLayers = layers.filter((entry: LayerInfo) => entry.id !== layerId);
      const normalizedLayers = ensureFallbackLayer(remainingLayers);
      const idsToDelete = new Set(layer.elements || []);
      const filteredElements = (state.elements || []).filter((element: CanvasElement) => !idsToDelete.has(element.id));
      const cleanedLayers = normalizedLayers.map((entry: LayerInfo) => ({
        ...entry,
        elements: entry.elements.filter((elementId: string) => !idsToDelete.has(elementId)),
      }));
      const activeLayerId = state.activeLayerId === layerId
        ? cleanedLayers[0]?.id ?? DEFAULT_LAYER.id
        : resolveActiveLayerId(state.activeLayerId, cleanedLayers);

      return {
        layers: cleanedLayers,
        elements: filteredElements,
        selectedElementIds: (state.selectedElementIds || []).filter((elementId: string) => !idsToDelete.has(elementId)),
        activeLayerId,
      };
    });
  },
  
  toggleLayerVisibility: (layerId) => {
    runCanvasTransaction(set, (state: any) => {
      const layers = ensureFallbackLayer(state.layers || []);
      if (!layers.some((layer: LayerInfo) => layer.id === layerId)) return {};

      return {
        layers: layers.map((layer: LayerInfo) =>
          layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
        )
      };
    });
  },
  
  toggleLayerLock: (layerId) => {
    runCanvasTransaction(set, (state: any) => {
      const layers = ensureFallbackLayer(state.layers || []);
      if (!layers.some((layer: LayerInfo) => layer.id === layerId)) return {};

      return {
        layers: layers.map((layer: LayerInfo) =>
          layer.id === layerId ? { ...layer, locked: !layer.locked } : layer
        )
      };
    });
  },
  
  setActiveLayer: (layerId) => {
    const layers = get().layers || [];
    if (!layers.some((layer: LayerInfo) => layer.id === layerId)) return;
    set({ activeLayerId: layerId });
  },
  
  reorderLayers: (layerIds) => {
    runCanvasTransaction(set, (state: any) => {
      const currentLayers = ensureFallbackLayer(state.layers || []);
      const requestedLayers = layerIds
        .map((id: string) => currentLayers.find((layer: LayerInfo) => layer.id === id))
        .filter(Boolean) as LayerInfo[];
      const omittedLayers = currentLayers.filter((layer: LayerInfo) => !layerIds.includes(layer.id));
      const layers = ensureFallbackLayer([...requestedLayers, ...omittedLayers]);

      return {
        layers,
        activeLayerId: resolveActiveLayerId(state.activeLayerId, layers),
      };
    });
  }
});
