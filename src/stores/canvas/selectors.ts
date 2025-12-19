/**
 * Canvas Store Selectors - Memoized selectors للأداء
 */

import type { CanvasElement, LayerInfo } from '@/types/canvas';

interface CanvasState {
  elements: CanvasElement[];
  selectedElementIds: string[];
  layers: LayerInfo[];
  viewport: { zoom: number; pan: { x: number; y: number } };
  history: { past: CanvasElement[][]; future: CanvasElement[][] };
  activeTool: string;
  activeLayerId: string | null;
}

// Cache للـ selectors
const selectorCache = new Map<string, { deps: any[]; result: any }>();

function memoize<T>(
  key: string,
  deps: any[],
  compute: () => T
): T {
  const cached = selectorCache.get(key);
  
  if (cached && deps.every((dep, i) => dep === cached.deps[i])) {
    return cached.result;
  }
  
  const result = compute();
  selectorCache.set(key, { deps, result });
  return result;
}

/**
 * Selector للعناصر المرئية (حسب الطبقات)
 */
export const selectVisibleElements = (state: CanvasState): CanvasElement[] => {
  return memoize(
    'visibleElements',
    [state.elements, state.layers],
    () => {
      const visibleLayerIds = new Set(
        state.layers.filter(l => l.visible).map(l => l.id)
      );
      
      return state.elements.filter(el => 
        el.visible !== false && visibleLayerIds.has(el.layerId || 'default')
      );
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
 */
export const selectElementsInViewport = (
  state: CanvasState,
  viewportBounds: { x: number; y: number; width: number; height: number }
): CanvasElement[] => {
  const visibleElements = selectVisibleElements(state);
  
  return visibleElements.filter(el => {
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
  });
};

/**
 * Selector للعناصر حسب النوع
 */
export const selectElementsByType = (state: CanvasState, type: string): CanvasElement[] => {
  return state.elements.filter(el => el.type === type);
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
  return state.layers.find(l => l.id === state.activeLayerId);
};

/**
 * Selector للعناصر المجمّعة
 */
export const selectGroupedElements = (state: CanvasState, groupId: string): CanvasElement[] => {
  return state.elements.filter(el => el.metadata?.groupId === groupId);
};

/**
 * Selector للعناصر المقفلة
 */
export const selectLockedElements = (state: CanvasState): CanvasElement[] => {
  return state.elements.filter(el => el.locked);
};

/**
 * Selector لـ mindmap nodes
 */
export const selectMindmapNodes = (state: CanvasState): CanvasElement[] => {
  return state.elements.filter(el => el.type === 'mindmap_node');
};

/**
 * Selector لـ frames
 */
export const selectFrames = (state: CanvasState): CanvasElement[] => {
  return state.elements.filter(el => el.type === 'frame');
};

/**
 * مسح cache الـ selectors (يُستدعى عند تغيير كبير في الـ state)
 */
export const clearSelectorCache = () => {
  selectorCache.clear();
};
