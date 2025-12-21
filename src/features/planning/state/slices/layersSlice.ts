/**
 * Layers Slice - إدارة الطبقات
 */

import { StateCreator } from 'zustand';
import { nanoid } from 'nanoid';
import type { LayerInfo } from '@/types/canvas';
import { DEFAULT_LAYER } from '../types';

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
    
    set((state: any) => ({
      layers: [...state.layers, newLayer],
      activeLayerId: newLayer.id
    }));
  },
  
  updateLayer: (layerId, updates) => {
    set((state: any) => ({
      layers: state.layers.map((layer: LayerInfo) =>
        layer.id === layerId ? { ...layer, ...updates } : layer
      )
    }));
  },
  
  deleteLayer: (layerId) => {
    const layer = get().layers.find((l: LayerInfo) => l.id === layerId);
    if (!layer) return;
    
    layer.elements.forEach((elementId: string) => get().deleteElement(elementId));
    
    set((state: any) => {
      const remainingLayers = state.layers.filter((l: LayerInfo) => l.id !== layerId);
      return {
        layers: remainingLayers,
        activeLayerId: state.activeLayerId === layerId
          ? remainingLayers[0]?.id || null
          : state.activeLayerId
      };
    });
  },
  
  toggleLayerVisibility: (layerId) => {
    set((state: any) => ({
      layers: state.layers.map((layer: LayerInfo) =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    }));
  },
  
  toggleLayerLock: (layerId) => {
    set((state: any) => ({
      layers: state.layers.map((layer: LayerInfo) =>
        layer.id === layerId ? { ...layer, locked: !layer.locked } : layer
      )
    }));
  },
  
  setActiveLayer: (layerId) => {
    set({ activeLayerId: layerId });
  },
  
  reorderLayers: (layerIds) => {
    set((state: any) => ({
      layers: layerIds.map((id: string) => state.layers.find((l: LayerInfo) => l.id === id)!).filter(Boolean)
    }));
  }
});
