import { useState } from 'react';

interface Layer {
  id: string;
  name: string;
  type: 'element' | 'group';
  visible: boolean;
  locked: boolean;
  children?: Layer[];
}

export const useCanvasLayerState = () => {
  const [layers, setLayers] = useState<Layer[]>([
    { id: 'layer-1', name: 'الطبقة الأساسية', type: 'element', visible: true, locked: false }
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