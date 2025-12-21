import React, { useState, useRef, useCallback, useEffect } from "react";
import { useCanvasStore } from "@/stores/canvasStore";
import type { CanvasElement } from "@/types/canvas";
import type { MindMapNodeData, NodeAnchorPoint } from "@/types/mindmap-canvas";
import { getAnchorPosition, NODE_COLORS, calculateConnectorBounds } from "@/types/mindmap-canvas";
import { Plus, GripVertical, Trash2, Palette, ChevronDown, ChevronRight, RectangleHorizontal, Circle, Square, Pill } from "lucide-react";
import { redistributeUpwards } from "@/utils/mindmap-layout";
interface MindMapNodeProps {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: (multiSelect: boolean) => void;
  onStartConnection: (
    nodeId: string,
    anchor: "top" | "bottom" | "left" | "right",
    position: { x: number; y: number },
  ) => void;
  // تم إزالة onEndConnection - التوصيل يتم فقط عبر السحب والإفلات في InfiniteCanvas
  isConnecting: boolean;
  nearestAnchor: NodeAnchorPoint | null;
  activeTool: string;
}

const MindMapNode: React.FC<MindMapNodeProps> = ({
  element,
  isSelected,
  onSelect,
  onStartConnection,
  isConnecting,
  nearestAnchor,
  activeTool,
}) => {
  const {
    updateElement,
    deleteElement,
    viewport,
    addElement,
    selectMindMapTree,
    moveElementWithChildren,
    autoResolveOverlapsForMindMap,
    setActiveTool,
    setLastSmartSelectedMindMapNode,
    lastSmartSelectedMindMapNode,
    selectedElementIds,
    selectElement,
  } = useCanvasStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showStylePicker, setShowStylePicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSingleNodeMode, setIsSingleNodeMode] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, elementX: 0, elementY: 0 });
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const nodeData = element.data as MindMapNodeData;

  // ✅ حالة النقرة المطولة للـ anchor
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);
  const LONG_PRESS_DELAY = 200; // مللي ثانية

  // ✅ التحقق من وجود فروع
  const hasChildren = useCanvasStore((state) =>
    state.elements.some((el) => el.type === "mindmap_connector" && (el.data as any)?.startNodeId === element.id),
  );

  // ✅ النقر المزدوج: إذا كانت الشجرة محددة بأداة التحديد → التبديل إلى أداة العناصر الذكية وتحديد هذه العقدة
  // أو بدء التحرير إذا كنا بالفعل على أداة العناصر الذكية
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;
      }

      // ✅ إذا كانت أداة التحديد نشطة (سواء كانت شجرة كاملة أو حتى عقدة واحدة)
      // حوّل إلى أداة العناصر الذكية وحدد هذه العقدة
      if (activeTool === 'selection_tool') {
        setActiveTool('smart_element_tool');
        selectElement(element.id, false);
        setLastSmartSelectedMindMapNode(element.id);
        return;
      }

      // السلوك العادي: بدء التحرير (عند استخدام أداة العناصر الذكية)
      setIsSingleNodeMode(true);
      onSelect(false);
      setIsEditing(true);
      setEditText(nodeData.label || "");
    },
    [nodeData.label, onSelect, activeTool, setActiveTool, selectElement, element.id, setLastSmartSelectedMindMapNode],
  );

  // حفظ التعديل
  const handleSaveEdit = useCallback(() => {
    if (editText.trim()) {
      updateElement(element.id, {
        data: { ...nodeData, label: editText.trim() },
      });
    }
    setIsEditing(false);
  }, [element.id, nodeData, editText, updateElement]);

  // ✅ طي/توسيع الفروع
  const handleToggleCollapse = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      updateElement(element.id, {
        data: { ...nodeData, isCollapsed: !nodeData.isCollapsed },
      });
    },
    [element.id, nodeData, updateElement],
  );

  // إضافة فرع جديد مع توزيع تلقائي متناظر
  const handleAddBranch = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      const state = useCanvasStore.getState();
      const parentCenterY = element.position.y + element.size.height / 2;

      // إنشاء الفرع الجديد على نفس مستوى الأب مبدئياً
      const offset = 200;
      const newNodeHeight = 60;
      const newNodeId = `mindmap-node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      addElement({
        id: newNodeId,
        type: "mindmap_node",
        position: {
          x: element.position.x + element.size.width + offset,
          y: parentCenterY - newNodeHeight / 2,
        },
        size: { width: 160, height: newNodeHeight },
        data: {
          label: "فرع جديد",
          color: NODE_COLORS[Math.floor(Math.random() * NODE_COLORS.length)],
          nodeStyle: "rounded",
          isRoot: false,
        } as MindMapNodeData,
      });

      // حساب الـ bounds الحقيقي للـ connector
      const newNodeX = element.position.x + element.size.width + offset;
      const newNodePos = { x: newNodeX, y: parentCenterY - newNodeHeight / 2 };
      const newNodeSize = { width: 160, height: newNodeHeight };
      const connectorBounds = calculateConnectorBounds(
        { position: element.position, size: element.size },
        { position: newNodePos, size: newNodeSize },
      );

      addElement({
        type: "mindmap_connector",
        position: connectorBounds.position,
        size: connectorBounds.size,
        data: {
          startNodeId: element.id,
          endNodeId: newNodeId,
          startAnchor: { nodeId: element.id, anchor: "right" },
          endAnchor: { nodeId: newNodeId, anchor: "left" },
          curveStyle: "bezier",
          color: nodeData.color || "#3DA8F5",
          strokeWidth: 2,
        },
      });

      // ✅ إعادة توزيع جميع الفروع بشكل متناظر تصاعدياً
      setTimeout(() => {
        const currentState = useCanvasStore.getState();
        const adjustments = redistributeUpwards(element.id, currentState.elements, 80);

        // تطبيق التعديلات
        adjustments.forEach((newPos, nodeId) => {
          currentState.updateElement(nodeId, { position: newPos });
        });
      }, 50);
    },
    [element, nodeData, addElement],
  );

  // تغيير اللون
  const handleColorChange = useCallback(
    (color: string) => {
      updateElement(element.id, {
        data: { ...nodeData, color },
      });
      setShowColorPicker(false);
    },
    [element.id, nodeData, updateElement],
  );

  // سحب العقدة
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isEditing) return;
      e.stopPropagation();

      const multiSelect = e.shiftKey || e.ctrlKey || e.metaKey;

      if (activeTool !== "selection_tool" && activeTool !== "smart_element_tool") {
        onSelect(multiSelect);
        return;
      }

      // ✅ عند استخدام أداة العناصر الذكية، سجّل آخر عقدة محددة
      if (activeTool === "smart_element_tool") {
        setLastSmartSelectedMindMapNode(element.id);
        onSelect(multiSelect);
      } else if (activeTool === "selection_tool" && !isSingleNodeMode && !multiSelect) {
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
        elementY: element.position.y,
      };
    },
    [element, onSelect, activeTool, isEditing, isSingleNodeMode, selectMindMapTree, setLastSmartSelectedMindMapNode],
  );

  // تحريك العقدة - مع الفروع فقط عند استخدام أداة التحديد
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const deltaX = (e.clientX - dragStartRef.current.x) / viewport.zoom;
      const deltaY = (e.clientY - dragStartRef.current.y) / viewport.zoom;

      // ✅ أداة العناصر الذكية: تحريك العقدة فقط
      // ✅ أداة التحديد: تحريك كامل الشجرة (الأصول والفروع)
      const shouldMoveOnlyNode = activeTool === 'smart_element_tool' || isSingleNodeMode;

      if (shouldMoveOnlyNode) {
        updateElement(element.id, {
          position: {
            x: dragStartRef.current.elementX + deltaX,
            y: dragStartRef.current.elementY + deltaY,
          },
        });
      } else {
        const totalDeltaX = dragStartRef.current.elementX + deltaX - element.position.x;
        const totalDeltaY = dragStartRef.current.elementY + deltaY - element.position.y;
        moveElementWithChildren(element.id, totalDeltaX, totalDeltaY);
      }
    },
    [element.id, element.position, viewport.zoom, updateElement, isSingleNodeMode, moveElementWithChildren, activeTool],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // ✅ نقاط الربط - نقرة مطولة + سحب
  const handleAnchorMouseDown = useCallback(
    (e: React.MouseEvent, anchor: "top" | "bottom" | "left" | "right") => {
      e.stopPropagation();
      e.preventDefault();
      
      isLongPressRef.current = false;
      
      // بدء مؤقت النقرة المطولة
      longPressTimerRef.current = setTimeout(() => {
        isLongPressRef.current = true;
        const pos = getAnchorPosition(element.position, element.size, anchor);
        onStartConnection(element.id, anchor, pos);
      }, LONG_PRESS_DELAY);
      
      // إضافة مستمع لـ mousemove لبدء السحب
      const handleMouseMoveForDrag = (moveEvent: MouseEvent) => {
        // إذا تحرك الماوس أكثر من 5px قبل انتهاء المؤقت، ابدأ التوصيل فوراً
        const dx = Math.abs(moveEvent.clientX - e.clientX);
        const dy = Math.abs(moveEvent.clientY - e.clientY);
        
        if ((dx > 5 || dy > 5) && !isLongPressRef.current) {
          if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
          }
          isLongPressRef.current = true;
          const pos = getAnchorPosition(element.position, element.size, anchor);
          onStartConnection(element.id, anchor, pos);
          window.removeEventListener('mousemove', handleMouseMoveForDrag);
        }
      };
      
      const handleMouseUpForDrag = () => {
        if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = null;
        }
        window.removeEventListener('mousemove', handleMouseMoveForDrag);
        window.removeEventListener('mouseup', handleMouseUpForDrag);
      };
      
      window.addEventListener('mousemove', handleMouseMoveForDrag);
      window.addEventListener('mouseup', handleMouseUpForDrag);
    },
    [element, onStartConnection],
  );

  // تم إزالة handleAnchorMouseUp - التوصيل يتم فقط عبر handleMouseUp في InfiniteCanvas
  
  // تنظيف المؤقت عند unmount
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  // إضافة مستمعي الأحداث العامة
  useEffect(() => {
    if (!isDragging) return;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
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

  // ✅ عند التحويل من أداة العناصر الذكية إلى أداة التحديد: حدد كامل الشجرة
  // ✅ عند التحويل من أداة التحديد إلى أداة العناصر الذكية: حدد آخر عقدة محددة أو العقدة الحالية
  useEffect(() => {
    if (!isSelected) return;
    
    if (activeTool === 'selection_tool') {
      // تحويل إلى أداة التحديد → حدد كامل الشجرة
      selectMindMapTree(element.id);
    } else if (activeTool === 'smart_element_tool' && selectedElementIds.length > 1) {
      // تحويل إلى أداة العناصر الذكية من شجرة محددة
      // حدد آخر عقدة تم تحديدها أو أول عقدة في التحديد
      const nodeToSelect = lastSmartSelectedMindMapNode && selectedElementIds.includes(lastSmartSelectedMindMapNode)
        ? lastSmartSelectedMindMapNode
        : element.id;
      selectElement(nodeToSelect, false);
    }
  }, [activeTool]);

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
      backgroundColor: nodeData.color || "#3DA8F5",
      color: nodeData.textColor || "#FFFFFF",
      fontSize: nodeData.fontSize || 14,
    };

    switch (nodeData.nodeStyle) {
      case "pill":
        return { ...baseStyle, borderRadius: "9999px" };
      case "rectangle":
        return { ...baseStyle, borderRadius: "4px" };
      case "circle":
        return { ...baseStyle, borderRadius: "50%" };
      case "rounded":
      default:
        return { ...baseStyle, borderRadius: "12px" };
    }
  };

  // هل هذه العقدة هي الأقرب للتوصيل
  const isNearestForConnection = nearestAnchor?.nodeId === element.id;

  // ✅ التحقق من تحديد الشجرة بالكامل - إخفاء نقاط التوصيل وشريط الأدوات
  const isFullTreeSelected = activeTool === 'selection_tool' && selectedElementIds.length > 1;

  return (
    <div
      ref={nodeRef}
      className={`absolute select-none transition-shadow ${
        activeTool === "selection_tool" ? "cursor-move" : "cursor-default"
      } ${isSelected ? "ring-2 ring-[hsl(var(--accent-green))] ring-offset-2" : ""}`}
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
              if (e.key === "Enter") handleSaveEdit();
              if (e.key === "Escape") setIsEditing(false);
              e.stopPropagation();
            }}
            className="w-full bg-transparent text-center outline-none text-inherit font-medium"
            dir="auto"
          />
        ) : (
          <span className="font-medium text-center truncate" dir="auto">
            {nodeData.label || "عقدة جديدة"}
          </span>
        )}

        {/* ✅ زر الطي/أيقونة الجذر - أعلى يمين العقدة */}
        {(nodeData.isRoot || hasChildren) && (
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={hasChildren ? handleToggleCollapse : undefined}
            className={`absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md border border-[hsl(var(--border))] transition-all z-50 ${
              hasChildren
                ? "cursor-pointer hover:scale-110 text-[hsl(var(--ink-60))] hover:text-[hsl(var(--ink-60))]"
                : "cursor-default"
            }`}
            title={hasChildren ? (nodeData.isCollapsed ? "توسيع الفروع" : "طي الفروع") : "العقدة الجذر"}
          >
            {hasChildren ? (
              nodeData.isCollapsed ? (
                <ChevronRight size={14} />
              ) : (
                <ChevronDown size={14} />
              )
            ) : (
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--accent-green))]" />
            )}
          </button>
        )}
      </div>

      {/* نقاط الربط - تظهر عند التحديد أو التوصيل (مخفية عند تحديد الشجرة بالكامل) */}
      {(isSelected || isConnecting) && !isFullTreeSelected && (
        <>
          {(["top", "bottom", "left", "right"] as const).map((anchor) => {
            const pos = getAnchorPosition({ x: 0, y: 0 }, element.size, anchor);
            const isHighlighted = isNearestForConnection && nearestAnchor?.anchor === anchor;

            return (
              <div
                key={anchor}
                className={`absolute w-4 h-4 rounded-full border-2 transition-all cursor-crosshair ${
                  isHighlighted
                    ? "bg-[hsl(var(--accent-green))] border-white scale-125 shadow-lg"
                    : "bg-white border-[hsl(var(--ink-30))] hover:border-[hsl(var(--ink-60))] hover:scale-110"
                }`}
                style={{
                  left: pos.x - 8,
                  top: pos.y - 8,
                }}
                onMouseDown={(e) => handleAnchorMouseDown(e, anchor)}
              />
            );
          })}
        </>
      )}

      {/* شريط أدوات العقدة - يظهر فقط عند التحديد بأداة العناصر الذكية */}
      {isSelected && !isEditing && activeTool === 'smart_element_tool' && (
        <div 
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/95 backdrop-blur-md rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.12)] p-1.5 border border-[hsl(var(--border))] z-[100]"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {/* إضافة فرع */}
          <button
            onClick={handleAddBranch}
            className="p-2 rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--ink-60))] hover:text-[hsl(var(--accent-green))] transition-colors"
            title="إضافة فرع"
          >
            <Plus size={16} />
          </button>

          {/* تبديل شكل العقدة */}
          <div className="relative">
            <button
              onClick={() => setShowStylePicker(!showStylePicker)}
              className="p-2 rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--ink-60))] hover:text-[hsl(var(--accent-blue))] transition-colors"
              title="شكل العقدة"
            >
              {nodeData.nodeStyle === 'circle' ? <Circle size={16} /> :
               nodeData.nodeStyle === 'rectangle' ? <Square size={16} /> :
               nodeData.nodeStyle === 'pill' ? <Pill size={16} /> :
               <RectangleHorizontal size={16} />}
            </button>

            {showStylePicker && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white rounded-xl shadow-xl p-2 border border-[hsl(var(--border))] flex gap-1 min-w-[120px]">
                {[
                  { type: 'rounded', icon: <RectangleHorizontal size={16} />, label: 'مستدير' },
                  { type: 'pill', icon: <Pill size={16} />, label: 'كبسولة' },
                  { type: 'rectangle', icon: <Square size={16} />, label: 'مستطيل' },
                  { type: 'circle', icon: <Circle size={16} />, label: 'دائري' },
                ].map((style) => (
                  <button
                    key={style.type}
                    onClick={() => {
                      updateElement(element.id, {
                        data: { ...nodeData, nodeStyle: style.type }
                      });
                      setShowStylePicker(false);
                    }}
                    className={`p-2 rounded-lg transition-all ${
                      nodeData.nodeStyle === style.type 
                        ? 'bg-[hsl(var(--accent-blue)/0.15)] text-[hsl(var(--accent-blue))]' 
                        : 'hover:bg-[hsl(var(--muted))] text-[hsl(var(--ink-60))]'
                    }`}
                    title={style.label}
                  >
                    {style.icon}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* تغيير اللون */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-4 h-4 rounded-sm hover:scale-110 transition-all border border-white shadow-sm"
              style={{ backgroundColor: nodeData.color || '#3DA8F5' }}
              title="تغيير اللون"
            />

            {showColorPicker && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white rounded-xl shadow-xl p-2 border border-[hsl(var(--border))] grid grid-cols-4 gap-1.5 min-w-[140px]">
                {NODE_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={`w-7 h-7 rounded-full border-2 hover:scale-110 transition-transform ${
                      nodeData.color === color ? 'border-[hsl(var(--ink))] scale-110' : 'border-white'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* حذف */}
          <button
            onClick={() => deleteElement(element.id)}
            className="p-2 rounded-lg hover:bg-red-50 text-[hsl(var(--ink-60))] hover:text-[#E5564D] transition-colors"
            title="حذف العقدة"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default MindMapNode;
