import React, { useMemo, useRef, useCallback } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { canvasKernel, type Bounds } from '@/core/canvasKernel';
import { selectLayerVisibilityMap } from '@/stores/canvas/selectors';

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
 * ✅ المرحلة 2: تحسين الأداء باستخدام Layer Visibility Map
 */
export default function SelectionBox({ startX, startY, currentX, currentY }: SelectionBoxProps) {
  const { viewport, elements, layers } = useCanvasStore();
  
  // ✅ استخدام Layer Visibility Map للأداء O(1)
  const layerVisibilityMap = useMemo(() => {
    return selectLayerVisibilityMap({ 
      elements, 
      layers, 
      selectedElementIds: [], 
      viewport, 
      history: { past: [], future: [] },
      activeTool: 'select',
      activeLayerId: null
    });
  }, [layers]);
  
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

  // ✅ حساب العناصر المتقاطعة مع صندوق التحديد (محسّن)
  const intersectingElementIds = useMemo(() => {
    const selectionBounds = worldBounds;
    
    // ✅ تحسين: استخدام Map بدلاً من find (O(1) vs O(n))
    return elements
      .filter(el => {
        // ✅ O(1) lookup بدلاً من O(n) find
        const layerVisible = layerVisibilityMap.get(el.layerId) ?? true;
        if (!layerVisible || !el.visible) return false;
        
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
  }, [worldBounds, elements, layerVisibilityMap]);

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
        {/* عداد العناصر المحددة - مثل Miro */}
        {intersectingElementIds.length > 0 && (
          <div 
            className="absolute -top-7 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-semibold rounded-full bg-[hsl(var(--accent-blue))] text-white shadow-md"
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
 * ✅ محسّن باستخدام Layer Visibility Map
 */
export function useSelectionBox() {
  const { selectElements, viewport, layers } = useCanvasStore();
  
  // ✅ Cache للـ visibility map
  const layerVisibilityMapRef = useRef<Map<string, boolean>>(new Map());
  
  // تحديث الـ cache عند تغير الطبقات
  useMemo(() => {
    const map = new Map<string, boolean>();
    layers.forEach((l) => map.set(l.id, l.visible));
    layerVisibilityMapRef.current = map;
  }, [layers]);

  /**
   * إنهاء التحديد وتحديد العناصر المتقاطعة
   */
  const finishSelection = useCallback((
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    addToSelection: boolean = false
  ) => {
    const { elements, selectedElementIds } = useCanvasStore.getState();

    // تحويل إلى World Space
    const worldStart = canvasKernel.screenToWorld(startX, startY, viewport, null);
    const worldEnd = canvasKernel.screenToWorld(endX, endY, viewport, null);

    const selectionBounds: Bounds = {
      x: Math.min(worldStart.x, worldEnd.x),
      y: Math.min(worldStart.y, worldEnd.y),
      width: Math.abs(worldEnd.x - worldStart.x),
      height: Math.abs(worldEnd.y - worldStart.y)
    };

    // ✅ استخدام الـ cached map
    const visibilityMap = layerVisibilityMapRef.current;

    // العثور على العناصر المتقاطعة
    const intersectingIds = elements
      .filter(el => {
        // ✅ O(1) lookup
        const layerVisible = visibilityMap.get(el.layerId) ?? true;
        if (!layerVisible || !el.visible) return false;

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
  }, [selectElements, viewport]);

  return { finishSelection };
}
