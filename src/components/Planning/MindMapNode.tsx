import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCanvasStore } from '@/stores/canvasStore';
import type { CanvasElement } from '@/types/canvas';
import type { MindMapNodeData, NodeAnchorPoint } from '@/types/mindmap-canvas';
import { getAnchorPosition, NODE_COLORS } from '@/types/mindmap-canvas';
import { Plus, GripVertical, Trash2, Palette } from 'lucide-react';

interface MindMapNodeProps {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: (multiSelect: boolean) => void;
  onStartConnection: (nodeId: string, anchor: 'top' | 'bottom' | 'left' | 'right', position: { x: number; y: number }) => void;
  onEndConnection: (nodeId: string, anchor: 'top' | 'bottom' | 'left' | 'right') => void;
  isConnecting: boolean;
  nearestAnchor: NodeAnchorPoint | null;
  activeTool: string;
}

const MindMapNode: React.FC<MindMapNodeProps> = ({
  element,
  isSelected,
  onSelect,
  onStartConnection,
  onEndConnection,
  isConnecting,
  nearestAnchor,
  activeTool
}) => {
  const { updateElement, deleteElement, viewport, addElement, selectMindMapTree, moveElementWithChildren } = useCanvasStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSingleNodeMode, setIsSingleNodeMode] = useState(false); // ✅ وضع تحديد العقدة الفردية
  const dragStartRef = useRef({ x: 0, y: 0, elementX: 0, elementY: 0 });
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const nodeData = element.data as MindMapNodeData;
  
  // ✅ بدء التحرير بالنقر المزدوج
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    // إلغاء timeout النقرة العادية
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }
    
    // ✅ النقر المزدوج = تحديد العقدة الفردية + بدء التحرير
    setIsSingleNodeMode(true);
    onSelect(false);
    setIsEditing(true);
    setEditText(nodeData.label || '');
  }, [nodeData.label, onSelect]);
  
  // حفظ التعديل
  const handleSaveEdit = useCallback(() => {
    if (editText.trim()) {
      updateElement(element.id, {
        data: { ...nodeData, label: editText.trim() }
      });
    }
    setIsEditing(false);
  }, [element.id, nodeData, editText, updateElement]);
  
  // إضافة فرع جديد مع توزيع تلقائي
  const handleAddBranch = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    const state = useCanvasStore.getState();
    
    // ✅ حساب عدد الفروع الموجودة لهذه العقدة
    const existingConnectors = state.elements.filter(el => 
      el.type === 'mindmap_connector' && 
      (el.data as any)?.startNodeId === element.id
    );
    const childCount = existingConnectors.length;
    
    // ✅ توزيع متناظر للفروع (أعلى وأسفل بالتناوب)
    const verticalSpacing = 80;
    const direction = childCount % 2 === 0 ? 1 : -1;
    const step = Math.ceil((childCount + 1) / 2);
    const yOffset = direction * step * verticalSpacing;
    
    const offset = 200;
    
    // ✅ إنشاء ID مُحدد مسبقاً للعقدة الجديدة
    const newNodeId = `mindmap-node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // إضافة العقدة الجديدة مع ID معروف
    addElement({
      id: newNodeId,
      type: 'mindmap_node',
      position: {
        x: element.position.x + element.size.width + offset,
        y: element.position.y + yOffset
      },
      size: { width: 160, height: 60 },
      data: {
        label: 'فرع جديد',
        color: NODE_COLORS[Math.floor(Math.random() * NODE_COLORS.length)],
        nodeStyle: 'rounded',
        isRoot: false
      } as MindMapNodeData
    });
    
    // ✅ إضافة الـ connector فوراً (بدون setTimeout)
    addElement({
      type: 'mindmap_connector',
      position: { x: 0, y: 0 },
      size: { width: 0, height: 0 },
      data: {
        startNodeId: element.id,
        endNodeId: newNodeId,
        startAnchor: { nodeId: element.id, anchor: 'right' },
        endAnchor: { nodeId: newNodeId, anchor: 'left' },
        curveStyle: 'bezier',
        color: nodeData.color || '#3DA8F5',
        strokeWidth: 2
      }
    });
  }, [element, nodeData, addElement]);
  
  // تغيير اللون
  const handleColorChange = useCallback((color: string) => {
    updateElement(element.id, {
      data: { ...nodeData, color }
    });
    setShowColorPicker(false);
  }, [element.id, nodeData, updateElement]);
  
  // ✅ سحب العقدة مع سلوك تحديد جديد
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isEditing) return;
    e.stopPropagation();
    
    const multiSelect = e.shiftKey || e.ctrlKey || e.metaKey;
    
    // ✅ السماح بالتحريك مع أداة التحديد أو أداة العنصر الذكي
    if (activeTool !== 'selection_tool' && activeTool !== 'smart_element_tool') {
      onSelect(multiSelect);
      return;
    }
    
    // ✅ النقر العادي بأداة التحديد = تحديد كامل الشجرة
    if (activeTool === 'selection_tool' && !isSingleNodeMode && !multiSelect) {
      // استخدام timeout للتمييز بين النقر العادي والمزدوج
      clickTimeoutRef.current = setTimeout(() => {
        selectMindMapTree(element.id);
      }, 200);
    } else {
      onSelect(multiSelect);
    }
    
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      elementX: element.position.x,
      elementY: element.position.y
    };
  }, [element, onSelect, activeTool, isEditing, isSingleNodeMode, selectMindMapTree]);
  
  // ✅ تحريك العقدة مع الفروع
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const deltaX = (e.clientX - dragStartRef.current.x) / viewport.zoom;
    const deltaY = (e.clientY - dragStartRef.current.y) / viewport.zoom;
    
    // ✅ إذا كنا في وضع العقدة الفردية أو مع أداة التحديد (بعد نقر مزدوج)، نحرك العقدة فقط
    if (isSingleNodeMode) {
      updateElement(element.id, {
        position: {
          x: dragStartRef.current.elementX + deltaX,
          y: dragStartRef.current.elementY + deltaY
        }
      });
    } else {
      // ✅ تحريك العقدة مع كل أبنائها
      const totalDeltaX = dragStartRef.current.elementX + deltaX - element.position.x;
      const totalDeltaY = dragStartRef.current.elementY + deltaY - element.position.y;
      moveElementWithChildren(element.id, totalDeltaX, totalDeltaY);
    }
  }, [element.id, element.position, viewport.zoom, updateElement, isSingleNodeMode, moveElementWithChildren]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  // نقاط الربط
  const handleAnchorMouseDown = useCallback((
    e: React.MouseEvent,
    anchor: 'top' | 'bottom' | 'left' | 'right'
  ) => {
    e.stopPropagation();
    const pos = getAnchorPosition(element.position, element.size, anchor);
    onStartConnection(element.id, anchor, pos);
  }, [element, onStartConnection]);
  
  const handleAnchorMouseUp = useCallback((
    e: React.MouseEvent,
    anchor: 'top' | 'bottom' | 'left' | 'right'
  ) => {
    e.stopPropagation();
    if (isConnecting) {
      onEndConnection(element.id, anchor);
    }
  }, [element.id, isConnecting, onEndConnection]);
  
  // ✅ إضافة مستمعي الأحداث العامة - يعمل الآن بشكل صحيح مع useState
  useEffect(() => {
    if (!isDragging) return;
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);
  
  // ✅ تنظيف timeout والـ single node mode عند إلغاء التحديد
  useEffect(() => {
    if (!isSelected) {
      setIsSingleNodeMode(false);
    }
    
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, [isSelected]);
  
  // التركيز على الإدخال عند التحرير
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  
  // حساب نمط العقدة
  const getNodeStyle = () => {
    const baseStyle: React.CSSProperties = {
      backgroundColor: nodeData.color || '#3DA8F5',
      color: nodeData.textColor || '#FFFFFF',
      fontSize: nodeData.fontSize || 14,
    };
    
    switch (nodeData.nodeStyle) {
      case 'pill':
        return { ...baseStyle, borderRadius: '9999px' };
      case 'rectangle':
        return { ...baseStyle, borderRadius: '4px' };
      case 'circle':
        return { ...baseStyle, borderRadius: '50%' };
      case 'rounded':
      default:
        return { ...baseStyle, borderRadius: '12px' };
    }
  };
  
  // هل هذه العقدة هي الأقرب للتوصيل
  const isNearestForConnection = nearestAnchor?.nodeId === element.id;
  
  return (
    <motion.div
      ref={nodeRef}
      className={`absolute select-none ${
        activeTool === 'selection_tool' ? 'cursor-move' : 'cursor-default'
      } ${isSelected ? 'ring-2 ring-[hsl(var(--accent-green))] ring-offset-2' : ''}`}
      style={{
        width: element.size.width,
        height: element.size.height,
        zIndex: isSelected ? 100 : 10,
      }}
      // ✅ أنيميشن سلسة عند تغيير الموقع (معطلة أثناء السحب)
      initial={false}
      animate={{
        x: element.position.x,
        y: element.position.y,
        scale: isNearestForConnection ? 1.05 : 1,
      }}
      transition={isDragging ? { duration: 0 } : { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30,
        mass: 0.8 
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {/* محتوى العقدة */}
      <div
        className="w-full h-full flex items-center justify-center px-4 py-2 shadow-md transition-all"
        style={getNodeStyle()}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveEdit();
              if (e.key === 'Escape') setIsEditing(false);
              e.stopPropagation();
            }}
            className="w-full bg-transparent text-center outline-none text-inherit font-medium"
            dir="auto"
          />
        ) : (
          <span className="font-medium text-center truncate" dir="auto">
            {nodeData.label || 'عقدة جديدة'}
          </span>
        )}
        
        {/* أيقونة الجذر */}
        {nodeData.isRoot && (
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
            <div className="w-3 h-3 rounded-full bg-[hsl(var(--accent-green))]" />
          </div>
        )}
      </div>
      
      {/* نقاط الربط - تظهر عند التحديد أو التوصيل */}
      {(isSelected || isConnecting) && (
        <>
          {(['top', 'bottom', 'left', 'right'] as const).map((anchor) => {
            const pos = getAnchorPosition({ x: 0, y: 0 }, element.size, anchor);
            const isHighlighted = isNearestForConnection && nearestAnchor?.anchor === anchor;
            
            return (
              <div
                key={anchor}
                className={`absolute w-4 h-4 rounded-full border-2 transition-all cursor-crosshair ${
                  isHighlighted
                    ? 'bg-[hsl(var(--accent-green))] border-white scale-125 shadow-lg'
                    : 'bg-white border-[hsl(var(--ink-30))] hover:border-[hsl(var(--accent-green))] hover:scale-110'
                }`}
                style={{
                  left: pos.x - 8,
                  top: pos.y - 8,
                }}
                onMouseDown={(e) => handleAnchorMouseDown(e, anchor)}
                onMouseUp={(e) => handleAnchorMouseUp(e, anchor)}
              />
            );
          })}
        </>
      )}
      
      {/* شريط أدوات العقدة - يظهر عند التحديد */}
      {isSelected && !isEditing && (
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white rounded-lg shadow-lg p-1 border border-[hsl(var(--border))]">
          {/* إضافة فرع */}
          <button
            onClick={handleAddBranch}
            className="p-1.5 rounded hover:bg-[hsl(var(--muted))] text-[hsl(var(--ink-60))] hover:text-[hsl(var(--accent-green))] transition-colors"
            title="إضافة فرع"
          >
            <Plus size={16} />
          </button>
          
          {/* تغيير اللون */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-1.5 rounded hover:bg-[hsl(var(--muted))] text-[hsl(var(--ink-60))] hover:text-[hsl(var(--accent-blue))] transition-colors"
              title="تغيير اللون"
            >
              <Palette size={16} />
            </button>
            
            {showColorPicker && (
              <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg p-2 border border-[hsl(var(--border))] grid grid-cols-4 gap-1">
                {NODE_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className="w-6 h-6 rounded-full border-2 border-white hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* حذف */}
          <button
            onClick={() => deleteElement(element.id)}
            className="p-1.5 rounded hover:bg-[hsl(var(--muted))] text-[hsl(var(--ink-60))] hover:text-[hsl(var(--accent-red))] transition-colors"
            title="حذف"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default MindMapNode;
