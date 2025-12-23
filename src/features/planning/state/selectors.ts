/**
 * Canvas Store Selectors - Memoized selectors للأداء
 * ✅ المرحلة 2: Layer Visibility Cache + تحسينات الأداء
 * ✅ المرحلة 3: Spatial Index Integration + Enhanced Caching
 */

import type { CanvasElement, LayerInfo } from '@/types/canvas';
import { spatialIndex, queryIntersectingElements } from '@/engine/canvas/spatial/spatialIndex';

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
// 🔧 Enhanced Memoization Cache System
// ============================================

interface CacheEntry<T> {
  deps: any[];
  value: T;
  timestamp: number;
}

const selectorCache = new Map<string, CacheEntry<any>>();
const CACHE_TTL = 5000; // 5 seconds TTL for stale entries

function memoize<T>(key: string, deps: any[], compute: () => T): T {
  const now = Date.now();
  const cached = selectorCache.get(key);
  
  // التحقق من صلاحية الـ cache
  if (cached) {
    const depsMatch = deps.length === cached.deps.length && 
      deps.every((dep, i) => Object.is(dep, cached.deps[i]));
    
    if (depsMatch) {
      return cached.value;
    }
  }
  
  const value = compute();
  selectorCache.set(key, { deps, value, timestamp: now });
  return value;
}

/**
 * ✅ Weak memoization for object references
 */
const weakCache = new WeakMap<object, Map<string, any>>();

function weakMemoize<T>(obj: object, key: string, compute: () => T): T {
  let objCache = weakCache.get(obj);
  if (!objCache) {
    objCache = new Map();
    weakCache.set(obj, objCache);
  }
  
  if (objCache.has(key)) {
    return objCache.get(key);
  }
  
  const value = compute();
  objCache.set(key, value);
  return value;
}

// ============================================
// 🗺️ Layer Visibility Map - O(1) lookup
// ============================================

// ✅ Singleton cache for layer maps - يتجنب إعادة الإنشاء
let cachedLayerVisibilityMap: Map<string, boolean> | null = null;
let cachedLayerLockMap: Map<string, boolean> | null = null;
let lastLayersRef: LayerInfo[] | null = null;

/**
 * ✅ Layer Visibility Map - يحوّل O(n) find إلى O(1) lookup
 * هذا هو التحسين الأساسي للأداء في SelectionBox
 */
export function selectLayerVisibilityMap(state: CanvasState): Map<string, boolean> {
  // ✅ تحسين: استخدام مرجع الـ layers للتحقق السريع
  if (state.layers === lastLayersRef && cachedLayerVisibilityMap) {
    return cachedLayerVisibilityMap;
  }
  
  const map = new Map<string, boolean>();
  state.layers.forEach((layer) => {
    map.set(layer.id, layer.visible);
  });
  
  cachedLayerVisibilityMap = map;
  lastLayersRef = state.layers;
  
  return map;
}

/**
 * Layer Lock Map - للتحقق السريع من قفل الطبقات
 */
export function selectLayerLockMap(state: CanvasState): Map<string, boolean> {
  if (state.layers === lastLayersRef && cachedLayerLockMap) {
    return cachedLayerLockMap;
  }
  
  const map = new Map<string, boolean>();
  state.layers.forEach((layer) => {
    map.set(layer.id, layer.locked);
  });
  
  cachedLayerLockMap = map;
  
  return map;
}

// ============================================
// 📦 Element Selectors with Spatial Index
// ============================================

/**
 * ✅ تحديث الفهرس المكاني عند تغير العناصر
 */
export function updateSpatialIndex(elements: CanvasElement[]): void {
  if (spatialIndex.needsRebuild(elements)) {
    spatialIndex.rebuild(elements);
  }
}

/**
 * Selector للعناصر المرئية (حسب الطبقات)
 * ✅ محسّن باستخدام Layer Visibility Map
 */
export const selectVisibleElements = (state: CanvasState): CanvasElement[] => {
  const visibilityMap = selectLayerVisibilityMap(state);
  
  return memoize(
    'visibleElements',
    [state.elements, state.layers],
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
 * ✅ Selector للعناصر في viewport باستخدام Spatial Index
 * محسّن لتقليل الرسم غير الضروري
 */
export const selectElementsInViewport = (
  state: CanvasState,
  viewportBounds: { x: number; y: number; width: number; height: number }
): CanvasElement[] => {
  const visibilityMap = selectLayerVisibilityMap(state);
  
  // ✅ تحويل viewport bounds إلى world space
  const { zoom, pan } = state.viewport;
  const worldBounds = {
    x: (viewportBounds.x - pan.x) / zoom,
    y: (viewportBounds.y - pan.y) / zoom,
    width: viewportBounds.width / zoom,
    height: viewportBounds.height / zoom
  };
  
  return memoize(
    `elementsInViewport-${worldBounds.x.toFixed(0)}-${worldBounds.y.toFixed(0)}-${worldBounds.width.toFixed(0)}-${worldBounds.height.toFixed(0)}`,
    [state.elements, worldBounds, state.layers],
    () => {
      // ✅ استخدام Spatial Index للبحث السريع
      return queryIntersectingElements(worldBounds, state.elements, visibilityMap);
    }
  );
};

/**
 * ✅ Selector سريع للتحقق من وجود عناصر في منطقة
 */
export const selectHasElementsInBounds = (
  state: CanvasState,
  bounds: { x: number; y: number; width: number; height: number }
): boolean => {
  updateSpatialIndex(state.elements);
  const candidateIds = spatialIndex.queryBounds(bounds);
  return candidateIds.size > 0;
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
 * ✅ Element Map للبحث السريع O(1)
 */
export const selectElementMap = (state: CanvasState): Map<string, CanvasElement> => {
  return memoize(
    'elementMap',
    [state.elements],
    () => new Map(state.elements.map(el => [el.id, el]))
  );
};

/**
 * ✅ البحث السريع عن عنصر بالـ ID
 */
export const selectElementById = (state: CanvasState, id: string): CanvasElement | undefined => {
  const elementMap = selectElementMap(state);
  return elementMap.get(id);
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
      canRedo: state.history.future.length > 0,
      spatialIndexStats: spatialIndex.getStats()
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
  cachedLayerVisibilityMap = null;
  cachedLayerLockMap = null;
  lastLayersRef = null;
};

/**
 * حجم الـ cache الحالي (للتصحيح)
 */
export function getSelectorCacheSize(): number {
  return selectorCache.size;
}

/**
 * ✅ تنظيف cache entries قديمة (للذاكرة)
 */
export function pruneSelectorCache(maxSize: number = 50): void {
  const now = Date.now();
  
  // حذف الـ entries القديمة أولاً
  for (const [key, entry] of selectorCache.entries()) {
    if (now - entry.timestamp > CACHE_TTL) {
      selectorCache.delete(key);
    }
  }
  
  // إذا لا يزال الحجم كبيراً، احذف الأقدم
  if (selectorCache.size > maxSize) {
    const entries = Array.from(selectorCache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    const toDelete = entries.slice(0, selectorCache.size - maxSize);
    toDelete.forEach(([key]) => selectorCache.delete(key));
  }
}

/**
 * ✅ تشغيل تنظيف دوري للـ cache
 */
let cleanupInterval: ReturnType<typeof setInterval> | null = null;

export function startCacheCleanup(intervalMs: number = 30000): void {
  if (cleanupInterval) return;
  cleanupInterval = setInterval(() => pruneSelectorCache(), intervalMs);
}

export function stopCacheCleanup(): void {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
}
