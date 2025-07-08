import { useState } from 'react';

export const useCanvasLayerState = () => {
  const [layers, setLayers] = useState([
    { id: 'layer-1', name: 'الطبقة الأساسية', visible: true, locked: false, elements: [] }
  ]);
  const [selectedLayerId, setSelectedLayerId] = useState<string>('layer-1');

  const handleLayerUpdate = (newLayers: any[]) => {
    setLayers(newLayers);
  };

  const handleLayerSelect = (layerId: string) => {
    setSelectedLayerId(layerId);
  };

  return {
    layers,
    setLayers,
    selectedLayerId,
    setSelectedLayerId,
    handleLayerUpdate,
    handleLayerSelect,
  };
};