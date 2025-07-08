
import { useState, useCallback } from 'react';

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  zIndex: number;
}

export const useCanvasLayerState = () => {
  const [layers, setLayers] = useState<Layer[]>([
    {
      id: 'layer-1',
      name: 'Layer 1',
      visible: true,
      locked: false,
      opacity: 1,
      zIndex: 1
    }
  ]);
  
  const [selectedLayerId, setSelectedLayerId] = useState<string>('layer-1');

  const handleLayerUpdate = useCallback((layerId: string, updates: Partial<Layer>) => {
    setLayers(prevLayers => 
      prevLayers.map(layer => 
        layer.id === layerId ? { ...layer, ...updates } : layer
      )
    );
  }, []);

  const handleLayerSelect = useCallback((layerId: string) => {
    setSelectedLayerId(layerId);
  }, []);

  return {
    layers,
    setLayers,
    selectedLayerId,
    setSelectedLayerId,
    handleLayerUpdate,
    handleLayerSelect
  };
};
