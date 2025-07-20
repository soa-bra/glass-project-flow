import React, { useState, useEffect, useCallback } from 'react';
import { 
  Layers, 
  Search, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock,
  Folder,
  FolderOpen,
  Link,
  GripVertical,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Interface for layer structure
 */
export interface Layer {
  id: string;
  name: string;
  type: 'layer' | 'group';
  visible: boolean;
  locked: boolean;
  children?: Layer[];
  elementIds: string[];
  parent?: string;
  order: number;
}

/**
 * Interface for drag and drop data
 */
interface DragData {
  layerId: string;
  type: 'layer' | 'group';
}

/**
 * Props for the LayersPanel component
 */
export interface LayersPanelProps {
  /** Array of layers to display */
  layers?: Layer[];
  /** Currently selected layer IDs */
  selectedLayerIds?: string[];
  /** Callback when layers are updated */
  onLayersUpdate?: (layers: Layer[]) => void;
  /** Callback when layer selection changes */
  onLayerSelect?: (layerIds: string[]) => void;
  /** Callback when canvas elements change */
  onCanvasElementsChange?: (elementIds: string[]) => void;
  /** Panel size and position */
  className?: string;
}

/**
 * Layers Panel component for hierarchical layer management with drag-and-drop
 */
export const LayersPanel: React.FC<LayersPanelProps> = ({
  layers: initialLayers = [],
  selectedLayerIds = [],
  onLayersUpdate,
  onLayerSelect,
  onCanvasElementsChange,
  className = "w-80 h-full"
}) => {
  // State management
  const [layers, setLayers] = useState<Layer[]>(initialLayers);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [draggedItem, setDraggedItem] = useState<DragData | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  // Mock initial layers
  useEffect(() => {
    if (initialLayers.length === 0) {
      const mockLayers: Layer[] = [
        {
          id: 'layer-1',
          name: 'Background',
          type: 'layer',
          visible: true,
          locked: false,
          elementIds: ['bg-1', 'bg-2'],
          order: 0
        },
        {
          id: 'group-1',
          name: 'UI Elements',
          type: 'group',
          visible: true,
          locked: false,
          elementIds: [],
          order: 1,
          children: [
            {
              id: 'layer-2',
              name: 'Header',
              type: 'layer',
              visible: true,
              locked: false,
              elementIds: ['header-1'],
              parent: 'group-1',
              order: 0
            },
            {
              id: 'layer-3',
              name: 'Navigation',
              type: 'layer',
              visible: true,
              locked: true,
              elementIds: ['nav-1', 'nav-2'],
              parent: 'group-1',
              order: 1
            }
          ]
        },
        {
          id: 'layer-4',
          name: 'Content',
          type: 'layer',
          visible: false,
          locked: false,
          elementIds: ['content-1', 'content-2', 'content-3'],
          order: 2
        }
      ];
      setLayers(mockLayers);
      setExpandedGroups(new Set(['group-1']));
    }
  }, [initialLayers]);

  // Update parent component when layers change
  useEffect(() => {
    onLayersUpdate?.(layers);
  }, [layers, onLayersUpdate]);

  /**
   * Filter layers based on search term
   */
  const filteredLayers = layers.filter(layer => 
    layer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Create a new layer
   */
  const handleCreateLayer = useCallback(() => {
    const newLayer: Layer = {
      id: `layer-${Date.now()}`,
      name: `Layer ${layers.length + 1}`,
      type: 'layer',
      visible: true,
      locked: false,
      elementIds: [],
      order: layers.length
    };

    const updatedLayers = [...layers, newLayer];
    setLayers(updatedLayers);
  }, [layers]);

  /**
   * Create a new group
   */
  const handleCreateGroup = useCallback(() => {
    const newGroup: Layer = {
      id: `group-${Date.now()}`,
      name: `Group ${layers.filter(l => l.type === 'group').length + 1}`,
      type: 'group',
      visible: true,
      locked: false,
      elementIds: [],
      children: [],
      order: layers.length
    };

    const updatedLayers = [...layers, newGroup];
    setLayers(updatedLayers);
    setExpandedGroups(prev => new Set([...prev, newGroup.id]));
  }, [layers]);

  /**
   * Delete selected layers
   */
  const handleDeleteSelected = useCallback(() => {
    const updatedLayers = layers.filter(layer => !selectedLayerIds.includes(layer.id));
    setLayers(updatedLayers);
    onLayerSelect?.([]);
  }, [layers, selectedLayerIds, onLayerSelect]);

  /**
   * Toggle layer visibility
   */
  const toggleLayerVisibility = useCallback((layerId: string) => {
    const updateLayerVisibility = (layerList: Layer[]): Layer[] => {
      return layerList.map(layer => {
        if (layer.id === layerId) {
          return { ...layer, visible: !layer.visible };
        }
        if (layer.children) {
          return { ...layer, children: updateLayerVisibility(layer.children) };
        }
        return layer;
      });
    };

    setLayers(updateLayerVisibility(layers));
  }, [layers]);

  /**
   * Toggle layer lock
   */
  const toggleLayerLock = useCallback((layerId: string) => {
    const updateLayerLock = (layerList: Layer[]): Layer[] => {
      return layerList.map(layer => {
        if (layer.id === layerId) {
          return { ...layer, locked: !layer.locked };
        }
        if (layer.children) {
          return { ...layer, children: updateLayerLock(layer.children) };
        }
        return layer;
      });
    };

    setLayers(updateLayerLock(layers));
  }, [layers]);

  /**
   * Toggle group expansion
   */
  const toggleGroupExpansion = useCallback((groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  }, []);

  /**
   * Handle layer selection
   */
  const handleLayerSelect = useCallback((layerId: string, multiSelect: boolean = false) => {
    let newSelection: string[];
    
    if (multiSelect) {
      newSelection = selectedLayerIds.includes(layerId)
        ? selectedLayerIds.filter(id => id !== layerId)
        : [...selectedLayerIds, layerId];
    } else {
      newSelection = selectedLayerIds.includes(layerId) ? [] : [layerId];
    }
    
    onLayerSelect?.(newSelection);
  }, [selectedLayerIds, onLayerSelect]);

  /**
   * Handle drag start
   */
  const handleDragStart = (e: React.DragEvent, layer: Layer) => {
    const dragData: DragData = {
      layerId: layer.id,
      type: layer.type
    };
    setDraggedItem(dragData);
    e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';
  };

  /**
   * Handle drag over
   */
  const handleDragOver = (e: React.DragEvent, targetLayerId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTarget(targetLayerId);
  };

  /**
   * Handle drop
   */
  const handleDrop = (e: React.DragEvent, targetLayerId: string) => {
    e.preventDefault();
    setDropTarget(null);
    
    if (!draggedItem) return;

    // Implement layer reordering logic here
    console.log('Dropping', draggedItem.layerId, 'onto', targetLayerId);
    
    // Mock reordering - in real implementation, this would reorder layers
    const draggedLayer = layers.find(l => l.id === draggedItem.layerId);
    const targetLayer = layers.find(l => l.id === targetLayerId);
    
    if (draggedLayer && targetLayer) {
      // Simple reordering example
      const updatedLayers = [...layers];
      const draggedIndex = updatedLayers.findIndex(l => l.id === draggedItem.layerId);
      const targetIndex = updatedLayers.findIndex(l => l.id === targetLayerId);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const [removed] = updatedLayers.splice(draggedIndex, 1);
        updatedLayers.splice(targetIndex, 0, removed);
        setLayers(updatedLayers);
      }
    }
    
    setDraggedItem(null);
  };

  /**
   * Render individual layer item
   */
  const renderLayer = (layer: Layer, depth: number = 0) => {
    const isSelected = selectedLayerIds.includes(layer.id);
    const isDropTarget = dropTarget === layer.id;
    
    return (
      <div
        key={layer.id}
        className={`group relative ${isDropTarget ? 'bg-primary/10' : ''}`}
        style={{ paddingLeft: `${depth * 16}px` }}
      >
        <div
          className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-muted/50 ${
            isSelected ? 'bg-primary/10 border-l-2 border-primary' : ''
          }`}
          draggable
          onDragStart={(e) => handleDragStart(e, layer)}
          onDragOver={(e) => handleDragOver(e, layer.id)}
          onDrop={(e) => handleDrop(e, layer.id)}
          onClick={(e) => handleLayerSelect(layer.id, e.ctrlKey || e.metaKey)}
        >
          <GripVertical className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
          
          {layer.type === 'group' && (
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0"
              onClick={(e) => {
                e.stopPropagation();
                toggleGroupExpansion(layer.id);
              }}
            >
              {expandedGroups.has(layer.id) ? (
                <FolderOpen className="h-3 w-3" />
              ) : (
                <Folder className="h-3 w-3" />
              )}
            </Button>
          )}
          
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => handleLayerSelect(layer.id)}
            className="h-3 w-3"
          />
          
          <span className="flex-1 text-sm truncate">{layer.name}</span>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              toggleLayerVisibility(layer.id);
            }}
          >
            {layer.visible ? (
              <Eye className="h-3 w-3" />
            ) : (
              <EyeOff className="h-3 w-3" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              toggleLayerLock(layer.id);
            }}
          >
            {layer.locked ? (
              <Lock className="h-3 w-3" />
            ) : (
              <Unlock className="h-3 w-3" />
            )}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Rename</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {layer.type === 'group' && layer.children && expandedGroups.has(layer.id) && (
          <div>
            {layer.children.map(child => renderLayer(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className={`${className} flex flex-col`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Layers className="h-5 w-5 text-primary" />
          Layers
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-3 p-4">
        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input
              placeholder="Search layers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-7 h-8 text-sm"
            />
          </div>
          
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleCreateGroup}
            title="Create Group"
          >
            <Folder className="h-3 w-3" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleCreateLayer}
            title="Add Layer"
          >
            <Plus className="h-3 w-3" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            title="Add Link"
          >
            <Link className="h-3 w-3" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleDeleteSelected}
            disabled={selectedLayerIds.length === 0}
            title="Delete Selected"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>

        {/* Layers List */}
        <ScrollArea className="flex-1">
          <div className="space-y-1">
            {filteredLayers.length > 0 ? (
              filteredLayers.map(layer => renderLayer(layer))
            ) : (
              <div className="text-center text-muted-foreground text-sm py-8">
                {searchTerm ? 'No layers found' : 'No layers yet'}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Layer Info */}
        <div className="text-xs text-muted-foreground p-2 bg-muted/50 rounded">
          {selectedLayerIds.length > 0 ? (
            `${selectedLayerIds.length} layer${selectedLayerIds.length !== 1 ? 's' : ''} selected`
          ) : (
            `${layers.length} layer${layers.length !== 1 ? 's' : ''} total`
          )}
        </div>
      </CardContent>
    </Card>
  );
};