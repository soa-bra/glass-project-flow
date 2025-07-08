
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Layers, Eye, EyeOff, Lock, Unlock, Plus, Trash2, 
  ChevronDown, ChevronRight, Folder, FolderOpen, GripVertical 
} from 'lucide-react';

interface LayerItem {
  id: string;
  name: string;
  type: 'layer' | 'folder';
  visible: boolean;
  locked: boolean;
  children?: LayerItem[];
  expanded?: boolean;
  elements?: string[];
}

interface EnhancedLayersPanelProps {
  layers: LayerItem[];
  selectedLayerId: string | null;
  onLayerUpdate: (layers: LayerItem[]) => void;
  onLayerSelect: (layerId: string) => void;
  onCreateFolder?: () => void;
  onDeleteLayer?: (layerId: string) => void;
}

const EnhancedLayersPanel: React.FC<EnhancedLayersPanelProps> = ({
  layers,
  selectedLayerId,
  onLayerUpdate,
  onLayerSelect,
  onCreateFolder,
  onDeleteLayer
}) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [newLayerName, setNewLayerName] = useState('');

  const toggleLayerVisibility = (layerId: string) => {
    const updateLayerVisibility = (items: LayerItem[]): LayerItem[] => {
      return items.map(item => {
        if (item.id === layerId) {
          return { ...item, visible: !item.visible };
        }
        if (item.children) {
          return { ...item, children: updateLayerVisibility(item.children) };
        }
        return item;
      });
    };
    
    onLayerUpdate(updateLayerVisibility(layers));
  };

  const toggleLayerLock = (layerId: string) => {
    const updateLayerLock = (items: LayerItem[]): LayerItem[] => {
      return items.map(item => {
        if (item.id === layerId) {
          return { ...item, locked: !item.locked };
        }
        if (item.children) {
          return { ...item, children: updateLayerLock(item.children) };
        }
        return item;
      });
    };
    
    onLayerUpdate(updateLayerLock(layers));
  };

  const toggleFolderExpansion = (folderId: string) => {
    const updateFolderExpansion = (items: LayerItem[]): LayerItem[] => {
      return items.map(item => {
        if (item.id === folderId && item.type === 'folder') {
          return { ...item, expanded: !item.expanded };
        }
        if (item.children) {
          return { ...item, children: updateFolderExpansion(item.children) };
        }
        return item;
      });
    };
    
    onLayerUpdate(updateFolderExpansion(layers));
  };

  const addNewLayer = () => {
    const name = newLayerName.trim() || `طبقة ${layers.length + 1}`;
    const newLayer: LayerItem = {
      id: `layer-${Date.now()}`,
      name,
      type: 'layer',
      visible: true,
      locked: false,
      elements: []
    };
    onLayerUpdate([...layers, newLayer]);
    setNewLayerName('');
  };

  const addNewFolder = () => {
    const newFolder: LayerItem = {
      id: `folder-${Date.now()}`,
      name: `مجلد جديد`,
      type: 'folder',
      visible: true,
      locked: false,
      expanded: true,
      children: []
    };
    onLayerUpdate([...layers, newFolder]);
  };

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetId) return;
    
    // Implement drag and drop logic here
    setDraggedItem(null);
  };

  const renderLayerItem = (item: LayerItem, depth: number = 0) => (
    <div key={item.id} className="select-none">
      <div
        className={`flex items-center gap-1 p-2 rounded-xl cursor-pointer transition-colors ${
          selectedLayerId === item.id
            ? 'bg-[#96d8d0] text-[#000000]'
            : 'hover:bg-white/30'
        }`}
        style={{ paddingRight: `${depth * 16 + 8}px` }}
        onClick={() => onLayerSelect(item.id)}
        draggable
        onDragStart={(e) => handleDragStart(e, item.id)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, item.id)}
      >
        <GripVertical className="w-3 h-3 text-gray-400 hover:text-[#000000]" />
        
        {item.type === 'folder' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFolderExpansion(item.id);
            }}
            className="hover:bg-white/20 rounded p-1"
          >
            {item.expanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </button>
        )}
        
        {item.type === 'folder' ? (
          item.expanded ? (
            <FolderOpen className="w-4 h-4 text-[#a4e2f6]" />
          ) : (
            <Folder className="w-4 h-4 text-[#a4e2f6]" />
          )
        ) : (
          <Layers className="w-4 h-4 text-[#96d8d0]" />
        )}
        
        <Input
          value={item.name}
          onChange={(e) => {
            // Update layer name logic
          }}
          className="flex-1 text-sm font-arabic border-none p-0 h-auto bg-transparent text-[#000000]"
          onClick={(e) => e.stopPropagation()}
        />
        
        <div className="flex items-center gap-1">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              toggleLayerVisibility(item.id);
            }}
            size="sm"
            variant="ghost"
            className="w-6 h-6 p-0 hover:bg-white/20 rounded-lg"
          >
            {item.visible ? (
              <Eye className="w-3 h-3 text-[#000000]" />
            ) : (
              <EyeOff className="w-3 h-3 text-gray-400" />
            )}
          </Button>
          
          <Button
            onClick={(e) => {
              e.stopPropagation();
              toggleLayerLock(item.id);
            }}
            size="sm"
            variant="ghost"
            className="w-6 h-6 p-0 hover:bg-white/20 rounded-lg"
          >
            {item.locked ? (
              <Lock className="w-3 h-3 text-[#f1b5b9]" />
            ) : (
              <Unlock className="w-3 h-3 text-[#000000]" />
            )}
          </Button>
          
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteLayer?.(item.id);
            }}
            size="sm"
            variant="ghost"
            className="w-6 h-6 p-0 hover:bg-white/20 rounded-lg text-[#f1b5b9] hover:text-red-700"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
      
      {item.type === 'folder' && item.expanded && item.children && (
        <div>
          {item.children.map(child => renderLayerItem(child, depth + 1))}
        </div>
      )}
    </div>
  );

  return (
    <Card className="w-80 bg-[#f2f9fb] backdrop-blur-xl shadow-sm border border-white/20 rounded-[24px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic text-[#000000] flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#96d8d0]" />
          إدارة الطبقات
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Add Layer/Folder Controls */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={newLayerName}
              onChange={(e) => setNewLayerName(e.target.value)}
              placeholder="اسم الطبقة الجديدة"
              className="flex-1 rounded-xl border-white/30 bg-white/50 text-[#000000] font-arabic text-sm"
              onKeyPress={(e) => e.key === 'Enter' && addNewLayer()}
            />
            <Button
              onClick={addNewLayer}
              size="sm"
              className="rounded-xl bg-[#96d8d0] hover:bg-[#7cc4bc] text-[#000000]"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <Button
            onClick={addNewFolder}
            size="sm"
            className="w-full rounded-xl bg-[#a4e2f6] hover:bg-[#8dd5f1] text-[#000000] font-arabic"
          >
            <Folder className="w-4 h-4 ml-1" />
            إضافة مجلد
          </Button>
        </div>

        {/* Layers List */}
        <div className="bg-white/30 rounded-xl border border-white/30">
          <ScrollArea className="max-h-80">
            <div className="p-2 space-y-1">
              {layers.map(layer => renderLayerItem(layer))}
              {layers.length === 0 && (
                <div className="text-center py-8 text-gray-500 font-arabic">
                  لا توجد طبقات بعد
                  <br />
                  ابدأ بإضافة عناصر إلى الكانفس
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Tips */}
        <div className="bg-[#e9eff4] p-3 rounded-xl border border-[#d1e1ea]">
          <div className="text-xs text-[#000000] font-arabic space-y-1">
            <div>📁 استخدم المجلدات لتنظيم الطبقات المترابطة</div>
            <div>👁️ أخفِ الطبقات غير المرغوبة مؤقتاً</div>
            <div>🔒 اقفل الطبقات لحمايتها من التعديل</div>
            <div>↕️ اسحب الطبقات لإعادة ترتيبها</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedLayersPanel;
