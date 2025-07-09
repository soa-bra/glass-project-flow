
import { useState, useCallback } from 'react';

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  elements: string[];
}

export const useCanvasLayerState = () => {
  const [layers, setLayers] = useState<Layer[]>([
    {
      id: 'layer-1',
      name: 'Layer 1',
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
    setLayers(prevLayers => 
      prevLayers.map(layer => 
        layer.id === layerId ? { ...layer, ...updates } : layer
      )
    );
  }, []);

  return {
    layers,
    setLayers,
    selectedLayerId,
    setSelectedLayerId,
    handleLayerUpdate,
    handleLayerSelect,
    updateSingleLayer
  };
};
