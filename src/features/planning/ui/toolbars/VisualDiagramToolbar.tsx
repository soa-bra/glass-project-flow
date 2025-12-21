/**
 * شريط أدوات عائم للمخطط البصري
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useCanvasStore } from '@/stores/canvasStore';
import { applyVisualDiagramLayout, DEFAULT_VISUAL_LAYOUT_SETTINGS, type VisualLayoutSettings } from '@/utils/visual-diagram-layout';
import { VISUAL_NODE_COLORS, calculateVisualConnectorBounds } from '@/types/visual-diagram-canvas';
import type { VisualNodeData } from '@/types/visual-diagram-canvas';
import {
  Plus,
  Palette,
  LayoutGrid,
  Circle,
  Square,
  Pill,
  RectangleHorizontal,
  Trash2,
  ChevronDown,
  MoveHorizontal,
  MoveVertical,
  Columns,
  ArrowLeftRight,
  ArrowRightToLine,
  ArrowLeftToLine
} from 'lucide-react';

interface VisualDiagramToolbarProps {
  selectedNodeIds: string[];
  onClose?: () => void;
}

const NODE_STYLES: { type: string; icon: React.ReactNode; label: string }[] = [
  { type: 'rounded', icon: <RectangleHorizontal size={16} />, label: 'مستدير' },
  { type: 'pill', icon: <Pill size={16} />, label: 'كبسولة' },
  { type: 'rectangle', icon: <Square size={16} />, label: 'مستطيل' },
  { type: 'circle', icon: <Circle size={16} />, label: 'دائري' },
];

// مكون زر الراديو
const RadioOption: React.FC<{
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}> = ({ selected, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
      selected 
        ? 'bg-[hsl(var(--accent-blue))] text-white shadow-sm' 
        : 'bg-[hsl(var(--muted))] text-[hsl(var(--ink-60))] hover:bg-[hsl(var(--border))]'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const VisualDiagramToolbar: React.FC<VisualDiagramToolbarProps> = ({ selectedNodeIds, onClose }) => {
  const { elements, updateElement, deleteElement, addElement, viewport } = useCanvasStore();
  
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLayoutMenu, setShowLayoutMenu] = useState(false);
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  
  // إعدادات التخطيط
  const [layoutSettings, setLayoutSettings] = useState<VisualLayoutSettings>(DEFAULT_VISUAL_LAYOUT_SETTINGS);
  
  // تطبيق التخطيط تلقائياً عند تغيير أي إعداد
  const handleLayoutSettingChange = useCallback((newSettings: Partial<VisualLayoutSettings>) => {
    const updatedSettings = { ...layoutSettings, ...newSettings };
    setLayoutSettings(updatedSettings);
    applyVisualDiagramLayout(updatedSettings, elements, updateElement);
  }, [layoutSettings, elements, updateElement]);
  
  // الحصول على العقدة المحددة الأولى
  const selectedNode = elements.find(el => selectedNodeIds.includes(el.id) && el.type === 'visual_node');
  const nodeData = selectedNode?.data as VisualNodeData | undefined;
  
  if (!selectedNode || selectedNodeIds.length === 0) return null;
  
  // حساب موقع الشريط
  const toolbarX = selectedNode.position.x + selectedNode.size.width / 2;
  const toolbarY = selectedNode.position.y - 60;
  
  // إضافة فرع جديد
  const handleAddBranch = useCallback(() => {
    if (!selectedNode) return;
    
    const existingConnectors = elements.filter(el => 
      el.type === 'visual_connector' && 
      (el.data as any)?.startNodeId === selectedNode.id
    );
    const childCount = existingConnectors.length;
    
    const verticalSpacing = 80;
    const direction = childCount % 2 === 0 ? 1 : -1;
    const step = Math.ceil((childCount + 1) / 2);
    const yOffset = direction * step * verticalSpacing;
    
    const offset = 220;
    
    const newNodeId = `visual-node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newNodeData: VisualNodeData = {
      label: 'عنصر جديد',
      color: VISUAL_NODE_COLORS[Math.floor(Math.random() * VISUAL_NODE_COLORS.length)],
      nodeStyle: 'rounded',
      isRoot: false,
      diagramType: 'visual_diagram'
    };
    
    addElement({
      id: newNodeId,
      type: 'visual_node',
      position: {
        x: selectedNode.position.x + selectedNode.size.width + offset,
        y: selectedNode.position.y + yOffset
      },
      size: { width: 160, height: 60 },
      data: newNodeData
    });
    
    const newNodePos = { x: selectedNode.position.x + selectedNode.size.width + offset, y: selectedNode.position.y + yOffset };
    const newNodeSize = { width: 160, height: 60 };
    const connectorBounds = calculateVisualConnectorBounds(
      { position: selectedNode.position, size: selectedNode.size },
      { position: newNodePos, size: newNodeSize }
    );
    
    addElement({
      type: 'visual_connector',
      position: connectorBounds.position,
      size: connectorBounds.size,
      data: {
        startNodeId: selectedNode.id,
        endNodeId: newNodeId,
        startAnchor: { nodeId: selectedNode.id, anchor: 'right' },
        endAnchor: { nodeId: newNodeId, anchor: 'left' },
        curveStyle: 'bezier',
        color: nodeData?.color || '#3DA8F5',
        strokeWidth: 2,
        diagramType: 'visual_diagram'
      }
    });
  }, [selectedNode, elements, nodeData, addElement]);
  
  // تغيير اللون
  const handleColorChange = useCallback((color: string) => {
    selectedNodeIds.forEach(id => {
      const node = elements.find(el => el.id === id);
      if (node && node.type === 'visual_node') {
        updateElement(id, {
          data: { ...node.data, color }
        });
      }
    });
    setShowColorPicker(false);
  }, [selectedNodeIds, elements, updateElement]);
  
  // تغيير نمط العقدة
  const handleStyleChange = useCallback((style: string) => {
    selectedNodeIds.forEach(id => {
      const node = elements.find(el => el.id === id);
      if (node && node.type === 'visual_node') {
        updateElement(id, {
          data: { ...node.data, nodeStyle: style }
        });
      }
    });
    setShowStyleMenu(false);
  }, [selectedNodeIds, elements, updateElement]);
  
  // حذف العقد المحددة
  const handleDelete = useCallback(() => {
    const connectorIds = elements
      .filter(el => el.type === 'visual_connector')
      .filter(el => {
        const data = el.data as any;
        return selectedNodeIds.includes(data.startNodeId) || selectedNodeIds.includes(data.endNodeId);
      })
      .map(el => el.id);
    
    [...selectedNodeIds, ...connectorIds].forEach(id => deleteElement(id));
  }, [selectedNodeIds, elements, deleteElement]);
  
  const screenX = toolbarX * viewport.zoom + viewport.pan.x;
  const screenY = toolbarY * viewport.zoom + viewport.pan.y;
  
  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="fixed z-[9999] flex items-center gap-1 bg-white rounded-xl shadow-xl p-1.5 border border-[hsl(var(--border))]"
        style={{
          left: screenX,
          top: screenY,
          transform: 'translateX(-50%)'
        }}
        dir="rtl"
      >
        {/* إضافة عنصر */}
        <button
          onClick={handleAddBranch}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--ink-60))] hover:text-[hsl(var(--accent-blue))] transition-colors text-sm font-medium"
          title="إضافة عنصر"
        >
          <Plus size={16} />
          <span>عنصر</span>
        </button>
        
        <div className="w-px h-6 bg-[hsl(var(--border))]" />
        
        {/* تغيير اللون */}
        <div className="relative">
          <button
            onClick={() => {
              setShowColorPicker(!showColorPicker);
              setShowLayoutMenu(false);
              setShowStyleMenu(false);
            }}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors"
            title="تغيير اللون"
          >
            <div 
              className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: nodeData?.color || '#3DA8F5' }}
            />
            <ChevronDown size={14} className="text-[hsl(var(--ink-30))]" />
          </button>
          
          <AnimatePresence>
            {showColorPicker && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl p-3 border border-[hsl(var(--border))] grid grid-cols-4 gap-2 min-w-[160px]"
              >
                {VISUAL_NODE_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                      nodeData?.color === color ? 'border-[hsl(var(--ink))] scale-110' : 'border-white'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* تغيير الشكل */}
        <div className="relative">
          <button
            onClick={() => {
              setShowStyleMenu(!showStyleMenu);
              setShowColorPicker(false);
              setShowLayoutMenu(false);
            }}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--ink-60))] transition-colors"
            title="شكل العنصر"
          >
            <RectangleHorizontal size={16} />
            <ChevronDown size={14} className="text-[hsl(var(--ink-30))]" />
          </button>
          
          <AnimatePresence>
            {showStyleMenu && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl p-2 border border-[hsl(var(--border))] min-w-[140px]"
              >
                {NODE_STYLES.map((style) => (
                  <button
                    key={style.type}
                    onClick={() => handleStyleChange(style.type)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                      nodeData?.nodeStyle === style.type 
                        ? 'bg-[hsl(var(--accent-blue)/0.1)] text-[hsl(var(--accent-blue))]' 
                        : 'hover:bg-[hsl(var(--muted))] text-[hsl(var(--ink-60))]'
                    }`}
                  >
                    {style.icon}
                    <span>{style.label}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="w-px h-6 bg-[hsl(var(--border))]" />
        
        {/* تخطيط تلقائي */}
        <div className="relative">
          <button
            onClick={() => {
              setShowLayoutMenu(!showLayoutMenu);
              setShowColorPicker(false);
              setShowStyleMenu(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--ink-60))] hover:text-[hsl(var(--accent-blue))] transition-colors text-sm font-medium"
            title="تخطيط تلقائي"
          >
            <LayoutGrid size={16} />
            <span>تخطيط</span>
            <ChevronDown size={14} className="text-[hsl(var(--ink-30))]" />
          </button>
          
          <AnimatePresence>
            {showLayoutMenu && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl p-4 border border-[hsl(var(--border))] min-w-[280px]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* التعامد */}
                <div className="mb-4">
                  <label className="text-xs font-semibold text-[hsl(var(--ink-60))] mb-2 block">
                    التعامد
                  </label>
                  <div className="flex gap-2">
                    <RadioOption 
                      selected={layoutSettings.orientation === 'horizontal'}
                      onClick={() => handleLayoutSettingChange({ orientation: 'horizontal' })}
                      icon={<MoveHorizontal size={14} />}
                      label="عرضي"
                    />
                    <RadioOption 
                      selected={layoutSettings.orientation === 'vertical'}
                      onClick={() => handleLayoutSettingChange({ orientation: 'vertical' })}
                      icon={<MoveVertical size={14} />}
                      label="طولي"
                    />
                  </div>
                </div>
                
                {/* التناظر */}
                <div className="mb-4">
                  <label className="text-xs font-semibold text-[hsl(var(--ink-60))] mb-2 block">
                    التناظر
                  </label>
                  <div className="flex gap-2">
                    <RadioOption 
                      selected={layoutSettings.symmetry === 'symmetric'}
                      onClick={() => handleLayoutSettingChange({ symmetry: 'symmetric' })}
                      icon={<ArrowLeftRight size={14} />}
                      label="تناظري"
                    />
                    <RadioOption 
                      selected={layoutSettings.symmetry === 'unilateral'}
                      onClick={() => handleLayoutSettingChange({ symmetry: 'unilateral' })}
                      icon={<Columns size={14} />}
                      label="أحادي"
                    />
                  </div>
                </div>
                
                {/* الاتجاه */}
                <div>
                  <label className="text-xs font-semibold text-[hsl(var(--ink-60))] mb-2 block">
                    الاتجاه
                  </label>
                  <div className="flex gap-2">
                    <RadioOption 
                      selected={layoutSettings.direction === 'rtl'}
                      onClick={() => handleLayoutSettingChange({ direction: 'rtl' })}
                      icon={<ArrowRightToLine size={14} />}
                      label={layoutSettings.orientation === 'horizontal' ? 'يمين ← يسار' : 'أعلى ← أسفل'}
                    />
                    <RadioOption 
                      selected={layoutSettings.direction === 'ltr'}
                      onClick={() => handleLayoutSettingChange({ direction: 'ltr' })}
                      icon={<ArrowLeftToLine size={14} />}
                      label={layoutSettings.orientation === 'horizontal' ? 'يسار ← يمين' : 'أسفل ← أعلى'}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="w-px h-6 bg-[hsl(var(--border))]" />
        
        {/* حذف */}
        <button
          onClick={handleDelete}
          className="p-1.5 rounded-lg hover:bg-[hsl(var(--accent-red)/0.1)] text-[hsl(var(--ink-60))] hover:text-[hsl(var(--accent-red))] transition-colors"
          title="حذف"
        >
          <Trash2 size={16} />
        </button>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default VisualDiagramToolbar;
