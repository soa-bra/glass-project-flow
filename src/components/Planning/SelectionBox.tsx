import React, { useMemo } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { canvasKernel, type Bounds } from '@/core/canvasKernel';

interface SelectionBoxProps {
  /** إحداثي X لنقطة البداية (Screen Space نسبي للحاوية) */
  startX: number;
  startY: number;
  /** إحداثي X للموقع الحالي (Screen Space نسبي للحاوية) */
  currentX: number;
  currentY: number;
}

/**
 * مكون لعرض صندوق التحديد المتعدد عند السحب على الكانفاس
 * 
 * ✅ Sprint 4: يعمل في Screen Space للعرض
 * ✅ يحسب التقاطع في World Space لتحديد العناصر
 */
export default function SelectionBox({ startX, startY, currentX, currentY }: SelectionBoxProps) {
  const { viewport, elements, selectElements, layers } = useCanvasStore();
  
  // حساب أبعاد الصندوق في Screen Space (للعرض)
  const screenBounds = useMemo(() => {
    const x = Math.min(startX, currentX);
    const y = Math.min(startY, currentY);
    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);
    return { x, y, width, height };
  }, [startX, startY, currentX, currentY]);

  // ✅ تحويل صندوق التحديد إلى World Space
  const worldBounds = useMemo((): Bounds => {
    // تحويل نقطتي البداية والنهاية
    const worldStart = canvasKernel.screenToWorld(
      startX, startY,
      viewport,
      null // الإحداثيات بالفعل نسبية للحاوية
    );
    const worldEnd = canvasKernel.screenToWorld(
      currentX, currentY,
      viewport,
      null
    );

    // حساب الحدود في World Space
    return {
      x: Math.min(worldStart.x, worldEnd.x),
      y: Math.min(worldStart.y, worldEnd.y),
      width: Math.abs(worldEnd.x - worldStart.x),
      height: Math.abs(worldEnd.y - worldStart.y)
    };
  }, [startX, startY, currentX, currentY, viewport]);

  // ✅ حساب العناصر المتقاطعة مع صندوق التحديد (في World Space)
  const intersectingElementIds = useMemo(() => {
    const selectionBounds = worldBounds;
    
    return elements
      .filter(el => {
        // تجاهل العناصر غير المرئية
        const layer = layers.find(l => l.id === el.layerId);
        if (!layer?.visible || !el.visible) return false;
        
        // حساب حدود العنصر في World Space
        const elementBounds: Bounds = {
          x: el.position.x,
          y: el.position.y,
          width: el.size.width,
          height: el.size.height
        };

        // ✅ استخدام Canvas Kernel للتحقق من التقاطع
        return canvasKernel.boundsIntersect(selectionBounds, elementBounds);
      })
      .map(el => el.id);
  }, [worldBounds, elements, layers]);

  // إظهار معلومات التحديد (للتطوير)
  const showDebugInfo = false;

  return (
    <>
      {/* صندوق التحديد المرئي (Screen Space) */}
      <div
        className="absolute pointer-events-none border-2 border-[hsl(var(--accent-blue)/0.6)] bg-[hsl(var(--accent-blue)/0.08)] rounded"
        style={{
          left: `${screenBounds.x}px`,
          top: `${screenBounds.y}px`,
          width: `${screenBounds.width}px`,
          height: `${screenBounds.height}px`,
          zIndex: 9999,
          backdropFilter: 'blur(1px)'
        }}
      >
        {/* عداد العناصر المحددة */}
        {intersectingElementIds.length > 0 && (
          <div 
            className="absolute -top-6 left-0 px-2 py-0.5 text-xs font-medium rounded bg-[hsl(var(--accent-blue))] text-white"
            style={{ direction: 'rtl' }}
          >
            {intersectingElementIds.length} عنصر
          </div>
        )}
      </div>

      {/* معلومات التصحيح (اختياري) */}
      {showDebugInfo && (
        <div 
          className="fixed top-4 left-4 p-2 bg-black/80 text-white text-xs font-mono rounded z-[10000]"
          style={{ direction: 'ltr' }}
        >
          <div>Screen: {screenBounds.x.toFixed(0)}, {screenBounds.y.toFixed(0)}</div>
          <div>World: {worldBounds.x.toFixed(0)}, {worldBounds.y.toFixed(0)}</div>
          <div>Size: {worldBounds.width.toFixed(0)} x {worldBounds.height.toFixed(0)}</div>
          <div>Elements: {intersectingElementIds.length}</div>
        </div>
      )}
    </>
  );
}

/**
 * Hook مساعد لاستخدام SelectionBox مع تحديد تلقائي
 */
export function useSelectionBox() {
  const { selectElements, viewport } = useCanvasStore();

  /**
   * إنهاء التحديد وتحديد العناصر المتقاطعة
   */
  const finishSelection = (
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    addToSelection: boolean = false
  ) => {
    const { elements, layers, selectedElementIds } = useCanvasStore.getState();

    // تحويل إلى World Space
    const worldStart = canvasKernel.screenToWorld(startX, startY, viewport, null);
    const worldEnd = canvasKernel.screenToWorld(endX, endY, viewport, null);

    const selectionBounds: Bounds = {
      x: Math.min(worldStart.x, worldEnd.x),
      y: Math.min(worldStart.y, worldEnd.y),
      width: Math.abs(worldEnd.x - worldStart.x),
      height: Math.abs(worldEnd.y - worldStart.y)
    };

    // العثور على العناصر المتقاطعة
    const intersectingIds = elements
      .filter(el => {
        const layer = layers.find(l => l.id === el.layerId);
        if (!layer?.visible || !el.visible) return false;

        const elementBounds: Bounds = {
          x: el.position.x,
          y: el.position.y,
          width: el.size.width,
          height: el.size.height
        };

        return canvasKernel.boundsIntersect(selectionBounds, elementBounds);
      })
      .map(el => el.id);

    // تحديد العناصر
    if (addToSelection) {
      const combinedIds = [...new Set([...selectedElementIds, ...intersectingIds])];
      selectElements(combinedIds);
    } else {
      selectElements(intersectingIds);
    }

    return intersectingIds;
  };

  return { finishSelection };
}
