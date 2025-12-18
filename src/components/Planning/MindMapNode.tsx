import React, { useState, useRef, useCallback, useEffect } from 'react';
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
  const { updateElement, deleteElement, viewport, addElement } = useCanvasStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, elementX: 0, elementY: 0 });
  
  const nodeData = element.data as MindMapNodeData;
  
  // بدء التحرير بالنقر المزدوج
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditText(nodeData.label || '');
  }, [nodeData.label]);
  
  // حفظ التعديل
  const handleSaveEdit = useCallback(() => {
    if (editText.trim()) {
      updateElement(element.id, {
        data: { ...nodeData, label: editText.trim() }
      });
    }
    setIsEditing(false);
  }, [element.id, nodeData, editText, updateElement]);
  
  // إضافة فرع جديد
  const handleAddBranch = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    // إنشاء عقدة جديدة
    const newNodeId = `mindmap-node-${Date.now()}`;
    const offset = 200;
    
    // إضافة العقدة الجديدة
    addElement({
      type: 'mindmap_node',
      position: {
        x: element.position.x + element.size.width + offset,
        y: element.position.y
      },
      size: { width: 160, height: 60 },
      data: {
        label: 'فرع جديد',
        color: NODE_COLORS[Math.floor(Math.random() * NODE_COLORS.length)],
        nodeStyle: 'rounded',
        isRoot: false
      } as MindMapNodeData
    });
    
    // إضافة الرابط
    setTimeout(() => {
      const state = useCanvasStore.getState();
      const newNode = state.elements.find(el => el.type === 'mindmap_node' && el.id !== element.id);
      if (newNode) {
        addElement({
          type: 'mindmap_connector',
          position: { x: 0, y: 0 },
          size: { width: 0, height: 0 },
          data: {
            startNodeId: element.id,
            endNodeId: newNode.id,
            startAnchor: { nodeId: element.id, anchor: 'right' },
            endAnchor: { nodeId: newNode.id, anchor: 'left' },
            curveStyle: 'bezier',
            color: nodeData.color || '#3DA8F5',
            strokeWidth: 2
          }
        });
      }
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
    onSelect(multiSelect);
    
    if (activeTool !== 'selection_tool') return;
    
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      elementX: element.position.x,
      elementY: element.position.y
    };
  }, [element, onSelect, activeTool, isEditing]);
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    
    const deltaX = (e.clientX - dragStartRef.current.x) / viewport.zoom;
    const deltaY = (e.clientY - dragStartRef.current.y) / viewport.zoom;
    
    updateElement(element.id, {
      position: {
        x: dragStartRef.current.elementX + deltaX,
        y: dragStartRef.current.elementY + deltaY
      }
    });
  }, [element.id, viewport.zoom, updateElement]);
  
  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
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
    if (isDraggingRef.current) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [handleMouseMove, handleMouseUp]);
  
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
    </div>
  );
};

export default MindMapNode;
