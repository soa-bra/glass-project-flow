import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ToolPanelContainer } from '@/components/custom/ToolPanelContainer';
import { 
  ChevronUp, 
  ChevronDown, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Plus,
  Edit3,
  Trash2,
  Copy,
  MoreVertical
} from 'lucide-react';

interface Layer {
  id: string;
  name?: string;
  hidden?: boolean;
  locked?: boolean;
}

interface LayersListPanelProps {
  selectedTool: string;
  layers: Layer[];
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onAddLayer?: (name: string) => void;
  onRenameLayer?: (id: string, name: string) => void;
  onDeleteLayer?: (id: string) => void;
  onDuplicateLayer?: (id: string) => void;
}

export const LayersListPanel: React.FC<LayersListPanelProps> = ({
  selectedTool,
  layers,
  onToggleVisibility,
  onToggleLock,
  onReorder,
  onAddLayer,
  onRenameLayer,
  onDeleteLayer,
  onDuplicateLayer
}) => {
  const [newLayerName, setNewLayerName] = useState('');
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  if (selectedTool !== 'layers') return null;

  const handleAddLayer = () => {
    if (newLayerName.trim()) {
      onAddLayer?.(newLayerName.trim());
      setNewLayerName('');
    }
  };

  const handleStartEdit = (layer: Layer) => {
    setEditingLayerId(layer.id);
    setEditingName(layer.name || layer.id);
  };

  const handleSaveEdit = () => {
    if (editingLayerId && editingName.trim()) {
      onRenameLayer?.(editingLayerId, editingName.trim());
    }
    setEditingLayerId(null);
    setEditingName('');
  };

  const handleCancelEdit = () => {
    setEditingLayerId(null);
    setEditingName('');
  };

  return (
    <ToolPanelContainer title="إدارة الطبقات">
      <div className="space-y-3">
        {/* إضافة طبقة جديدة */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="اسم الطبقة الجديدة"
              value={newLayerName}
              onChange={(e) => setNewLayerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddLayer()}
              className="flex-1 text-sm"
            />
            <Button
              size="sm"
              onClick={handleAddLayer}
              disabled={!newLayerName.trim()}
              className="px-3"
            >
              <Plus size={14} />
            </Button>
          </div>
        </div>

        <Separator />

        {/* قائمة الطبقات */}
        <div className="space-y-2">
          {layers.length === 0 ? (
            <div className="text-center text-muted-foreground py-6 text-sm">
              لا توجد طبقات حالياً
              <br />
              <span className="text-xs">أضف طبقة جديدة للبدء</span>
            </div>
          ) : (
            layers.map((layer, idx) => (
              <div 
                key={layer.id} 
                className="group bg-card border rounded-lg p-2 space-y-2 hover:shadow-sm transition-shadow"
              >
                {/* اسم الطبقة وحالتها */}
                <div className="flex items-center justify-between gap-2">
                  {editingLayerId === layer.id ? (
                    <div className="flex-1 flex gap-1">
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleSaveEdit();
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                        className="flex-1 text-sm h-6"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={handleSaveEdit}
                      >
                        ✓
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={handleCancelEdit}
                      >
                        ✕
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 flex items-center gap-2">
                        <span className="text-sm font-medium truncate">
                          {layer.name || layer.id}
                        </span>
                        <div className="flex gap-1">
                          {layer.hidden && <Badge variant="secondary" className="text-xs px-1 py-0">مخفي</Badge>}
                          {layer.locked && <Badge variant="destructive" className="text-xs px-1 py-0">مقفل</Badge>}
                        </div>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleStartEdit(layer)}
                        title="إعادة تسمية"
                      >
                        <Edit3 size={12} />
                      </Button>
                    </>
                  )}
                </div>

                {/* أدوات التحكم */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => onToggleVisibility(layer.id)}
                      title={layer.hidden ? 'إظهار' : 'إخفاء'}
                    >
                      {layer.hidden ? <EyeOff size={12} /> : <Eye size={12} />}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => onToggleLock(layer.id)}
                      title={layer.locked ? 'إلغاء القفل' : 'قفل'}
                    >
                      {layer.locked ? <Lock size={12} /> : <Unlock size={12} />}
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => onDuplicateLayer?.(layer.id)}
                      title="تكرار"
                    >
                      <Copy size={12} />
                    </Button>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => onReorder(idx, idx - 1)}
                      disabled={idx === 0}
                      title="تحريك للأعلى"
                    >
                      <ChevronUp size={12} />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => onReorder(idx, idx + 1)}
                      disabled={idx === layers.length - 1}
                      title="تحريك للأسفل"
                    >
                      <ChevronDown size={12} />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      onClick={() => onDeleteLayer?.(layer.id)}
                      title="حذف"
                      disabled={layers.length <= 1}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* إحصائيات */}
        {layers.length > 0 && (
          <>
            <Separator />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>إجمالي الطبقات: {layers.length}</span>
              <span>المرئية: {layers.filter(l => !l.hidden).length}</span>
            </div>
          </>
        )}
      </div>
    </ToolPanelContainer>
  );
};