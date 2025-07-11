import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { 
  Layers, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Plus, 
  Trash2, 
  Edit2, 
  ChevronUp, 
  ChevronDown,
  Copy,
  X
} from 'lucide-react';
import { CanvasLayer } from '../types/index';

interface LayersPanelProps {
  isVisible: boolean;
  onToggle: () => void;
  layers: CanvasLayer[];
  activeLayerId: string;
  onLayerSelect: (layerId: string) => void;
  onLayerCreate: (name: string) => void;
  onLayerDelete: (layerId: string) => void;
  onLayerRename: (layerId: string, name: string) => void;
  onLayerToggleVisibility: (layerId: string) => void;
  onLayerToggleLock: (layerId: string) => void;
  onLayerReorder: (layerId: string, direction: 'up' | 'down') => void;
  onLayerDuplicate: (layerId: string) => void;
  onLayerOpacityChange: (layerId: string, opacity: number) => void;
}

const LayersPanel: React.FC<LayersPanelProps> = ({
  isVisible,
  onToggle,
  layers,
  activeLayerId,
  onLayerSelect,
  onLayerCreate,
  onLayerDelete,
  onLayerRename,
  onLayerToggleVisibility,
  onLayerToggleLock,
  onLayerReorder,
  onLayerDuplicate,
  onLayerOpacityChange
}) => {
  const [newLayerName, setNewLayerName] = useState('');
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleCreateLayer = () => {
    if (newLayerName.trim()) {
      onLayerCreate(newLayerName);
      setNewLayerName('');
    }
  };

  const handleStartRename = (layer: CanvasLayer) => {
    setEditingLayerId(layer.id);
    setEditingName(layer.name);
  };

  const handleSaveRename = () => {
    if (editingLayerId && editingName.trim()) {
      onLayerRename(editingLayerId, editingName);
    }
    setEditingLayerId(null);
    setEditingName('');
  };

  const handleCancelRename = () => {
    setEditingLayerId(null);
    setEditingName('');
  };

  const sortedLayers = [...layers].sort((a, b) => b.order - a.order);

  if (!isVisible) return null;

  return (
    <Card className="w-72 h-[600px] flex flex-col bg-background/95 backdrop-blur-sm border shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Layers className="w-4 h-4 text-primary" />
          الطبقات
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="ml-auto p-1 h-6 w-6"
          >
            <X className="w-3 h-3" />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-3 p-4 pt-0">
        {/* Add Layer */}
        <div className="flex gap-2">
          <Input
            placeholder="اسم الطبقة الجديدة"
            value={newLayerName}
            onChange={(e) => setNewLayerName(e.target.value)}
            className="text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCreateLayer();
              }
            }}
          />
          <Button
            size="sm"
            onClick={handleCreateLayer}
            disabled={!newLayerName.trim()}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>

        <Separator />

        {/* Layers List */}
        <ScrollArea className="flex-1">
          <div className="space-y-1">
            {sortedLayers.map((layer) => (
              <div
                key={layer.id}
                className={`p-2 rounded border transition-all ${
                  layer.id === activeLayerId 
                    ? 'bg-primary/10 border-primary' 
                    : 'bg-background hover:bg-muted border-border'
                }`}
                onClick={() => onLayerSelect(layer.id)}
              >
                {/* Layer Header */}
                <div className="flex items-center gap-2 mb-2">
                  {editingLayerId === layer.id ? (
                    <div className="flex items-center gap-1 flex-1">
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="text-xs h-6"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveRename();
                          if (e.key === 'Escape') handleCancelRename();
                        }}
                        onBlur={handleSaveRename}
                        autoFocus
                      />
                    </div>
                  ) : (
                    <>
                      <span className="flex-1 text-sm font-medium truncate">
                        {layer.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {layer.elements.length}
                      </span>
                    </>
                  )}

                  {/* Layer Controls */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLayerToggleVisibility(layer.id);
                      }}
                      className="p-1 h-6 w-6"
                    >
                      {layer.visible ? (
                        <Eye className="w-3 h-3" />
                      ) : (
                        <EyeOff className="w-3 h-3 text-muted-foreground" />
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLayerToggleLock(layer.id);
                      }}
                      className="p-1 h-6 w-6"
                    >
                      {layer.locked ? (
                        <Lock className="w-3 h-3 text-muted-foreground" />
                      ) : (
                        <Unlock className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Layer Opacity */}
                <div className="mb-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <span>الشفافية</span>
                    <span>{Math.round(layer.opacity * 100)}%</span>
                  </div>
                  <Slider
                    value={[layer.opacity * 100]}
                    onValueChange={([value]) => 
                      onLayerOpacityChange(layer.id, value / 100)
                    }
                    max={100}
                    min={0}
                    step={1}
                    className="h-2"
                  />
                </div>

                {/* Layer Actions */}
                <div className="flex items-center gap-1 justify-between">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLayerReorder(layer.id, 'up');
                      }}
                      className="p-1 h-6 w-6"
                      disabled={layer.order === Math.max(...layers.map(l => l.order))}
                    >
                      <ChevronUp className="w-3 h-3" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLayerReorder(layer.id, 'down');
                      }}
                      className="p-1 h-6 w-6"
                      disabled={layer.order === Math.min(...layers.map(l => l.order))}
                    >
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartRename(layer);
                      }}
                      className="p-1 h-6 w-6"
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLayerDuplicate(layer.id);
                      }}
                      className="p-1 h-6 w-6"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLayerDelete(layer.id);
                      }}
                      className="p-1 h-6 w-6 text-destructive hover:text-destructive"
                      disabled={layers.length <= 1}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Layer Stats */}
        <Separator />
        <div className="text-xs text-muted-foreground">
          المجموع: {layers.length} طبقة، {layers.reduce((acc, layer) => acc + layer.elements.length, 0)} عنصر
        </div>
      </CardContent>
    </Card>
  );
};

export default LayersPanel;