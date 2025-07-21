import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layers, Eye, EyeOff, Lock, Unlock, Plus } from 'lucide-react';

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  elements: string[];
}

interface LayersPanelProps {
  layers: Layer[];
  selectedLayerId: string | null;
  onLayerUpdate: (layers: Layer[]) => void;
  onLayerSelect: (layerId: string) => void;
}

const LayersPanel: React.FC<LayersPanelProps> = ({
  layers,
  selectedLayerId,
  onLayerUpdate,
  onLayerSelect
}) => {
  const toggleLayerVisibility = (layerId: string) => {
    const updatedLayers = layers.map(layer =>
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    );
    onLayerUpdate(updatedLayers);
  };

  const toggleLayerLock = (layerId: string) => {
    const updatedLayers = layers.map(layer =>
      layer.id === layerId ? { ...layer, locked: !layer.locked } : layer
    );
    onLayerUpdate(updatedLayers);
  };

  const addNewLayer = () => {
    const newLayer: Layer = {
      id: `layer-${Date.now()}`,
      name: `طبقة ${layers.length + 1}`,
      visible: true,
      locked: false,
      elements: []
    };
    onLayerUpdate([...layers, newLayer]);
  };

  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers size={16} />
          الطبقات
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={addNewLayer}
        >
          <Plus size={14} className="mr-2" />
          إضافة طبقة
        </Button>
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {layers.map((layer) => (
            <div
              key={layer.id}
              className={`p-2 rounded border cursor-pointer ${
                selectedLayerId === layer.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => onLayerSelect(layer.id)}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{layer.name}</span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLayerVisibility(layer.id);
                    }}
                  >
                    {layer.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLayerLock(layer.id);
                    }}
                  >
                    {layer.locked ? <Lock size={12} /> : <Unlock size={12} />}
                  </Button>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {layer.elements.length} عنصر
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LayersPanel;