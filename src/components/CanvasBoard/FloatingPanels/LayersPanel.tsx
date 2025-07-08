import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Lock, Unlock, Folder, FolderOpen } from 'lucide-react';
// Drag and drop functionality will be added when react-beautiful-dnd is available

interface Layer {
  id: string;
  name: string;
  type: 'element' | 'group';
  visible: boolean;
  locked: boolean;
  children?: Layer[];
}

interface LayersPanelProps {
  visible?: boolean;
  layers?: Layer[];
  onLayerUpdate?: (layers: Layer[]) => void;
  onLayerSelect?: (layerId: string) => void;
  selectedLayerId?: string;
}

const LayersPanel: React.FC<LayersPanelProps> = ({
  visible = true,
  layers = [
    { id: 'layer-1', name: 'الطبقة الأساسية', type: 'element', visible: true, locked: false },
    { id: 'layer-2', name: 'العناصر الذكية', type: 'element', visible: true, locked: false },
    { id: 'group-1', name: 'مجموعة الأشكال', type: 'group', visible: true, locked: false, 
      children: [
        { id: 'layer-3', name: 'مربع', type: 'element', visible: true, locked: false },
        { id: 'layer-4', name: 'دائرة', type: 'element', visible: true, locked: false }
      ]
    }
  ],
  onLayerUpdate,
  onLayerSelect,
  selectedLayerId
}) => {
  const [localLayers, setLocalLayers] = useState<Layer[]>(layers);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['group-1']));

  const toggleLayerVisibility = (layerId: string) => {
    const updateLayerVisibility = (layers: Layer[]): Layer[] => {
      return layers.map(layer => {
        if (layer.id === layerId) {
          return { ...layer, visible: !layer.visible };
        }
        if (layer.children) {
          return { ...layer, children: updateLayerVisibility(layer.children) };
        }
        return layer;
      });
    };

    const updatedLayers = updateLayerVisibility(localLayers);
    setLocalLayers(updatedLayers);
    onLayerUpdate?.(updatedLayers);
  };

  const toggleLayerLock = (layerId: string) => {
    const updateLayerLock = (layers: Layer[]): Layer[] => {
      return layers.map(layer => {
        if (layer.id === layerId) {
          return { ...layer, locked: !layer.locked };
        }
        if (layer.children) {
          return { ...layer, children: updateLayerLock(layer.children) };
        }
        return layer;
      });
    };

    const updatedLayers = updateLayerLock(localLayers);
    setLocalLayers(updatedLayers);
    onLayerUpdate?.(updatedLayers);
  };

  const toggleGroupExpansion = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const renderLayer = (layer: Layer, level: number = 0) => {
    const isSelected = selectedLayerId === layer.id;
    const isExpanded = expandedGroups.has(layer.id);

    return (
      <div key={layer.id} style={{ marginRight: `${level * 16}px` }}>
        <div
          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors
            ${isSelected ? 'bg-soabra-new-canvas-palette-3' : 'hover:bg-soabra-new-canvas-palette-5'}
          `}
          onClick={() => onLayerSelect?.(layer.id)}
        >
          <div className="flex items-center gap-2">
            {layer.type === 'group' && (
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleGroupExpansion(layer.id);
                }}
              >
                {isExpanded ? (
                  <FolderOpen className="w-4 h-4" />
                ) : (
                  <Folder className="w-4 h-4" />
                )}
              </Button>
            )}
            <span className="text-sm text-soabra-new-canvas-text font-arabic">
              {layer.name}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                toggleLayerVisibility(layer.id);
              }}
            >
              {layer.visible ? (
                <Eye className="w-4 h-4 text-soabra-new-canvas-text" />
              ) : (
                <EyeOff className="w-4 h-4 text-gray-400" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                toggleLayerLock(layer.id);
              }}
            >
              {layer.locked ? (
                <Lock className="w-4 h-4 text-soabra-new-canvas-text" />
              ) : (
                <Unlock className="w-4 h-4 text-gray-400" />
              )}
            </Button>
          </div>
        </div>

        {layer.type === 'group' && isExpanded && layer.children && (
          <div className="mt-1">
            {layer.children.map(child => renderLayer(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (!visible) return null;

  return (
    <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40" style={{ width: '6%' }}>
      <Card className="bg-soabra-new-canvas-floating-panels rounded-[32px] shadow-sm border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-soabra-new-canvas-text font-arabic">
            الطبقات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-96 overflow-y-auto">
          {localLayers.map(layer => renderLayer(layer))}
        </CardContent>
      </Card>
    </div>
  );
};

export default LayersPanel;