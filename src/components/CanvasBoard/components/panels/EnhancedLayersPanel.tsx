import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Trash2, 
  Plus, 
  Search, 
  Link2, 
  Folder, 
  FolderOpen,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

/**
 * Enhanced Layer interface with folder support
 */
export interface EnhancedLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  elements: string[];
  type: 'layer' | 'folder';
  parentId?: string;
  children?: string[];
  isOpen?: boolean;
  color?: string;
  depth?: number;
}

/**
 * Layer action type
 */
export type LayerAction = 
  | 'toggle_visibility'
  | 'toggle_lock'
  | 'delete'
  | 'rename'
  | 'create_folder'
  | 'add_link'
  | 'search';

/**
 * Props for Enhanced Layers Panel
 */
interface EnhancedLayersPanelProps {
  /** قائمة الطبقات - Layers list */
  layers: EnhancedLayer[];
  /** معرف الطبقة المحددة - Selected layer ID */
  selectedLayerId: string | null;
  /** عناصر الكانفاس - Canvas elements */
  elements: any[];
  /** دالة تحديث الطبقات - Layer update callback */
  onLayerUpdate: (layers: EnhancedLayer[]) => void;
  /** دالة تحديد طبقة - Layer selection callback */
  onLayerSelect: (layerId: string) => void;
  /** دالة ربط العناصر - Element linking callback */
  onElementLink?: (layerId: string, elementIds: string[]) => void;
  /** دالة إنشاء مجلد - Folder creation callback */
  onFolderCreate?: (name: string, parentId?: string) => void;
}

/**
 * لوحة الطبقات المحسنة - Enhanced Layers Panel
 * 
 * توفر إدارة متقدمة للطبقات مع دعم المجلدات والسحب والإفلات
 * Provides advanced layer management with folder support and drag-and-drop
 */
export const EnhancedLayersPanel: React.FC<EnhancedLayersPanelProps> = ({
  layers,
  selectedLayerId,
  elements,
  onLayerUpdate,
  onLayerSelect,
  onElementLink,
  onFolderCreate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newLayerName, setNewLayerName] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showLinkInput, setShowLinkInput] = useState<string | null>(null);
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  /**
   * تصفية الطبقات حسب البحث - Filter layers by search
   */
  const filteredLayers = layers.filter(layer =>
    layer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * إضافة طبقة جديدة - Add new layer
   */
  const addNewLayer = useCallback(() => {
    if (!newLayerName.trim()) return;

    const newLayer: EnhancedLayer = {
      id: `layer_${Date.now()}`,
      name: newLayerName.trim(),
      visible: true,
      locked: false,
      elements: [],
      type: 'layer',
      color: '#' + Math.floor(Math.random()*16777215).toString(16)
    };

    onLayerUpdate([...layers, newLayer]);
    setNewLayerName('');
  }, [newLayerName, layers, onLayerUpdate]);

  /**
   * إنشاء مجلد جديد - Create new folder
   */
  const createFolder = useCallback(() => {
    if (selectedItems.length === 0) return;

    const folderName = `مجلد ${layers.filter(l => l.type === 'folder').length + 1}`;
    const folderId = `folder_${Date.now()}`;

    const newFolder: EnhancedLayer = {
      id: folderId,
      name: folderName,
      visible: true,
      locked: false,
      elements: [],
      type: 'folder',
      children: selectedItems,
      isOpen: true,
      color: '#' + Math.floor(Math.random()*16777215).toString(16)
    };

    // تحديث الطبقات المحددة لتصبح أطفال للمجلد
    const updatedLayers = layers.map(layer => {
      if (selectedItems.includes(layer.id)) {
        return { ...layer, parentId: folderId };
      }
      return layer;
    });

    onLayerUpdate([...updatedLayers, newFolder]);
    setSelectedItems([]);
    onFolderCreate?.(folderName, undefined);
  }, [selectedItems, layers, onLayerUpdate, onFolderCreate]);

  /**
   * حذف طبقة أو مجلد - Delete layer or folder
   */
  const deleteLayer = useCallback((layerId: string) => {
    const layerToDelete = layers.find(l => l.id === layerId);
    if (!layerToDelete) return;

    let updatedLayers = layers.filter(l => l.id !== layerId);

    // إذا كان مجلد، نقل الأطفال إلى المستوى الرئيسي
    if (layerToDelete.type === 'folder' && layerToDelete.children) {
      updatedLayers = updatedLayers.map(layer => {
        if (layerToDelete.children?.includes(layer.id)) {
          const { parentId, ...layerWithoutParent } = layer;
          return layerWithoutParent;
        }
        return layer;
      });
    }

    onLayerUpdate(updatedLayers);
  }, [layers, onLayerUpdate]);

  /**
   * تبديل رؤية الطبقة - Toggle layer visibility
   */
  const toggleLayerVisibility = useCallback((layerId: string) => {
    const updatedLayers = layers.map(layer => {
      if (layer.id === layerId) {
        return { ...layer, visible: !layer.visible };
      }
      return layer;
    });
    onLayerUpdate(updatedLayers);
  }, [layers, onLayerUpdate]);

  /**
   * تبديل قفل الطبقة - Toggle layer lock
   */
  const toggleLayerLock = useCallback((layerId: string) => {
    const updatedLayers = layers.map(layer => {
      if (layer.id === layerId) {
        return { ...layer, locked: !layer.locked };
      }
      return layer;
    });
    onLayerUpdate(updatedLayers);
  }, [layers, onLayerUpdate]);

  /**
   * تبديل فتح المجلد - Toggle folder open state
   */
  const toggleFolder = useCallback((folderId: string) => {
    const updatedLayers = layers.map(layer => {
      if (layer.id === folderId && layer.type === 'folder') {
        return { ...layer, isOpen: !layer.isOpen };
      }
      return layer;
    });
    onLayerUpdate(updatedLayers);
  }, [layers, onLayerUpdate]);

  /**
   * تحديث اسم الطبقة - Update layer name
   */
  const updateLayerName = useCallback((layerId: string, newName: string) => {
    if (!newName.trim()) return;

    const updatedLayers = layers.map(layer => {
      if (layer.id === layerId) {
        return { ...layer, name: newName.trim() };
      }
      return layer;
    });
    onLayerUpdate(updatedLayers);
    setEditingLayerId(null);
    setEditingName('');
  }, [layers, onLayerUpdate]);

  /**
   * معالجة السحب والإفلات - Handle drag and drop
   */
  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const reorderedLayers = Array.from(layers);
    const [removed] = reorderedLayers.splice(source.index, 1);
    reorderedLayers.splice(destination.index, 0, removed);

    onLayerUpdate(reorderedLayers);
  }, [layers, onLayerUpdate]);

  /**
   * تحديد/إلغاء تحديد عنصر - Select/deselect item
   */
  const toggleItemSelection = useCallback((layerId: string) => {
    setSelectedItems(prev => {
      if (prev.includes(layerId)) {
        return prev.filter(id => id !== layerId);
      } else {
        return [...prev, layerId];
      }
    });
  }, []);

  /**
   * بدء تعديل اسم الطبقة - Start editing layer name
   */
  const startEditing = useCallback((layer: EnhancedLayer) => {
    setEditingLayerId(layer.id);
    setEditingName(layer.name);
  }, []);

  /**
   * إلغاء التعديل - Cancel editing
   */
  const cancelEditing = useCallback(() => {
    setEditingLayerId(null);
    setEditingName('');
  }, []);

  /**
   * تنظيم الطبقات هرمياً - Organize layers hierarchically
   */
  const organizeLayersHierarchy = useCallback((layers: EnhancedLayer[]) => {
    const rootLayers = layers.filter(layer => !layer.parentId);
    const childLayers = layers.filter(layer => layer.parentId);

    const organizedLayers: EnhancedLayer[] = [];

    const addLayerWithChildren = (layer: EnhancedLayer, depth = 0) => {
      organizedLayers.push({ ...layer, depth });
      
      if (layer.type === 'folder' && layer.isOpen && layer.children) {
        layer.children.forEach(childId => {
          const childLayer = childLayers.find(l => l.id === childId);
          if (childLayer) {
            addLayerWithChildren(childLayer, depth + 1);
          }
        });
      }
    };

    rootLayers.forEach(layer => addLayerWithChildren(layer));
    
    return organizedLayers;
  }, []);

  /**
   * رندر عنصر طبقة - Render layer item
   */
  const renderLayerItem = useCallback((layer: EnhancedLayer & { depth?: number }, index: number) => (
    <Draggable key={layer.id} draggableId={layer.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "group flex items-center gap-2 p-2 rounded-md transition-colors",
            "hover:bg-muted/50",
            selectedLayerId === layer.id && "bg-accent",
            selectedItems.includes(layer.id) && "bg-accent/50",
            snapshot.isDragging && "shadow-lg bg-background border",
            layer.depth && `ml-${layer.depth * 4}`
          )}
          style={provided.draggableProps.style}
          data-depth={layer.depth}
        >
          {/* أيقونة النوع والتبديل */}
          <div className="flex items-center gap-1">
            {layer.type === 'folder' ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0"
                onClick={() => toggleFolder(layer.id)}
              >
                {layer.isOpen ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </Button>
            ) : (
              <div className="w-4" />
            )}
            
            {layer.type === 'folder' ? (
              layer.isOpen ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />
            ) : (
              <div 
                className={`w-3 h-3 rounded-sm border bg-[${layer.color}]`}
              />
            )}
          </div>

          {/* اسم الطبقة */}
          <div 
            className="flex-1 min-w-0 cursor-pointer"
            onClick={() => onLayerSelect(layer.id)}
          >
            {editingLayerId === layer.id ? (
              <Input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={() => updateLayerName(layer.id, editingName)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    updateLayerName(layer.id, editingName);
                  } else if (e.key === 'Escape') {
                    cancelEditing();
                  }
                }}
                className="h-6 text-xs"
                autoFocus
              />
            ) : (
              <span 
                className="text-xs truncate block"
                onDoubleClick={() => startEditing(layer)}
              >
                {layer.name}
              </span>
            )}
          </div>

          {/* إجراءات الطبقة */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => toggleLayerVisibility(layer.id)}
            >
              {layer.visible ? (
                <Eye className="h-3 w-3" />
              ) : (
                <EyeOff className="h-3 w-3 text-muted-foreground" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => toggleLayerLock(layer.id)}
            >
              {layer.locked ? (
                <Lock className="h-3 w-3" />
              ) : (
                <Unlock className="h-3 w-3 text-muted-foreground" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
              onClick={() => deleteLayer(layer.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => toggleItemSelection(layer.id)}
            >
              <input
                type="checkbox"
                checked={selectedItems.includes(layer.id)}
                onChange={() => {}}
                className="w-3 h-3"
              />
            </Button>
          </div>
        </div>
      )}
    </Draggable>
  ), [
    selectedLayerId,
    selectedItems,
    editingLayerId,
    editingName,
    onLayerSelect,
    toggleFolder,
    toggleLayerVisibility,
    toggleLayerLock,
    deleteLayer,
    toggleItemSelection,
    startEditing,
    updateLayerName,
    cancelEditing
  ]);

  return (
    <Card className="h-full flex flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-border/40">
      <CardHeader className="flex-shrink-0 pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>الطبقات</span>
          <span className="text-xs text-muted-foreground">
            {layers.length} طبقة
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-3 min-h-0 p-3 pt-0">
        {/* شريط البحث والأدوات */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input
              placeholder="البحث في الطبقات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
          </div>

          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={createFolder}
              disabled={selectedItems.length === 0}
              className="flex-1 text-xs h-7"
              title="تجميع العناصر المحددة في مجلد"
            >
              <Folder className="h-3 w-3 mr-1" />
              مجلد
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLinkInput(selectedLayerId)}
              disabled={!selectedLayerId}
              className="flex-1 text-xs h-7"
              title="ربط عناصر بالطبقة المحددة"
            >
              <Link2 className="h-3 w-3 mr-1" />
              ربط
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedItems([])}
              disabled={selectedItems.length === 0}
              className="text-xs h-7 px-2"
              title="مسح التحديد"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* إضافة طبقة جديدة */}
        <div className="flex gap-2">
          <Input
            placeholder="اسم الطبقة الجديدة"
            value={newLayerName}
            onChange={(e) => setNewLayerName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addNewLayer()}
            className="flex-1 h-8 text-xs"
          />
          <Button
            onClick={addNewLayer}
            disabled={!newLayerName.trim()}
            size="sm"
            className="h-8 px-3"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        {/* قائمة الطبقات */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="layers">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-1"
                  >
                    {organizeLayersHierarchy(filteredLayers).map((layer, index) =>
                      renderLayerItem(layer, index)
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </ScrollArea>
        </div>

        {/* معلومات إضافية */}
        {selectedItems.length > 0 && (
          <div className="text-xs text-muted-foreground p-2 bg-muted/30 rounded">
            تم تحديد {selectedItems.length} عنصر
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedLayersPanel;