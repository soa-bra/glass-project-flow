import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Layers, Eye, EyeOff, Lock, Unlock, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { Layer } from '../hooks/useCanvasLayerState';

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
  const [newLayerName, setNewLayerName] = useState('');

  const addNewLayer = () => {
    const name = newLayerName.trim() || `طبقة ${layers.length + 1}`;
    const newLayer: Layer = {
      id: `layer-${Date.now()}`,
      name,
      visible: true,
      locked: false,
      elements: []
    };
    onLayerUpdate([...layers, newLayer]);
    setNewLayerName('');
  };

  const deleteLayer = (layerId: string) => {
    if (layers.length > 1) {
      const updatedLayers = layers.filter(layer => layer.id !== layerId);
      onLayerUpdate(updatedLayers);
      if (selectedLayerId === layerId) {
        onLayerSelect(updatedLayers[0]?.id || '');
      }
    }
  };

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

  const moveLayerUp = (index: number) => {
    if (index > 0) {
      const newLayers = [...layers];
      [newLayers[index], newLayers[index - 1]] = [newLayers[index - 1], newLayers[index]];
      onLayerUpdate(newLayers);
    }
  };

  const moveLayerDown = (index: number) => {
    if (index < layers.length - 1) {
      const newLayers = [...layers];
      [newLayers[index], newLayers[index + 1]] = [newLayers[index + 1], newLayers[index]];
      onLayerUpdate(newLayers);
    }
  };

  const updateLayerName = (layerId: string, newName: string) => {
    const updatedLayers = layers.map(layer =>
      layer.id === layerId ? { ...layer, name: newName } : layer
    );
    onLayerUpdate(updatedLayers);
  };

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-xl shadow-lg border border-white/20 rounded-[24px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-500" />
          إدارة الطبقات
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* إضافة طبقة جديدة */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">إضافة طبقة جديدة</h4>
          <div className="flex gap-2">
            <Input
              value={newLayerName}
              onChange={(e) => setNewLayerName(e.target.value)}
              placeholder="اسم الطبقة"
              className="flex-1 font-arabic text-sm rounded-xl"
              onKeyPress={(e) => e.key === 'Enter' && addNewLayer()}
            />
            <Button
              onClick={addNewLayer}
              size="sm"
              className="rounded-xl bg-blue-500 hover:bg-blue-600"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* قائمة الطبقات */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">الطبقات ({layers.length})</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {layers.map((layer, index) => (
              <div
                key={layer.id}
                className={`p-3 rounded-xl border transition-colors ${
                  selectedLayerId === layer.id
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
                onClick={() => onLayerSelect(layer.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <Input
                    value={layer.name}
                    onChange={(e) => updateLayerName(layer.id, e.target.value)}
                    className="text-sm font-arabic border-none p-0 h-auto bg-transparent"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex items-center gap-1">
                    <Button
                      onClick={(e) => { e.stopPropagation(); toggleLayerVisibility(layer.id); }}
                      size="sm"
                      variant="ghost"
                      className="w-6 h-6 p-0"
                    >
                      {layer.visible ? (
                        <Eye className="w-3 h-3" />
                      ) : (
                        <EyeOff className="w-3 h-3 text-gray-400" />
                      )}
                    </Button>
                    <Button
                      onClick={(e) => { e.stopPropagation(); toggleLayerLock(layer.id); }}
                      size="sm"
                      variant="ghost"
                      className="w-6 h-6 p-0"
                    >
                      {layer.locked ? (
                        <Lock className="w-3 h-3 text-red-500" />
                      ) : (
                        <Unlock className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500 font-arabic">
                    {layer.elements.length} عنصر
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      onClick={(e) => { e.stopPropagation(); moveLayerUp(index); }}
                      size="sm"
                      variant="ghost"
                      className="w-6 h-6 p-0"
                      disabled={index === 0}
                    >
                      <ArrowUp className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={(e) => { e.stopPropagation(); moveLayerDown(index); }}
                      size="sm"
                      variant="ghost"
                      className="w-6 h-6 p-0"
                      disabled={index === layers.length - 1}
                    >
                      <ArrowDown className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={(e) => { e.stopPropagation(); deleteLayer(layer.id); }}
                      size="sm"
                      variant="ghost"
                      className="w-6 h-6 p-0 text-red-500 hover:text-red-700"
                      disabled={layers.length <= 1}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* نصائح الاستخدام */}
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
          <div className="text-xs text-blue-800 font-arabic space-y-1">
            <div>📚 استخدم الطبقات لتنظيم عملك</div>
            <div>👁️ أخفِ الطبقات غير المرغوبة</div>
            <div>🔒 اقفل الطبقات لحمايتها</div>
            <div>↕️ رتب الطبقات حسب الأولوية</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LayersPanel;