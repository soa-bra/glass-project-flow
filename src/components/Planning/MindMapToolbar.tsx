/**
 * شريط أدوات عائم للخرائط الذهنية
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useCanvasStore } from '@/stores/canvasStore';
import { applyMindMapLayout, getLayoutName, type LayoutType } from '@/utils/mindmap-layout';
import { NODE_COLORS, calculateConnectorBounds } from '@/types/mindmap-canvas';
import type { MindMapNodeData } from '@/types/mindmap-canvas';
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
  GitBranch,
  Sun,
  Waypoints,
  TreeDeciduous
} from 'lucide-react';

interface MindMapToolbarProps {
  selectedNodeIds: string[];
  onClose?: () => void;
}

const LAYOUT_OPTIONS: { type: LayoutType; icon: React.ReactNode; label: string }[] = [
  { type: 'tree', icon: <TreeDeciduous size={16} />, label: 'شجري' },
  { type: 'radial', icon: <Sun size={16} />, label: 'شعاعي' },
  { type: 'organic', icon: <Waypoints size={16} />, label: 'عضوي' },
];

const NODE_STYLES: { type: string; icon: React.ReactNode; label: string }[] = [
  { type: 'rounded', icon: <RectangleHorizontal size={16} />, label: 'مستدير' },
  { type: 'pill', icon: <Pill size={16} />, label: 'كبسولة' },
  { type: 'rectangle', icon: <Square size={16} />, label: 'مستطيل' },
  { type: 'circle', icon: <Circle size={16} />, label: 'دائري' },
];

const MindMapToolbar: React.FC<MindMapToolbarProps> = ({ selectedNodeIds, onClose }) => {
  const { elements, updateElement, deleteElement, addElement, viewport } = useCanvasStore();
  
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLayoutMenu, setShowLayoutMenu] = useState(false);
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  
  // الحصول على العقدة المحددة الأولى
  const selectedNode = elements.find(el => selectedNodeIds.includes(el.id) && el.type === 'mindmap_node');
  const nodeData = selectedNode?.data as MindMapNodeData | undefined;
  
  if (!selectedNode || selectedNodeIds.length === 0) return null;
  
  // حساب موقع الشريط
  const toolbarX = selectedNode.position.x + selectedNode.size.width / 2;
  const toolbarY = selectedNode.position.y - 60;
  
  // إضافة فرع جديد مع توزيع تلقائي
  const handleAddBranch = useCallback(() => {
    if (!selectedNode) return;
    
    // ✅ حساب عدد الفروع الموجودة لهذه العقدة
    const existingConnectors = elements.filter(el => 
      el.type === 'mindmap_connector' && 
      (el.data as any)?.startNodeId === selectedNode.id
    );
    const childCount = existingConnectors.length;
    
    // ✅ توزيع متناظر للفروع (أعلى وأسفل بالتناوب)
    const verticalSpacing = 80;
    const direction = childCount % 2 === 0 ? 1 : -1;
    const step = Math.ceil((childCount + 1) / 2);
    const yOffset = direction * step * verticalSpacing;
    
    const offset = 220;
    
    // ✅ إنشاء ID مُحدد مسبقاً للعقدة الجديدة
    const newNodeId = `mindmap-node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newNodeData: MindMapNodeData = {
      label: 'فرع جديد',
      color: NODE_COLORS[Math.floor(Math.random() * NODE_COLORS.length)],
      nodeStyle: 'rounded',
      isRoot: false
    };
    
    // إضافة العقدة الجديدة مع ID معروف
    addElement({
      id: newNodeId,
      type: 'mindmap_node',
      position: {
        x: selectedNode.position.x + selectedNode.size.width + offset,
        y: selectedNode.position.y + yOffset
      },
      size: { width: 160, height: 60 },
      data: newNodeData
    });
    
    // ✅ إضافة الـ connector مع حساب الـ bounds الحقيقي
    const newNodePos = { x: selectedNode.position.x + selectedNode.size.width + offset, y: selectedNode.position.y + yOffset };
    const newNodeSize = { width: 160, height: 60 };
    const connectorBounds = calculateConnectorBounds(
      { position: selectedNode.position, size: selectedNode.size },
      { position: newNodePos, size: newNodeSize }
    );
    
    addElement({
      type: 'mindmap_connector',
      position: connectorBounds.position,
      size: connectorBounds.size,
      data: {
        startNodeId: selectedNode.id,
        endNodeId: newNodeId,
        startAnchor: { nodeId: selectedNode.id, anchor: 'right' },
        endAnchor: { nodeId: newNodeId, anchor: 'left' },
        curveStyle: 'bezier',
        color: nodeData?.color || '#3DA8F5',
        strokeWidth: 2
      }
    });
  }, [selectedNode, elements, nodeData, addElement]);
  
  // تغيير اللون
  const handleColorChange = useCallback((color: string) => {
    selectedNodeIds.forEach(id => {
      const node = elements.find(el => el.id === id);
      if (node && node.type === 'mindmap_node') {
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
      if (node && node.type === 'mindmap_node') {
        updateElement(id, {
          data: { ...node.data, nodeStyle: style }
        });
      }
    });
    setShowStyleMenu(false);
  }, [selectedNodeIds, elements, updateElement]);
  
  // تطبيق التخطيط
  const handleApplyLayout = useCallback((layoutType: LayoutType) => {
    applyMindMapLayout(layoutType, elements, updateElement);
    setShowLayoutMenu(false);
  }, [elements, updateElement]);
  
  // حذف العقد المحددة
  const handleDelete = useCallback(() => {
    // حذف العقد وجميع الروابط المتصلة بها
    const connectorIds = elements
      .filter(el => el.type === 'mindmap_connector')
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
        {/* إضافة فرع */}
        <button
          onClick={handleAddBranch}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--ink-60))] hover:text-[hsl(var(--accent-green))] transition-colors text-sm font-medium"
          title="إضافة فرع"
        >
          <Plus size={16} />
          <span>فرع</span>
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
                {NODE_COLORS.map((color) => (
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
            title="شكل العقدة"
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
                        ? 'bg-[hsl(var(--accent-green)/0.1)] text-[hsl(var(--accent-green))]' 
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
                className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl p-2 border border-[hsl(var(--border))] min-w-[160px]"
              >
                {LAYOUT_OPTIONS.map((layout) => (
                  <button
                    key={layout.type}
                    onClick={() => handleApplyLayout(layout.type)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--ink-60))] hover:text-[hsl(var(--accent-blue))] transition-colors text-sm"
                  >
                    {layout.icon}
                    <span>{layout.label}</span>
                  </button>
                ))}
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

export default MindMapToolbar;
