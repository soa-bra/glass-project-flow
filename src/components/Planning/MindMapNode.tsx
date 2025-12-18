import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import type { CanvasElement } from '@/types/canvas';
import type { MindMapNodeData, NodeAnchorPoint } from '@/types/mindmap-canvas';
import { getAnchorPosition, NODE_COLORS } from '@/types/mindmap-canvas';
import { Plus, GripVertical, Trash2, Palette, ChevronDown, ChevronRight } from 'lucide-react';

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
  const { updateElement, deleteElement, viewport, addElement, selectMindMapTree, moveElementWithChildren, autoResolveOverlapsForMindMap } = useCanvasStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSingleNodeMode, setIsSingleNodeMode] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, elementX: 0, elementY: 0 });
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const nodeData = element.data as MindMapNodeData;
  
  // ✅ التحقق من وجود فروع
  const hasChildren = useCanvasStore(state => 
    state.elements.some(el => 
      el.type === 'mindmap_connector' && 
      (el.data as any)?.startNodeId === element.id
    )
  );
  
  // ✅ بدء التحرير بالنقر المزدوج
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }
    
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
  
  // ✅ طي/توسيع الفروع
  const handleToggleCollapse = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    updateElement(element.id, {
      data: { ...nodeData, isCollapsed: !nodeData.isCollapsed }
    });
  }, [element.id, nodeData, updateElement]);
  
  // إضافة فرع جديد مع توزيع تلقائي وتجنب التداخل
  const handleAddBranch = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    const state = useCanvasStore.getState();
    
    // الحصول على جميع الأبناء الحاليين لهذه العقدة
    const existingConnectors = state.elements.filter(el => 
      el.type === 'mindmap_connector' && 
      (el.data as any)?.startNodeId === element.id
    );
    
    // حساب حدود كل فرع موجود (شاملة الأحفاد)
    const getSubtreeBounds = (nodeId: string): { top: number; bottom: number } => {
      const node = state.elements.find(el => el.id === nodeId);
      if (!node) return { top: 0, bottom: 0 };
      
      let minY = node.position.y;
      let maxY = node.position.y + node.size.height;
      
      const childConnectors = state.elements.filter(el => 
        el.type === 'mindmap_connector' && 
        (el.data as any)?.startNodeId === nodeId
      );
      
      childConnectors.forEach(conn => {
        const childId = (conn.data as any)?.endNodeId;
        if (childId) {
          const childBounds = getSubtreeBounds(childId);
          minY = Math.min(minY, childBounds.top);
          maxY = Math.max(maxY, childBounds.bottom);
        }
      });
      
      return { top: minY, bottom: maxY };
    };
    
    const siblingBounds = existingConnectors.map(conn => {
      const childId = (conn.data as any)?.endNodeId;
      return getSubtreeBounds(childId);
    });
    
    // إيجاد موقع متاح للفرع الجديد
    const newNodeHeight = 60;
    const verticalGap = 80;
    const parentCenterY = element.position.y + element.size.height / 2;
    
    let yPosition = parentCenterY;
    
    if (siblingBounds.length > 0) {
      const sorted = [...siblingBounds].sort((a, b) => a.top - b.top);
      
      const childCount = siblingBounds.length;
      const direction = childCount % 2 === 0 ? 1 : -1;
      const step = Math.ceil((childCount + 1) / 2);
      yPosition = parentCenterY + direction * step * (newNodeHeight + verticalGap);
      
      const halfHeight = newNodeHeight / 2;
      let hasOverlap = true;
      let attempts = 0;
      
      while (hasOverlap && attempts < 20) {
        hasOverlap = false;
        const proposedTop = yPosition - halfHeight - verticalGap / 2;
        const proposedBottom = yPosition + halfHeight + verticalGap / 2;
        
        for (const sibling of sorted) {
          if (proposedBottom > sibling.top && proposedTop < sibling.bottom) {
            hasOverlap = true;
            if (direction > 0) {
              yPosition = sibling.bottom + halfHeight + verticalGap;
            } else {
              yPosition = sibling.top - halfHeight - verticalGap;
            }
            break;
          }
        }
        attempts++;
      }
    }
    
    const offset = 200;
    const newNodeId = `mindmap-node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    addElement({
      id: newNodeId,
      type: 'mindmap_node',
      position: {
        x: element.position.x + element.size.width + offset,
        y: yPosition - newNodeHeight / 2
      },
      size: { width: 160, height: newNodeHeight },
      data: {
        label: 'فرع جديد',
        color: NODE_COLORS[Math.floor(Math.random() * NODE_COLORS.length)],
        nodeStyle: 'rounded',
        isRoot: false
      } as MindMapNodeData
    });
    
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
    
    // ✅ تفعيل الإزاحة التلقائية بعد إضافة الفرع
    setTimeout(() => {
      useCanvasStore.getState().autoResolveOverlapsForMindMap?.();
    }, 50);
  }, [element, nodeData, addElement]);
  
  // تغيير اللون
  const handleColorChange = useCallback((color: string) => {
    updateElement(element.id, {
      data: { ...nodeData, color }
    });
    setShowColorPicker(false);
  }, [element.id, nodeData, updateElement]);
  
  // سحب العقدة
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isEditing) return;
    e.stopPropagation();
    
    const multiSelect = e.shiftKey || e.ctrlKey || e.metaKey;
    
    if (activeTool !== 'selection_tool' && activeTool !== 'smart_element_tool') {
      onSelect(multiSelect);
      return;
    }
    
    if (activeTool === 'selection_tool' && !isSingleNodeMode && !multiSelect) {
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
  
  // تحريك العقدة مع الفروع
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const deltaX = (e.clientX - dragStartRef.current.x) / viewport.zoom;
    const deltaY = (e.clientY - dragStartRef.current.y) / viewport.zoom;
    
    if (isSingleNodeMode) {
      updateElement(element.id, {
        position: {
          x: dragStartRef.current.elementX + deltaX,
          y: dragStartRef.current.elementY + deltaY
        }
      });
    } else {
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
  
  // إضافة مستمعي الأحداث العامة
  useEffect(() => {
    if (!isDragging) return;
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);
  
  // تنظيف
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
    <div
      ref={nodeRef}
      className={`absolute select-none transition-shadow ${
        activeTool === 'selection_tool' ? 'cursor-move' : 'cursor-default'
      } ${isSelected ? 'ring-2 ring-[hsl(var(--accent-green))] ring-offset-2' : ''}`}
      style={{
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        zIndex: isSelected ? 100 : 10,
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {/* محتوى العقدة */}
      <div
        className="w-full h-full flex items-center justify-center px-4 py-2 shadow-md transition-all relative"
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
        
        {/* ✅ زر الطي - يظهر إذا كان للعقدة فروع */}
        {hasChildren && (
          <button
            onClick={handleToggleCollapse}
            className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-md border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--ink-60))] hover:text-[hsl(var(--accent-blue))] transition-colors"
            title={nodeData.isCollapsed ? "توسيع الفروع" : "طي الفروع"}
          >
            {nodeData.isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
          </button>
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
          
          {/* ✅ طي/توسيع */}
          {hasChildren && (
            <button
              onClick={handleToggleCollapse}
              className="p-1.5 rounded hover:bg-[hsl(var(--muted))] text-[hsl(var(--ink-60))] hover:text-[hsl(var(--accent-blue))] transition-colors"
              title={nodeData.isCollapsed ? "توسيع الفروع" : "طي الفروع"}
            >
              {nodeData.isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
          
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
    </div>
  );
};

export default MindMapNode;
