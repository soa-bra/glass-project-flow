/**
 * Canvas Store Selectors - Memoized selectors للأداء
 * ✅ المرحلة 2: Layer Visibility Cache + تحسينات الأداء
 */

import type { CanvasElement, LayerInfo } from '@/types/canvas';

export interface CanvasState {
  elements: CanvasElement[];
  selectedElementIds: string[];
  layers: LayerInfo[];
  viewport: { zoom: number; pan: { x: number; y: number } };
  history: { past: CanvasElement[][]; future: CanvasElement[][] };
  activeTool: string;
  activeLayerId: string | null;
}

// ============================================
// 🔧 Memoization Cache System
// ============================================

interface CacheEntry<T> {
  deps: any[];
  value: T;
}

const selectorCache = new Map<string, CacheEntry<any>>();

function memoize<T>(key: string, deps: any[], compute: () => T): T {
  const cached = selectorCache.get(key);
  
  if (cached && deps.every((dep, i) => Object.is(dep, cached.deps[i]))) {
    return cached.value;
  }
  
  const value = compute();
  selectorCache.set(key, { deps, value });
  return value;
}

// ============================================
// 🗺️ Layer Visibility Map - O(1) lookup
// ============================================

/**
 * ✅ Layer Visibility Map - يحوّل O(n) find إلى O(1) lookup
 * هذا هو التحسين الأساسي للأداء في SelectionBox
 */
export function selectLayerVisibilityMap(state: CanvasState): Map<string, boolean> {
  return memoize(
    'layerVisibilityMap',
    [state.layers],
    () => {
      const map = new Map<string, boolean>();
      state.layers.forEach((layer) => {
        map.set(layer.id, layer.visible);
      });
      return map;
    }
  );
}

/**
 * Layer Lock Map - للتحقق السريع من قفل الطبقات
 */
export function selectLayerLockMap(state: CanvasState): Map<string, boolean> {
  return memoize(
    'layerLockMap',
    [state.layers],
    () => {
      const map = new Map<string, boolean>();
      state.layers.forEach((layer) => {
        map.set(layer.id, layer.locked);
      });
      return map;
    }
  );
}

// ============================================
// 📦 Element Selectors
// ============================================

/**
 * Selector للعناصر المرئية (حسب الطبقات)
 * ✅ محسّن باستخدام Layer Visibility Map
 */
export const selectVisibleElements = (state: CanvasState): CanvasElement[] => {
  const visibilityMap = selectLayerVisibilityMap(state);
  
  return memoize(
    'visibleElements',
    [state.elements, visibilityMap],
    () => {
      return state.elements.filter(el => {
        const layerVisible = visibilityMap.get(el.layerId) ?? true;
        return el.visible !== false && layerVisible;
      });
    }
  );
};

/**
 * Selector للعناصر المحددة
 */
export const selectSelectedElements = (state: CanvasState): CanvasElement[] => {
  return memoize(
    'selectedElements',
    [state.elements, state.selectedElementIds],
    () => {
      const selectedSet = new Set(state.selectedElementIds);
      return state.elements.filter(el => selectedSet.has(el.id));
    }
  );
};

/**
 * Selector للعناصر في viewport
 * ✅ محسّن لتقليل الرسم غير الضروري
 */
export const selectElementsInViewport = (
  state: CanvasState,
  viewportBounds: { x: number; y: number; width: number; height: number }
): CanvasElement[] => {
  const visibleElements = selectVisibleElements(state);
  
  return memoize(
    `elementsInViewport-${viewportBounds.x}-${viewportBounds.y}-${viewportBounds.width}-${viewportBounds.height}`,
    [visibleElements, viewportBounds],
    () => visibleElements.filter(el => {
      const { zoom, pan } = state.viewport;
      const elementBounds = {
        left: el.position.x * zoom + pan.x,
        top: el.position.y * zoom + pan.y,
        right: (el.position.x + el.size.width) * zoom + pan.x,
        bottom: (el.position.y + el.size.height) * zoom + pan.y
      };
      
      return !(
        elementBounds.right < viewportBounds.x ||
        elementBounds.left > viewportBounds.x + viewportBounds.width ||
        elementBounds.bottom < viewportBounds.y ||
        elementBounds.top > viewportBounds.y + viewportBounds.height
      );
    })
  );
};

/**
 * Selector للعناصر حسب النوع
 */
export const selectElementsByType = (state: CanvasState, type: string): CanvasElement[] => {
  return memoize(
    `elementsByType-${type}`,
    [state.elements, type],
    () => state.elements.filter(el => el.type === type)
  );
};

/**
 * Selector للإحصائيات
 */
export const selectCanvasStats = (state: CanvasState) => {
  return memoize(
    'canvasStats',
    [state.elements.length, state.selectedElementIds.length, state.layers.length, state.viewport.zoom, state.history],
    () => ({
      totalElements: state.elements.length,
      selectedCount: state.selectedElementIds.length,
      layersCount: state.layers.length,
      zoom: state.viewport.zoom,
      canUndo: state.history.past.length > 0,
      canRedo: state.history.future.length > 0
    })
  );
};

/**
 * Selector للطبقة النشطة
 */
export const selectActiveLayer = (state: CanvasState): LayerInfo | undefined => {
  return memoize(
    'activeLayer',
    [state.layers, state.activeLayerId],
    () => state.layers.find(l => l.id === state.activeLayerId)
  );
};

/**
 * Selector للعناصر المجمّعة
 */
export const selectGroupedElements = (state: CanvasState, groupId: string): CanvasElement[] => {
  return memoize(
    `groupedElements-${groupId}`,
    [state.elements, groupId],
    () => state.elements.filter(el => el.groupId === groupId || el.metadata?.groupId === groupId)
  );
};

/**
 * Selector للعناصر المقفلة
 */
export const selectLockedElements = (state: CanvasState): CanvasElement[] => {
  return memoize(
    'lockedElements',
    [state.elements],
    () => state.elements.filter(el => el.locked)
  );
};

/**
 * Selector لـ mindmap nodes
 */
export const selectMindmapNodes = (state: CanvasState): CanvasElement[] => {
  return selectElementsByType(state, 'mindmap_node');
};

/**
 * Selector لـ frames
 */
export const selectFrames = (state: CanvasState): CanvasElement[] => {
  return selectElementsByType(state, 'frame');
};

// ============================================
// 🧹 Cache Management
// ============================================

/**
 * مسح cache الـ selectors (يُستدعى عند تغيير كبير في الـ state)
 */
export const clearSelectorCache = () => {
  selectorCache.clear();
};

/**
 * حجم الـ cache الحالي (للتصحيح)
 */
export function getSelectorCacheSize(): number {
  return selectorCache.size;
}

/**
 * تنظيف cache entries قديمة (للذاكرة)
 */
export function pruneSelectorCache(maxSize: number = 50): void {
  if (selectorCache.size > maxSize) {
    const keysToDelete = Array.from(selectorCache.keys()).slice(0, selectorCache.size - maxSize);
    keysToDelete.forEach((key) => selectorCache.delete(key));
  }
}
