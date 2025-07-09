import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layer } from '../CanvasPanelTypes';
import { CanvasElement } from '../../types';
import { Layers, Plus, Eye, EyeOff } from 'lucide-react';

interface LayersPanelProps {
  layers: Layer[];
  selectedLayerId: string | null;
  elements: CanvasElement[];
  onLayerUpdate: (layers: Layer[]) => void;
  onLayerSelect: (layerId: string) => void;
}

export const LayersPanel: React.FC<LayersPanelProps> = ({
  layers,
  selectedLayerId,
  elements,
  onLayerUpdate,
  onLayerSelect
}) => {
  const handleAddLayer = () => {
    const newLayer: Layer = {
      id: `layer-${Date.now()}`,
      name: `طبقة ${layers.length + 1}`,
      visible: true,
      locked: false,
      
      order: layers.length
    };
    onLayerUpdate([...layers, newLayer]);
  };

  return (
    <Card className="w-full h-full bg-[#f2f9fb]/95 backdrop-blur-xl shadow-sm border border-white/20 rounded-[32px] overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2 text-black">
          <Layers className="w-5 h-5 text-[#96d8d0]" />
          الطبقات
          <Badge variant="outline" className="text-xs bg-white/50 ml-auto">
            {layers.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 h-[calc(100%-4rem)] flex flex-col">
        <Button
          onClick={handleAddLayer}
          size="sm"
          className="w-full rounded-[16px] bg-[#96d8d0] hover:bg-[#96d8d0]/80 text-black border-none"
        >
          <Plus className="w-4 h-4 mr-2" />
          إضافة طبقة
        </Button>
        <div className="flex-1 space-y-2 overflow-y-auto">
          {layers.map((layer) => (
            <div
              key={layer.id}
              className={`p-3 rounded-[16px] border cursor-pointer ${
                selectedLayerId === layer.id 
                  ? 'bg-[#96d8d0]/20 border-[#96d8d0]' 
                  : 'bg-white/30 border-[#d1e1ea]'
              }`}
              onClick={() => onLayerSelect(layer.id)}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-black flex-1">{layer.name}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-6 h-6 p-0"
                >
                  {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};