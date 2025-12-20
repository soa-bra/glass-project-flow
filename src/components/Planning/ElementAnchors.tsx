import React, { useCallback, useMemo } from 'react';
import type { CanvasElement } from '@/types/canvas';
import { getAnchorPosition } from '@/types/mindmap-canvas';
import { useCanvasStore } from '@/stores/canvasStore';

interface ElementAnchorsProps {
  element: CanvasElement;
  isConnecting: boolean;
  nearestAnchor: { nodeId: string; anchor: string; position: { x: number; y: number } } | null;
  onStartConnection: (nodeId: string, anchor: 'top' | 'bottom' | 'left' | 'right', position: { x: number; y: number }) => void;
  onEndConnection: (nodeId: string, anchor: 'top' | 'bottom' | 'left' | 'right') => void;
}

const ANCHORS: ('top' | 'bottom' | 'left' | 'right')[] = ['top', 'bottom', 'left', 'right'];

const ElementAnchors: React.FC<ElementAnchorsProps> = ({
  element,
  isConnecting,
  nearestAnchor,
  onStartConnection,
  onEndConnection
}) => {
  const selectedElementIds = useCanvasStore(state => state.selectedElementIds);
  const elements = useCanvasStore(state => state.elements);
  
  // ✅ التحقق من التحديد المتعدد أو العناصر المجمعة
  const shouldHide = useMemo(() => {
    // لا تظهر للتحديد المتعدد
    if (selectedElementIds.length > 1) return true;
    
    // لا تظهر للعناصر المجمعة
    if (element.metadata?.groupId) {
      const groupElements = elements.filter(el => el.metadata?.groupId === element.metadata?.groupId);
      if (groupElements.length > 1) return true;
    }
    
    return false;
  }, [selectedElementIds, element.metadata?.groupId, elements]);
  
  // ✅ تحديد ما إذا كان العنصر من نوع خريطة ذهنية
  const isMindMapElement = element.type === 'mindmap_node' || element.type === 'visual_node';
  
  // حساب موقع كل anchor
  const anchorPositions = useMemo(() => {
    // ✅ للعناصر العادية: نقطة واحدة تحت الزاوية العلوية اليمنى
    if (!isMindMapElement) {
      return [{
        anchor: 'top' as const,
        x: element.size.width - 12, // تحت الزاوية العلوية اليمنى
        y: -12 // فوق العنصر
      }];
    }
    
    // ✅ لعناصر الخريطة الذهنية: 4 نقاط
    return ANCHORS.map(anchor => {
      const pos = getAnchorPosition({ x: 0, y: 0 }, element.size, anchor);
      return { anchor, ...pos };
    });
  }, [element.size, isMindMapElement]);

  const handleMouseDown = useCallback((e: React.MouseEvent, anchor: 'top' | 'bottom' | 'left' | 'right') => {
    e.stopPropagation();
    e.preventDefault();
    
    const anchorPos = getAnchorPosition(element.position, element.size, anchor);
    onStartConnection(element.id, anchor, anchorPos);
  }, [element, onStartConnection]);

  const handleMouseUp = useCallback((e: React.MouseEvent, anchor: 'top' | 'bottom' | 'left' | 'right') => {
    e.stopPropagation();
    
    if (isConnecting) {
      onEndConnection(element.id, anchor);
    }
  }, [element.id, isConnecting, onEndConnection]);

  // ✅ إخفاء للتحديد المتعدد والعناصر المجمعة
  if (shouldHide) return null;

  return (
    <>
      {anchorPositions.map(({ anchor, x, y }) => {
        const isHighlighted = nearestAnchor?.nodeId === element.id && nearestAnchor?.anchor === anchor;
        
        return (
          <div
            key={anchor}
            className={`absolute w-4 h-4 rounded-full border-2 cursor-crosshair transition-all z-50 ${
              isHighlighted 
                ? 'bg-[hsl(var(--accent-green))] border-white scale-150 shadow-lg' 
                : isConnecting
                  ? 'bg-[hsl(var(--accent-blue))] border-white hover:scale-125'
                  : 'bg-white border-[hsl(var(--border))] hover:bg-[hsl(var(--accent-green))] hover:border-white hover:scale-125'
            }`}
            style={{ 
              left: x - 8, 
              top: y - 8,
              pointerEvents: 'auto'
            }}
            onMouseDown={(e) => handleMouseDown(e, anchor)}
            onMouseUp={(e) => handleMouseUp(e, anchor)}
            title={isMindMapElement 
              ? `نقطة ربط: ${anchor === 'top' ? 'أعلى' : anchor === 'bottom' ? 'أسفل' : anchor === 'left' ? 'يسار' : 'يمين'}`
              : 'نقطة توصيل'
            }
          />
        );
      })}
    </>
  );
};

export default ElementAnchors;
