import React, { useState, useMemo } from 'react';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Trash2, 
  Plus, 
  GripVertical, 
  Layers,
  ChevronDown,
  ChevronUp,
  Edit2,
  Check,
  X,
  Copy,
  Merge,
  SplitSquareVertical
} from 'lucide-react';
import { useCanvasStore } from '@/stores/canvasStore';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface LayersMenuPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LayersMenuPopover: React.FC<LayersMenuPopoverProps> = ({ isOpen, onClose }) => {
  const {
    layers,
    elements,
    activeLayerId,
    selectedElementIds,
    addLayer,
    deleteLayer,
    toggleLayerVisibility,
    toggleLayerLock,
    setActiveLayer,
    updateElement
  } = useCanvasStore();
  
  const [isAddingLayer, setIsAddingLayer] = useState(false);
  const [newLayerName, setNewLayerName] = useState('');
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(new Set());
  
  // عناصر كل طبقة
  const elementsByLayer = useMemo(() => {
    const map = new Map<string, typeof elements>();
    layers.forEach(layer => {
      map.set(layer.id, elements.filter(el => el.layerId === layer.id));
    });
    return map;
  }, [layers, elements]);
  
  if (!isOpen) return null;
  
  const handleAddLayer = () => {
    if (newLayerName.trim()) {
      addLayer(newLayerName);
      setNewLayerName('');
      setIsAddingLayer(false);
      toast.success('تم إضافة الطبقة');
    }
  };
  
  const handleRenameLayer = (layerId: string) => {
    if (editingName.trim()) {
      // تحديث اسم الطبقة (يحتاج دالة في الـ store)
      setEditingLayerId(null);
      setEditingName('');
      toast.success('تم تحديث اسم الطبقة');
    }
  };
  
  const handleToggleExpand = (layerId: string) => {
    setExpandedLayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(layerId)) {
        newSet.delete(layerId);
      } else {
        newSet.add(layerId);
      }
      return newSet;
    });
  };
  
  const handleDuplicateLayer = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer) {
      addLayer(`${layer.name} - نسخة`);
      toast.success('تم نسخ الطبقة');
    }
  };
  
  const handleMoveElementToLayer = (elementId: string, targetLayerId: string) => {
    updateElement(elementId, { layerId: targetLayerId });
    toast.success('تم نقل العنصر');
  };
  
  const handleMoveSelectedToLayer = (targetLayerId: string) => {
    selectedElementIds.forEach(id => {
      updateElement(id, { layerId: targetLayerId });
    });
    toast.success(`تم نقل ${selectedElementIds.length} عنصر`);
  };
  
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-[hsl(var(--border))] z-[9999] max-h-[500px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--border))]">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-[hsl(var(--ink))]" />
            <h3 className="text-[14px] font-semibold text-[hsl(var(--ink))]">
              الطبقات
            </h3>
            <span className="text-[11px] text-[hsl(var(--ink-60))] bg-[hsl(var(--panel))] px-2 py-0.5 rounded-full">
              {layers.length}
            </span>
          </div>
          <button
            onClick={() => setIsAddingLayer(true)}
            className="p-2 hover:bg-[hsl(var(--panel))] rounded-full transition-colors"
            title="إضافة طبقة جديدة"
          >
            <Plus size={16} className="text-[hsl(var(--ink))]" />
          </button>
        </div>
        
        {/* Move Selected Elements */}
        {selectedElementIds.length > 0 && (
          <div className="p-3 border-b border-[hsl(var(--border))] bg-[rgba(61,190,139,0.08)]">
            <div className="text-[11px] text-[hsl(var(--ink-60))] mb-2">
              نقل {selectedElementIds.length} عنصر محدد إلى:
            </div>
            <div className="flex flex-wrap gap-1">
              {layers.map(layer => (
                <button
                  key={layer.id}
                  onClick={() => handleMoveSelectedToLayer(layer.id)}
                  className={`text-[11px] px-2 py-1 rounded-full transition-colors ${
                    layer.id === activeLayerId
                      ? 'bg-[hsl(var(--ink))] text-white'
                      : 'bg-[hsl(var(--panel))] hover:bg-[hsl(var(--border))]'
                  }`}
                >
                  {layer.name}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* New Layer Input */}
        {isAddingLayer && (
          <div className="p-3 border-b border-[hsl(var(--border))]">
            <div className="flex items-center gap-2">
              <input
                autoFocus
                type="text"
                value={newLayerName}
                onChange={(e) => setNewLayerName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddLayer();
                  if (e.key === 'Escape') setIsAddingLayer(false);
                }}
                placeholder="اسم الطبقة..."
                className="flex-1 px-3 py-2 text-[13px] border border-[hsl(var(--border))] rounded-[10px] outline-none focus:border-[hsl(var(--accent-green))] transition-colors"
              />
              <button
                onClick={handleAddLayer}
                className="p-2 bg-[hsl(var(--accent-green))] text-white rounded-lg hover:opacity-90"
              >
                <Check size={14} />
              </button>
              <button
                onClick={() => setIsAddingLayer(false)}
                className="p-2 hover:bg-[hsl(var(--panel))] rounded-lg"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}
        
        {/* Layers List */}
        <div className="flex-1 overflow-y-auto">
          {layers.map((layer, index) => {
            const layerElements = elementsByLayer.get(layer.id) || [];
            const isExpanded = expandedLayers.has(layer.id);
            
            return (
              <div key={layer.id}>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`group flex items-center gap-2 px-3 py-3 border-b border-[hsl(var(--border))] cursor-pointer transition-colors ${
                    activeLayerId === layer.id
                      ? 'bg-[hsl(var(--panel))]'
                      : 'hover:bg-[rgba(217,231,237,0.5)]'
                  }`}
                  onClick={() => setActiveLayer(layer.id)}
                >
                  {/* Expand/Collapse */}
                  {layerElements.length > 0 && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleExpand(layer.id);
                      }}
                      className="p-1 hover:bg-white/50 rounded transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronUp size={14} className="text-[hsl(var(--ink-60))]" />
                      ) : (
                        <ChevronDown size={14} className="text-[hsl(var(--ink-60))]" />
                      )}
                    </button>
                  )}
                  
                  {/* Drag Handle */}
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical size={16} className="text-[hsl(var(--ink-30))]" />
                  </button>
                  
                  {/* Layer Name */}
                  {editingLayerId === layer.id ? (
                    <input
                      autoFocus
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRenameLayer(layer.id);
                        if (e.key === 'Escape') setEditingLayerId(null);
                      }}
                      onBlur={() => handleRenameLayer(layer.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 text-[13px] px-2 py-1 border border-[hsl(var(--border))] rounded focus:outline-none focus:border-[hsl(var(--accent-green))]"
                    />
                  ) : (
                    <div 
                      className="flex-1 text-[13px] font-medium text-[hsl(var(--ink))] truncate"
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        setEditingLayerId(layer.id);
                        setEditingName(layer.name);
                      }}
                    >
                      {layer.name}
                      <span className="ml-2 text-[11px] text-[hsl(var(--ink-60))]">
                        ({layerElements.length})
                      </span>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicateLayer(layer.id);
                      }}
                      className="p-1 hover:bg-white/50 rounded transition-colors opacity-0 group-hover:opacity-100"
                      title="نسخ الطبقة"
                    >
                      <Copy size={14} className="text-[hsl(var(--ink-60))]" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLayerVisibility(layer.id);
                      }}
                      className="p-1 hover:bg-white/50 rounded transition-colors"
                      title={layer.visible ? 'إخفاء الطبقة' : 'إظهار الطبقة'}
                    >
                      {layer.visible ? (
                        <Eye size={16} className="text-[hsl(var(--ink))]" />
                      ) : (
                        <EyeOff size={16} className="text-[hsl(var(--ink-30))]" />
                      )}
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLayerLock(layer.id);
                      }}
                      className="p-1 hover:bg-white/50 rounded transition-colors"
                      title={layer.locked ? 'فتح الطبقة' : 'قفل الطبقة'}
                    >
                      {layer.locked ? (
                        <Lock size={16} className="text-[hsl(var(--accent-red))]" />
                      ) : (
                        <Unlock size={16} className="text-[hsl(var(--ink-30))]" />
                      )}
                    </button>
                    
                    {layers.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`هل تريد حذف الطبقة "${layer.name}"؟`)) {
                            deleteLayer(layer.id);
                            toast.success('تم حذف الطبقة');
                          }
                        }}
                        className="p-1 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                        title="حذف الطبقة"
                      >
                        <Trash2 size={16} className="text-[hsl(var(--accent-red))]" />
                      </button>
                    )}
                  </div>
                </motion.div>
                
                {/* Layer Elements (Expanded) */}
                <AnimatePresence>
                  {isExpanded && layerElements.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-[rgba(217,231,237,0.3)] overflow-hidden"
                    >
                      {layerElements.slice(0, 10).map((element) => (
                        <div
                          key={element.id}
                          className={`flex items-center gap-2 px-6 py-2 text-[11px] border-b border-[hsl(var(--border))]/50 hover:bg-white/50 ${
                            selectedElementIds.includes(element.id) ? 'bg-[rgba(61,190,139,0.15)]' : ''
                          }`}
                        >
                          <span className="text-[hsl(var(--ink-60))]">
                            {element.type === 'text' ? '📝' : 
                             element.type === 'shape' ? '⬡' :
                             element.type === 'image' ? '🖼️' :
                             element.type === 'mindmap_node' ? '🧠' :
                             '📦'}
                          </span>
                          <span className="flex-1 truncate text-[hsl(var(--ink))]">
                            {element.content || element.data?.label || element.type}
                          </span>
                          <span className="text-[hsl(var(--ink-30))]">
                            {element.id.slice(0, 6)}
                          </span>
                        </div>
                      ))}
                      {layerElements.length > 10 && (
                        <div className="px-6 py-2 text-[10px] text-[hsl(var(--ink-60))] text-center">
                          +{layerElements.length - 10} عنصر آخر
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
        
        {/* Layer Info & Quick Actions */}
        <div className="p-3 border-t border-[hsl(var(--border))] bg-[rgba(217,231,237,0.3)]">
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-[hsl(var(--ink-60))]">
              الطبقة النشطة: <span className="font-semibold text-[hsl(var(--ink))]">
                {layers.find(l => l.id === activeLayerId)?.name}
              </span>
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  // Flatten all layers
                  toast.info('دمج الطبقات قيد التطوير');
                }}
                className="p-1.5 hover:bg-white/50 rounded transition-colors"
                title="دمج الطبقات"
              >
                <Merge size={14} className="text-[hsl(var(--ink-60))]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
