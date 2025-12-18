import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import type { CanvasElement } from '@/types/canvas';
import type { MindMapConnectorData, MindMapNodeData } from '@/types/mindmap-canvas';
import { 
  getAnchorPosition, 
  createBezierPath, 
  createStraightPath, 
  createElbowPath 
} from '@/types/mindmap-canvas';
import { Trash2, Type } from 'lucide-react';

interface MindMapConnectorProps {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: (multiSelect: boolean) => void;
}

const MindMapConnector: React.FC<MindMapConnectorProps> = ({
  element,
  isSelected,
  onSelect
}) => {
  const { elements, deleteElement, updateElement } = useCanvasStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [labelText, setLabelText] = useState('');
  
  // ✅ الاحتفاظ بآخر موقع معروف لمنع الاختفاء
  const lastPositionsRef = useRef<{start: {x: number, y: number}, end: {x: number, y: number}} | null>(null);
  
  const connectorData = element.data as MindMapConnectorData;
  
  // الحصول على العقد المتصلة
  const startNode = useMemo(() => 
    elements.find(el => el.id === connectorData.startNodeId),
    [elements, connectorData.startNodeId]
  );
  
  const endNode = useMemo(() => 
    elements.find(el => el.id === connectorData.endNodeId),
    [elements, connectorData.endNodeId]
  );
  
  // ✅ التحقق من الطي - إخفاء إذا كان الأب مطوياً
  const isHiddenByCollapse = useMemo(() => {
    if (!startNode) return false;
    const parentData = startNode.data as MindMapNodeData;
    return parentData?.isCollapsed === true;
  }, [startNode]);
  
  // ✅ حساب مواقع نقاط الربط مع offset للروابط المتعددة
  const positions = useMemo(() => {
    if (!startNode || !endNode) {
      return lastPositionsRef.current; // ✅ استخدام آخر موقع معروف
    }
    
    const startAnchor = connectorData.startAnchor?.anchor || 'right';
    const endAnchor = connectorData.endAnchor?.anchor || 'left';
    
    // حساب عدد الروابط الأخرى من نفس النقطة
    const sameStartAnchorConnectors = elements.filter(el => {
      if (el.type !== 'mindmap_connector' || el.id === element.id) return false;
      const data = el.data as any;
      return data?.startNodeId === connectorData.startNodeId && 
             data?.startAnchor?.anchor === startAnchor;
    });
    
    const sameEndAnchorConnectors = elements.filter(el => {
      if (el.type !== 'mindmap_connector' || el.id === element.id) return false;
      const data = el.data as any;
      return data?.endNodeId === connectorData.endNodeId && 
             data?.endAnchor?.anchor === endAnchor;
    });
    
    // حساب index للرابط الحالي
    const startIndex = sameStartAnchorConnectors.length;
    const endIndex = sameEndAnchorConnectors.length;
    
    // حساب offset (توزيع متناظر)
    const offsetAmount = 8;
    const startOffset = (startIndex - sameStartAnchorConnectors.length / 2) * offsetAmount;
    const endOffset = (endIndex - sameEndAnchorConnectors.length / 2) * offsetAmount;
    
    const baseStartPos = getAnchorPosition(
      startNode.position,
      startNode.size,
      startAnchor
    );
    
    const baseEndPos = getAnchorPosition(
      endNode.position,
      endNode.size,
      endAnchor
    );
    
    // تطبيق offset عمودي للربط الأفقي أو أفقي للربط الرأسي
    const isHorizontalStart = startAnchor === 'left' || startAnchor === 'right';
    const isHorizontalEnd = endAnchor === 'left' || endAnchor === 'right';
    
    const newPositions = {
      start: {
        x: baseStartPos.x + (isHorizontalStart ? 0 : startOffset),
        y: baseStartPos.y + (isHorizontalStart ? startOffset : 0)
      },
      end: {
        x: baseEndPos.x + (isHorizontalEnd ? 0 : endOffset),
        y: baseEndPos.y + (isHorizontalEnd ? endOffset : 0)
      }
    };
    
    // ✅ تحديث آخر موقع معروف
    lastPositionsRef.current = newPositions;
    
    return newPositions;
  }, [startNode, endNode, connectorData, elements, element.id]);
  
  // حساب المسار
  const path = useMemo(() => {
    if (!positions) return '';
    
    const { start, end } = positions;
    const rawStartAnchor = connectorData.startAnchor?.anchor || 'right';
    const rawEndAnchor = connectorData.endAnchor?.anchor || 'left';
    
    // تحويل center إلى right كقيمة افتراضية
    const startAnchor: 'top' | 'bottom' | 'left' | 'right' = 
      rawStartAnchor === 'center' ? 'right' : rawStartAnchor;
    const endAnchor: 'top' | 'bottom' | 'left' | 'right' = 
      rawEndAnchor === 'center' ? 'left' : rawEndAnchor;
    
    switch (connectorData.curveStyle) {
      case 'straight':
        return createStraightPath(start, end);
      case 'elbow':
        return createElbowPath(start, end, startAnchor, endAnchor);
      case 'bezier':
      default:
        return createBezierPath(start, end, startAnchor, endAnchor);
    }
  }, [positions, connectorData]);
  
  // حساب حدود SVG
  const bounds = useMemo(() => {
    if (!positions) return { x: 0, y: 0, width: 100, height: 100 };
    
    const padding = 50;
    const minX = Math.min(positions.start.x, positions.end.x) - padding;
    const minY = Math.min(positions.start.y, positions.end.y) - padding;
    const maxX = Math.max(positions.start.x, positions.end.x) + padding;
    const maxY = Math.max(positions.start.y, positions.end.y) + padding;
    
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }, [positions]);
  
  // موقع النص على المسار
  const labelPosition = useMemo(() => {
    if (!positions) return null;
    
    const t = connectorData.labelPosition || 0.5;
    const { start, end } = positions;
    
    return {
      x: start.x + (end.x - start.x) * t,
      y: start.y + (end.y - start.y) * t - 10
    };
  }, [positions, connectorData.labelPosition]);
  
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(e.shiftKey || e.ctrlKey || e.metaKey);
  }, [onSelect]);
  
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingLabel(true);
    setLabelText(connectorData.label || '');
  }, [connectorData.label]);
  
  const handleSaveLabel = useCallback(() => {
    updateElement(element.id, {
      data: { ...connectorData, label: labelText.trim() || undefined }
    });
    setIsEditingLabel(false);
  }, [element.id, connectorData, labelText, updateElement]);
  
  // ✅ بدء إضافة نص جديد
  const handleStartAddLabel = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingLabel(true);
    setLabelText(connectorData.label || '');
  }, [connectorData.label]);
  
  // ✅ إخفاء إذا كان مطوياً
  if (isHiddenByCollapse) {
    return null;
  }
  
  // ✅ لا نرجع null حتى لو لم تتوفر المواقع - نستخدم آخر موقع معروف
  if (!positions) {
    return null;
  }
  
  return (
    <>
      <svg
        className="absolute pointer-events-none"
        style={{
          left: bounds.x,
          top: bounds.y,
          width: bounds.width,
          height: bounds.height,
          overflow: 'visible',
          zIndex: isSelected ? 50 : 5
        }}
      >
        {/* منطقة النقر (شفافة وعريضة) */}
        <path
          d={path}
          fill="none"
          stroke="transparent"
          strokeWidth={20}
          className="cursor-pointer pointer-events-stroke"
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            transform: `translate(${-bounds.x}px, ${-bounds.y}px)`
          }}
        />
        
        {/* الخط المرئي */}
        <path
          d={path}
          fill="none"
          stroke={connectorData.color || '#3DA8F5'}
          strokeWidth={connectorData.strokeWidth || 2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-all ${isHovered || isSelected ? 'filter drop-shadow-md' : ''}`}
          style={{
            transform: `translate(${-bounds.x}px, ${-bounds.y}px)`,
            opacity: isHovered || isSelected ? 1 : 0.8
          }}
        />
        
        {/* تمييز التحديد */}
        {isSelected && (
          <path
            d={path}
            fill="none"
            stroke="hsl(var(--accent-green))"
            strokeWidth={(connectorData.strokeWidth || 2) + 4}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.3}
            style={{
              transform: `translate(${-bounds.x}px, ${-bounds.y}px)`
            }}
          />
        )}
      </svg>
      
      {/* النص على المسار */}
      {labelPosition && (connectorData.label || isEditingLabel) && (
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
          style={{
            left: labelPosition.x,
            top: labelPosition.y,
            zIndex: isSelected ? 51 : 6
          }}
        >
          {isEditingLabel ? (
            <input
              type="text"
              value={labelText}
              onChange={(e) => setLabelText(e.target.value)}
              onBlur={handleSaveLabel}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveLabel();
                if (e.key === 'Escape') setIsEditingLabel(false);
                e.stopPropagation();
              }}
              className="px-2 py-1 text-xs bg-white border border-[hsl(var(--border))] rounded shadow-sm outline-none focus:border-[hsl(var(--accent-green))]"
              autoFocus
              dir="auto"
            />
          ) : (
            <span
              className="px-2 py-1 text-xs bg-white/90 backdrop-blur-sm rounded shadow-sm border border-[hsl(var(--border))] cursor-pointer"
              onClick={handleClick}
              onDoubleClick={handleDoubleClick}
              dir="auto"
            >
              {connectorData.label}
            </span>
          )}
        </div>
      )}
      
      {/* ✅ أزرار hover للحذف وإضافة النص */}
      {(isHovered || isSelected) && labelPosition && (
        <div
          className="absolute flex items-center gap-1 pointer-events-auto"
          style={{
            left: labelPosition.x - 32,
            top: labelPosition.y + (connectorData.label ? 25 : 15),
            zIndex: 52
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* زر إضافة/تحرير النص */}
          <button
            className="w-6 h-6 bg-white rounded-full shadow-md border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--ink-60))] hover:text-[hsl(var(--accent-blue))] hover:bg-blue-50 transition-colors"
            onClick={handleStartAddLabel}
            title={connectorData.label ? "تحرير النص" : "إضافة نص"}
          >
            <Type size={12} />
          </button>
          
          {/* زر الحذف */}
          <button
            className="w-6 h-6 bg-white rounded-full shadow-md border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--ink-60))] hover:text-[hsl(var(--accent-red))] hover:bg-red-50 transition-colors"
            onClick={() => deleteElement(element.id)}
            title="حذف الرابط"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}
    </>
  );
};

export default MindMapConnector;
