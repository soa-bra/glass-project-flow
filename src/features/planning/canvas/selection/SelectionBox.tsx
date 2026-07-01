import React, { useMemo, useRef, useCallback } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { canvasKernel, type Bounds } from '@/engine/canvas/kernel/canvasKernel';
import { selectLayerVisibilityMap } from '@/features/planning/state/selectors';
import type { CanvasElement } from '@/types/canvas';

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

function isCanvasElementLocked(element: CanvasElement): boolean {
  return Boolean(
    element.locked ||
    element.data?.locked ||
    element.data?.isLocked ||
    element.metadata?.locked,
  );
}

function isSelectableElement(element: CanvasElement): boolean {
  return element.visible !== false && !isCanvasElementLocked(element);
}

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

function getMatchingElementIds(
  elements: CanvasElement[],
  layerVisibilityMap: Map<string, boolean>,
  selectionBounds: Bounds,
  selectionMode: SelectionMode,
): string[] {
  return elements
    .filter((el) => {
      const layerVisible = layerVisibilityMap.get(el.layerId) ?? true;
      if (!layerVisible || !isSelectableElement(el)) return false;

      const elementBounds: Bounds = {
        x: el.position.x,
        y: el.position.y,
        width: el.size.width,
        height: el.size.height,
      };

      if (selectionMode === 'containment') {
        return boundsContains(selectionBounds, elementBounds);
      }

      return canvasKernel.boundsIntersect(selectionBounds, elementBounds);
    })
    .map((el) => el.id);
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
  const modeLabel = isInverseSelection ? 'تحديد بالتقاطع' : 'تحديد بالاحتواء';
  
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
  }, [elements, layers, viewport]);
  
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
    return getMatchingElementIds(elements, layerVisibilityMap, worldBounds, selectionMode);
  }, [worldBounds, elements, layerVisibilityMap, selectionMode]);

  const selectionTone = isInverseSelection
    ? {
        borderColor: 'hsl(var(--accent-green))',
        backgroundColor: 'hsl(var(--accent-green) / 0.08)',
        boxShadow: '0 0 0 1px hsl(var(--accent-green) / 0.18), 0 10px 28px hsl(var(--accent-green) / 0.12)',
      }
    : {
        borderColor: 'hsl(var(--accent-blue))',
        backgroundColor: 'hsl(var(--accent-blue) / 0.08)',
        boxShadow: '0 0 0 1px hsl(var(--accent-blue) / 0.18), 0 10px 28px hsl(var(--accent-blue) / 0.12)',
      };

  return (
    <>
      {/* صندوق التحديد المرئي (Screen Space) */}
      <div
        className="absolute pointer-events-none rounded-md border-2 transition-[background-color,border-color,box-shadow] duration-100"
        style={{
          left: `${screenBounds.x}px`,
          top: `${screenBounds.y}px`,
          width: `${screenBounds.width}px`,
          height: `${screenBounds.height}px`,
          zIndex: 9999,
          borderStyle: isInverseSelection ? 'dashed' : 'solid',
          borderColor: selectionTone.borderColor,
          backgroundColor: selectionTone.backgroundColor,
          boxShadow: selectionTone.boxShadow,
        }}
      >
        <div
          className="absolute -top-8 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-md border border-black/10 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-900 shadow-sm"
          style={{ direction: 'rtl' }}
        >
          <span>{modeLabel}</span>
          {intersectingElementIds.length > 0 && (
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-700">
              {intersectingElementIds.length} عنصر
            </span>
          )}
        </div>
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
    const intersectingIds = getMatchingElementIds(elements, visibilityMap, selectionBounds, selectionMode);

    // تحديد العناصر
    const finalIds = addToSelection
      ? [...new Set([...selectedElementIds, ...intersectingIds])]
      : intersectingIds;
    selectElements(finalIds);

    // ✅ توسيع التحديد ليشمل كامل أشجار الخريطة الذهنية (متزامن — بدون setTimeout لتجنب race)
    expandSelectionToFullMindMapTrees(finalIds);

    return intersectingIds;

  }, [selectElements, viewport, expandSelectionToFullMindMapTrees]);

  return { finishSelection };
}
