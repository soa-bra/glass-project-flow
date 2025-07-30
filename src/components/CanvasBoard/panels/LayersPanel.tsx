import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Plus, 
  Trash2, 
  MoreVertical,
  FolderPlus,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import useCanvasState from '@/hooks/useCanvasState';
import { Layer } from '@/types/canvas';

export const LayersPanel: React.FC = () => {
  const {
    layers,
    selectedLayerId,
    addLayer,
    updateLayer,
    deleteLayer,
    selectLayer,
    reorderLayers
  } = useCanvasState();

  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleAddLayer = () => {
    const newLayer: Layer = {
      id: `layer-${Date.now()}`,
      name: `طبقة ${layers.length + 1}`,
      visible: true,
      locked: false,
      elements: []
    };
    addLayer(newLayer);
  };

  const handleAddFolder = () => {
    const newFolder: Layer = {
      id: `folder-${Date.now()}`,
      name: `مجلد ${layers.filter(l => l.isFolder).length + 1}`,
      visible: true,
      locked: false,
      elements: [],
      isFolder: true,
      isOpen: true,
      children: []
    };
    addLayer(newFolder);
  };

  const handleEditName = (layer: Layer) => {
    setEditingLayerId(layer.id);
    setEditingName(layer.name);
  };

  const handleSaveName = () => {
    if (editingLayerId && editingName.trim()) {
      updateLayer(editingLayerId, { name: editingName.trim() });
    }
    setEditingLayerId(null);
    setEditingName('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      setEditingLayerId(null);
      setEditingName('');
    }
  };

  const toggleVisibility = (layerId: string, currentState: boolean) => {
    updateLayer(layerId, { visible: !currentState });
  };

  const toggleLock = (layerId: string, currentState: boolean) => {
    updateLayer(layerId, { locked: !currentState });
  };

  const toggleFolder = (layerId: string, currentState: boolean) => {
    updateLayer(layerId, { isOpen: !currentState });
  };

  const renderLayer = (layer: Layer, depth = 0) => {
    const isSelected = selectedLayerId === layer.id;
    const isEditing = editingLayerId === layer.id;

    return (
      <div key={layer.id} className="w-full">
        <div
          className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-accent/50 ${
            isSelected ? 'bg-accent' : ''
          }`}
          style={{ paddingLeft: `${8 + depth * 16}px` }}
          onClick={() => selectLayer(layer.id)}
        >
          {/* Folder Toggle */}
          {layer.isFolder && (
            <Button
              variant="ghost"
              size="sm"
              className="w-4 h-4 p-0"
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(layer.id, layer.isOpen || false);
              }}
            >
              {layer.isOpen ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </Button>
          )}

          {/* Layer Name */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <Input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={handleSaveName}
                onKeyDown={handleKeyPress}
                className="h-6 text-xs"
                autoFocus
              />
            ) : (
              <div
                className="text-sm truncate"
                onDoubleClick={() => handleEditName(layer)}
              >
                {layer.name}
              </div>
            )}
          </div>

          {/* Element Count */}
          {layer.elements.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {layer.elements.length}
            </Badge>
          )}

          {/* Visibility Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="w-6 h-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              toggleVisibility(layer.id, layer.visible);
            }}
          >
            {layer.visible ? (
              <Eye className="w-3 h-3" />
            ) : (
              <EyeOff className="w-3 h-3 text-muted-foreground" />
            )}
          </Button>

          {/* Lock Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="w-6 h-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              toggleLock(layer.id, layer.locked);
            }}
          >
            {layer.locked ? (
              <Lock className="w-3 h-3 text-muted-foreground" />
            ) : (
              <Unlock className="w-3 h-3" />
            )}
          </Button>

          {/* Delete Button */}
          {layers.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0 text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                deleteLayer(layer.id);
              }}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          )}
        </div>

        {/* Children (if folder is open) */}
        {layer.isFolder && layer.isOpen && layer.children && (
          <div className="ml-4">
            {layer.children.map(child => renderLayer(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddLayer}
          className="flex-1"
        >
          <Plus className="w-4 h-4 mr-2" />
          طبقة جديدة
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddFolder}
        >
          <FolderPlus className="w-4 h-4" />
        </Button>
      </div>

      {/* Layers List */}
      <div className="space-y-1">
        {layers.map(layer => renderLayer(layer))}
      </div>

      {/* Layer Info */}
      <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
        <div>📁 {layers.filter(l => l.isFolder).length} مجلد</div>
        <div>🎨 {layers.filter(l => !l.isFolder).length} طبقة</div>
        <div>👁️ {layers.filter(l => l.visible).length} مرئية</div>
        <div>🔒 {layers.filter(l => l.locked).length} مقفلة</div>
      </div>
    </div>
  );
};