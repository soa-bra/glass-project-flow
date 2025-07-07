import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Layers, Eye, EyeOff, Lock, Unlock, Move, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  elements: string[];
}

interface LayerToolProps {
  selectedTool: string;
  layers: Layer[];
  onLayerUpdate: (layers: Layer[]) => void;
  onLayerSelect: (layerId: string) => void;
  selectedLayerId: string | null;
}

export const LayerTool: React.FC<LayerToolProps> = ({ 
  selectedTool, 
  layers,
  onLayerUpdate,
  onLayerSelect,
  selectedLayerId
}) => {
  const [newLayerName, setNewLayerName] = useState('');

  if (selectedTool !== 'layers') return null;

  const handleAddLayer = () => {
    if (!newLayerName.trim()) {
      toast.error('يرجى إدخال اسم الطبقة');
      return;
    }

    const newLayer: Layer = {
      id: `layer-${Date.now()}`,
      name: newLayerName,
      visible: true,
      locked: false,
      elements: []
    };

    onLayerUpdate([...layers, newLayer]);
    setNewLayerName('');
    toast.success(`تم إنشاء الطبقة: ${newLayerName}`);
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

  const deleteLayer = (layerId: string) => {
    if (layers.length <= 1) {
      toast.error('لا يمكن حذف آخر طبقة');
      return;
    }
    
    const updatedLayers = layers.filter(layer => layer.id !== layerId);
    onLayerUpdate(updatedLayers);
    toast.success('تم حذف الطبقة');
  };

  const renameLayer = (layerId: string, newName: string) => {
    if (!newName.trim()) return;
    
    const updatedLayers = layers.map(layer =>
      layer.id === layerId ? { ...layer, name: newName } : layer
    );
    onLayerUpdate(updatedLayers);
  };

  return (
    <div className="space-y-4">
      {/* إضافة طبقة جديدة */}
      <div className="space-y-2">
        <label className="text-sm font-medium font-arabic">إضافة طبقة جديدة</label>
        <div className="flex gap-2">
          <Input
            value={newLayerName}
            onChange={(e) => setNewLayerName(e.target.value)}
            placeholder="اسم الطبقة..."
            className="font-arabic"
          />
          <Button onClick={handleAddLayer} size="sm" className="rounded-full">
            <Layers className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* قائمة الطبقات */}
      <div className="space-y-2">
        <label className="text-sm font-medium font-arabic">الطبقات ({layers.length})</label>
        <div className="max-h-60 overflow-y-auto space-y-1">
          {layers.map((layer, index) => (
            <div
              key={layer.id}
              className={`p-2 rounded-lg border cursor-pointer transition-colors ${
                selectedLayerId === layer.id
                  ? 'bg-black text-white border-black'
                  : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
              }`}
              onClick={() => onLayerSelect(layer.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-xs text-gray-500 w-6">{layers.length - index}</span>
                  <input
                    type="text"
                    value={layer.name}
                    onChange={(e) => renameLayer(layer.id, e.target.value)}
                    className="text-sm font-arabic bg-transparent border-none outline-none flex-1"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-xs text-gray-500">
                    ({layer.elements.length})
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLayerVisibility(layer.id);
                    }}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    {layer.visible ? (
                      <Eye className="w-3 h-3" />
                    ) : (
                      <EyeOff className="w-3 h-3 text-gray-400" />
                    )}
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLayerLock(layer.id);
                    }}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    {layer.locked ? (
                      <Lock className="w-3 h-3 text-red-500" />
                    ) : (
                      <Unlock className="w-3 h-3" />
                    )}
                  </button>
                  
                  {layers.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteLayer(layer.id);
                      }}
                      className="p-1 hover:bg-red-100 rounded text-red-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* إرشادات سريعة */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="text-sm font-medium font-arabic mb-1">💡 إرشادات:</h4>
        <ul className="text-xs font-arabic text-blue-800 space-y-1">
          <li>• انقر على الطبقة لتحديدها</li>
          <li>• استخدم العين لإخفاء/إظهار الطبقة</li>
          <li>• استخدم القفل لمنع التعديل</li>
          <li>• الرقم يشير لترتيب الطبقة</li>
        </ul>
      </div>
    </div>
  );
};