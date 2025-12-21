import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Unlock, Trash2, Plus, GripVertical, Layers } from 'lucide-react';
import { useCanvasStore } from '@/stores/canvasStore';
import { motion } from 'framer-motion';

interface LayersMenuPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LayersMenuPopover: React.FC<LayersMenuPopoverProps> = ({ isOpen, onClose }) => {
  const {
    layers,
    activeLayerId,
    addLayer,
    deleteLayer,
    toggleLayerVisibility,
    toggleLayerLock,
    setActiveLayer
  } = useCanvasStore();
  
  const [isAddingLayer, setIsAddingLayer] = useState(false);
  const [newLayerName, setNewLayerName] = useState('');
  
  if (!isOpen) return null;
  
  const handleAddLayer = () => {
    if (newLayerName.trim()) {
      addLayer(newLayerName);
      setNewLayerName('');
      setIsAddingLayer(false);
    }
  };
  
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-sb-border z-[9999] max-h-[500px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sb-border">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-sb-ink" />
            <h3 className="text-[14px] font-semibold text-sb-ink">
              الطبقات
            </h3>
          </div>
          <button
            onClick={() => setIsAddingLayer(true)}
            className="p-2 hover:bg-sb-panel-bg rounded-full transition-colors"
            title="إضافة طبقة جديدة"
          >
            <Plus size={16} className="text-sb-ink" />
          </button>
        </div>
        
        {/* New Layer Input */}
        {isAddingLayer && (
          <div className="p-3 border-b border-sb-border">
            <input
              autoFocus
              type="text"
              value={newLayerName}
              onChange={(e) => setNewLayerName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddLayer();
                if (e.key === 'Escape') setIsAddingLayer(false);
              }}
              onBlur={handleAddLayer}
              placeholder="اسم الطبقة..."
              className="w-full px-3 py-2 text-[13px] border border-sb-border rounded-[10px] outline-none focus:border-[hsl(var(--accent-green))] transition-colors"
            />
          </div>
        )}
        
        {/* Layers List */}
        <div className="flex-1 overflow-y-auto">
          {layers.map((layer, index) => (
            <motion.div
              key={layer.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`group flex items-center gap-2 px-3 py-3 border-b border-sb-border cursor-pointer transition-colors ${
                activeLayerId === layer.id
                  ? 'bg-sb-panel-bg'
                  : 'hover:bg-[rgba(217,231,237,0.5)]'
              }`}
              onClick={() => setActiveLayer(layer.id)}
            >
              {/* Drag Handle */}
              <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical size={16} className="text-sb-ink-30" />
              </button>
              
              {/* Layer Name */}
              <div className="flex-1 text-[13px] font-medium text-sb-ink truncate">
                {layer.name}
                <span className="ml-2 text-[11px] text-sb-ink-60">
                  ({layer.elements.length})
                </span>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLayerVisibility(layer.id);
                  }}
                  className="p-1 hover:bg-white/50 rounded transition-colors"
                  title={layer.visible ? 'إخفاء الطبقة' : 'إظهار الطبقة'}
                >
                  {layer.visible ? (
                    <Eye size={16} className="text-sb-ink" />
                  ) : (
                    <EyeOff size={16} className="text-sb-ink-30" />
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
                    <Unlock size={16} className="text-sb-ink-30" />
                  )}
                </button>
                
                {layers.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`هل تريد حذف الطبقة "${layer.name}"؟`)) {
                        deleteLayer(layer.id);
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
          ))}
        </div>
        
        {/* Layer Info */}
        {activeLayerId && (
          <div className="p-3 border-t border-sb-border bg-[rgba(217,231,237,0.3)]">
            <p className="text-[11px] text-sb-ink-60">
              الطبقة النشطة: <span className="font-semibold">
                {layers.find(l => l.id === activeLayerId)?.name}
              </span>
            </p>
          </div>
        )}
      </div>
    </>
  );
};
