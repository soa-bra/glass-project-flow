import React, { useMemo, useRef, useCallback } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { canvasKernel, type Bounds } from '@/engine/canvas/kernel/canvasKernel';
import { selectLayerVisibilityMap } from '@/features/planning/state/selectors';

interface SelectionBoxProps {
  /** إحداثي X لنقطة البداية (Screen Space نسبي للحاوية) */
  startX: number;
  startY: number;
  /** إحداثي X للموقع الحالي (Screen Space نسبي للحاوية) */
  currentX: number;
  currentY: number;
}

/**
 * ✅ نوع التحديد:
 * - containment: العنصر يجب أن يكون داخل الصندوق بالكامل (السحب من اليسار لليمين)
 * - intersection: العنصر يجب أن يتقاطع مع الصندوق (السحب من اليمين لليسار)
 */
type SelectionMode = 'containment' | 'intersection';

/**
 * التحقق مما إذا كان العنصر محتوى بالكامل داخل الصندوق
 */
function boundsContains(container: Bounds, element: Bounds): boolean {
  return (
    element.x >= container.x &&
    element.y >= container.y &&
    element.x + element.width <= container.x + container.width &&
    element.y + element.height <= container.y + container.height
  );
}

/**
 * مكون لعرض صندوق التحديد المتعدد عند السحب على الكانفاس
 * 
 * ✅ Sprint 4: يعمل في Screen Space للعرض
 * ✅ يحسب التقاطع في World Space لتحديد العناصر
 * ✅ المرحلة 2: دعم التحديد العكسي (من اليمين لليسار)
 */
export default function SelectionBox({ startX, startY, currentX, currentY }: SelectionBoxProps) {
  const { viewport, elements, layers } = useCanvasStore();
  
  // ✅ تحديد وضع التحديد بناءً على اتجاه السحب
  const selectionMode: SelectionMode = currentX < startX ? 'intersection' : 'containment';
  const isInverseSelection = selectionMode === 'intersection';
  
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

  // ✅ حساب العناصر المتقاطعة مع صندوق التحديد (محسّن + دعم التحديد العكسي)
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

        // ✅ اختيار طريقة التحقق بناءً على وضع التحديد
        if (selectionMode === 'containment') {
          // السحب من اليسار لليمين: العنصر يجب أن يكون داخل الصندوق بالكامل
          return boundsContains(selectionBounds, elementBounds);
        } else {
          // السحب من اليمين لليسار: العنصر يجب أن يتقاطع مع الصندوق
          return canvasKernel.boundsIntersect(selectionBounds, elementBounds);
        }
      })
      .map(el => el.id);
  }, [worldBounds, elements, layerVisibilityMap, selectionMode]);

  return (
    <>
      {/* صندوق التحديد المرئي (Screen Space) */}
      <div
        className={`absolute pointer-events-none border-2 rounded transition-colors duration-100 ${
          isInverseSelection 
            ? 'border-dashed border-[hsl(var(--accent-green)/0.7)] bg-[hsl(var(--accent-green)/0.06)]' 
            : 'border-solid border-[hsl(var(--accent-blue)/0.6)] bg-[hsl(var(--accent-blue)/0.08)]'
        }`}
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
            className={`absolute -top-7 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-semibold rounded-full text-white shadow-md ${
              isInverseSelection 
                ? 'bg-[hsl(var(--accent-green))]' 
                : 'bg-[hsl(var(--accent-blue))]'
            }`}
            style={{ direction: 'rtl' }}
          >
            {intersectingElementIds.length} عنصر
            {isInverseSelection && <span className="mr-1 opacity-80">⚡</span>}
          </div>
        )}
      </div>
    </>
  );
}

/**
 * Hook مساعد لاستخدام SelectionBox مع تحديد تلقائي
 * ✅ محسّن باستخدام Layer Visibility Map
 * ✅ دعم التحديد العكسي
 * ✅ توسيع التحديد ليشمل كامل أشجار الخريطة الذهنية
 */
export function useSelectionBox() {
  const { selectElements, viewport, layers, expandSelectionToFullMindMapTrees } = useCanvasStore();
  
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
   * ✅ يدعم التحديد العكسي (من اليمين لليسار)
   * ✅ يوسع التحديد ليشمل كامل أشجار الخريطة الذهنية
   */
  const finishSelection = useCallback((
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    addToSelection: boolean = false
  ) => {
    const { elements, selectedElementIds } = useCanvasStore.getState();

    // ✅ تحديد وضع التحديد
    const selectionMode: SelectionMode = endX < startX ? 'intersection' : 'containment';

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

        // ✅ اختيار طريقة التحقق بناءً على وضع التحديد
        if (selectionMode === 'containment') {
          return boundsContains(selectionBounds, elementBounds);
        } else {
          return canvasKernel.boundsIntersect(selectionBounds, elementBounds);
        }
      })
      .map(el => el.id);

    // تحديد العناصر
    if (addToSelection) {
      const combinedIds = [...new Set([...selectedElementIds, ...intersectingIds])];
      selectElements(combinedIds);
    } else {
      selectElements(intersectingIds);
    }

    // ✅ توسيع التحديد ليشمل كامل أشجار الخريطة الذهنية
    // نستخدم setTimeout لتأخير التوسيع حتى يتم تحديث الـ store أولاً
    setTimeout(() => {
      const currentSelectedIds = useCanvasStore.getState().selectedElementIds;
      expandSelectionToFullMindMapTrees(currentSelectedIds);
    }, 0);

    return intersectingIds;
  }, [selectElements, viewport, expandSelectionToFullMindMapTrees]);

  return { finishSelection };
}
