
import { useState, useCallback } from 'react';

interface Layer {
  id: string;
  name: string;
  type: 'layer' | 'folder';
  visible: boolean;
  locked: boolean;
  elements?: string[];
  children?: Layer[];
  expanded?: boolean;
}

export const useCanvasLayerState = () => {
  const [layers, setLayers] = useState<Layer[]>([
    {
      id: 'layer-1',
      name: 'الطبقة الرئيسية',
      type: 'layer',
      visible: true,
      locked: false,
      elements: []
    }
  ]);
  
  const [selectedLayerId, setSelectedLayerId] = useState<string>('layer-1');

  const handleLayerUpdate = useCallback((updatedLayers: Layer[]) => {
    setLayers(updatedLayers);
  }, []);

  const handleLayerSelect = useCallback((layerId: string) => {
    setSelectedLayerId(layerId);
  }, []);

  // Helper function to update a single layer
  const updateSingleLayer = useCallback((layerId: string, updates: Partial<Layer>) => {
    const updateLayerRecursive = (items: Layer[]): Layer[] => {
      return items.map(layer => {
        if (layer.id === layerId) {
          return { ...layer, ...updates };
        }
        if (layer.children) {
          return { ...layer, children: updateLayerRecursive(layer.children) };
        }
        return layer;
      });
    };
    
    setLayers(prev => updateLayerRecursive(prev));
  }, []);

  // Add element to layer automatically
  const addElementToLayer = useCallback((elementId: string, layerId?: string) => {
    const targetLayerId = layerId || selectedLayerId;
    updateSingleLayer(targetLayerId, {
      elements: [...(layers.find(l => l.id === targetLayerId)?.elements || []), elementId]
    });
  }, [selectedLayerId, layers, updateSingleLayer]);

  // Remove element from layer
  const removeElementFromLayer = useCallback((elementId: string) => {
    const updateElements = (items: Layer[]): Layer[] => {
      return items.map(layer => ({
        ...layer,
        elements: layer.elements?.filter(id => id !== elementId) || [],
        children: layer.children ? updateElements(layer.children) : undefined
      }));
    };
    
    setLayers(prev => updateElements(prev));
  }, []);

  return {
    layers,
    setLayers,
    selectedLayerId,
    setSelectedLayerId,
    handleLayerUpdate,
    handleLayerSelect,
    updateSingleLayer,
    addElementToLayer,
    removeElementFromLayer
  };
};
