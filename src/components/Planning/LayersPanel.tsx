import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Unlock, Trash2, Plus, GripVertical } from 'lucide-react';
import { useCanvasStore } from '@/stores/canvasStore';
import { motion } from 'framer-motion';

const LayersPanel: React.FC = () => {
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
  
  const handleAddLayer = () => {
    if (newLayerName.trim()) {
      addLayer(newLayerName);
      setNewLayerName('');
      setIsAddingLayer(false);
    }
  };
  
  return (
    <div className="w-[280px] h-full bg-white border-l border-[hsl(var(--border))] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--border))]">
        <h3 className="text-[16px] font-semibold text-[hsl(var(--ink))]">
          الطبقات
        </h3>
        <button
          onClick={() => setIsAddingLayer(true)}
          className="p-2 hover:bg-[hsl(var(--panel))] rounded-full transition-colors"
          title="إضافة طبقة جديدة"
        >
          <Plus size={18} className="text-[hsl(var(--ink))]" />
        </button>
      </div>
      
      {/* New Layer Input */}
      {isAddingLayer && (
        <div className="p-3 border-b border-[hsl(var(--border))]">
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
            className="w-full px-3 py-2 text-[13px] border border-[hsl(var(--border))] rounded-[10px] outline-none focus:border-[hsl(var(--accent-green))] transition-colors"
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
            className={`group flex items-center gap-2 px-3 py-3 border-b border-[hsl(var(--border))] cursor-pointer transition-colors ${
              activeLayerId === layer.id
                ? 'bg-[hsl(var(--panel))]'
                : 'hover:bg-[rgba(217,231,237,0.5)]'
            }`}
            onClick={() => setActiveLayer(layer.id)}
          >
            {/* Drag Handle */}
            <button className="opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical size={16} className="text-[hsl(var(--ink-30))]" />
            </button>
            
            {/* Layer Name */}
            <div className="flex-1 text-[13px] font-medium text-[hsl(var(--ink))] truncate">
              {layer.name}
              <span className="ml-2 text-[11px] text-[hsl(var(--ink-60))]">
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
        <div className="p-3 border-t border-[hsl(var(--border))] bg-[rgba(217,231,237,0.3)]">
          <p className="text-[11px] text-[hsl(var(--ink-60))]">
            الطبقة النشطة: <span className="font-semibold">
              {layers.find(l => l.id === activeLayerId)?.name}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default LayersPanel;
