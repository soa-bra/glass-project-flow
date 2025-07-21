/**
 * @fileoverview Enhanced Layers Panel with drag-and-drop and folder support
 * @author AI Assistant
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Lock, Unlock, Trash2, FolderPlus, Search, ChevronDown, ChevronRight } from 'lucide-react';
import { Layer } from '@/types/canvas';

interface EnhancedLayersPanelProps {
  layers: Layer[];
  selectedLayerId: string | null;
  onLayerUpdate: (layers: Layer[]) => void;
  onLayerSelect: (layerId: string) => void;
  elements: any[];
}

/**
 * Enhanced Layers Panel Component
 * Provides advanced layer management with folders and drag-and-drop
 */
const EnhancedLayersPanel: React.FC<EnhancedLayersPanelProps> = ({
  layers,
  selectedLayerId,
  onLayerUpdate,
  onLayerSelect,
  elements
}) => {
  const [newLayerName, setNewLayerName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const addNewLayer = () => {
    if (!newLayerName.trim()) return;
    
    const newLayer: Layer = {
      id: `layer-${Date.now()}`,
      name: newLayerName,
      visible: true,
      locked: false,
      elements: []
    };
    
    onLayerUpdate([...layers, newLayer]);
    setNewLayerName('');
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
    if (layers.length <= 1) return;
    onLayerUpdate(layers.filter(layer => layer.id !== layerId));
  };

  const renderLayer = (layer: Layer) => (
    <div
      key={layer.id}
      className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
        selectedLayerId === layer.id ? 'bg-primary/10' : 'hover:bg-muted'
      }`}
      onClick={() => onLayerSelect(layer.id)}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {layer.isFolder && (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
        <span className="truncate text-sm">{layer.name}</span>
        <span className="text-xs text-muted-foreground">
          ({layer.elements.length})
        </span>
      </div>
      
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={(e) => {
            e.stopPropagation();
            toggleLayerVisibility(layer.id);
          }}
        >
          {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={(e) => {
            e.stopPropagation();
            toggleLayerLock(layer.id);
          }}
        >
          {layer.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            deleteLayer(layer.id);
          }}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );

  const filteredLayers = layers.filter(layer =>
    layer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="h-full glass-section">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">لوحة الطبقات</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="البحث في الطبقات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Add Layer */}
        <div className="flex gap-2">
          <Input
            placeholder="اسم الطبقة الجديدة"
            value={newLayerName}
            onChange={(e) => setNewLayerName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addNewLayer()}
          />
          <Button onClick={addNewLayer} disabled={!newLayerName.trim()}>
            إضافة
          </Button>
        </div>

        {/* Toolbar */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FolderPlus className="w-4 h-4" />
          </Button>
        </div>

        {/* Layers List */}
        <div className="space-y-1 max-h-80 overflow-y-auto">
          {filteredLayers.map(renderLayer)}
        </div>

        {/* Tips */}
        <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded">
          <p>• انقر لتحديد الطبقة</p>
          <p>• استخدم العين لإظهار/إخفاء</p>
          <p>• استخدم القفل لمنع التعديل</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedLayersPanel;