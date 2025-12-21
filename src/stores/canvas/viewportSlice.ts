/**
 * Viewport Slice - إدارة التكبير والتحريك
 * ✅ مركزية جميع حسابات viewport
 */

import { StateCreator } from 'zustand';
import type { CanvasElement, CanvasSettings } from '@/types/canvas';

// ============================================
// 📐 Viewport Math Utilities (مركزية الحسابات)
// ============================================

const ZOOM_CONFIG = {
  min: 0.1,
  max: 5,
  step: 0.1,
  wheelSensitivity: 0.001,
} as const;

/**
 * ✅ حساب zoom حول نقطة محددة (pointer-centered zoom)
 * هذا يضمن أن النقطة تحت المؤشر تبقى ثابتة أثناء التكبير
 */
export function calculateZoomAtPoint(
  currentZoom: number,
  currentPan: { x: number; y: number },
  screenPoint: { x: number; y: number },
  zoomDelta: number
): { zoom: number; pan: { x: number; y: number } } {
  // حساب الـ zoom الجديد
  const newZoom = Math.max(
    ZOOM_CONFIG.min,
    Math.min(ZOOM_CONFIG.max, currentZoom * (1 + zoomDelta))
  );
  
  // إذا لم يتغير الـ zoom، لا داعي لحساب الـ pan
  if (newZoom === currentZoom) {
    return { zoom: currentZoom, pan: currentPan };
  }
  
  // تحويل نقطة الشاشة إلى world coordinates
  const worldX = (screenPoint.x - currentPan.x) / currentZoom;
  const worldY = (screenPoint.y - currentPan.y) / currentZoom;
  
  // حساب الـ pan الجديد بحيث تبقى نقطة العالم في نفس موقع الشاشة
  const newPanX = screenPoint.x - worldX * newZoom;
  const newPanY = screenPoint.y - worldY * newZoom;
  
  return {
    zoom: newZoom,
    pan: { x: newPanX, y: newPanY }
  };
}

/**
 * ✅ حساب zoom حول مركز الشاشة
 */
export function calculateCenterZoom(
  currentZoom: number,
  currentPan: { x: number; y: number },
  containerWidth: number,
  containerHeight: number,
  zoomDelta: number
): { zoom: number; pan: { x: number; y: number } } {
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;
  
  return calculateZoomAtPoint(currentZoom, currentPan, { x: centerX, y: centerY }, zoomDelta);
}

export interface ViewportSlice {
  viewport: { zoom: number; pan: { x: number; y: number } };
  settings: CanvasSettings;
  isPanMode: boolean;
  isFullscreen: boolean;
  showMinimap: boolean;
  
  // Viewport Actions - مركزية
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  panBy: (deltaX: number, deltaY: number) => void;
  zoomAtPoint: (screenX: number, screenY: number, zoomDelta: number) => void;
  zoomByWheel: (deltaY: number, screenX: number, screenY: number) => void;
  resetViewport: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomToFit: () => void;
  setZoomPercentage: (percentage: number) => void;
  
  // Settings Actions
  updateSettings: (settings: Partial<CanvasSettings>) => void;
  toggleGrid: () => void;
  toggleSnapToGrid: () => void;
  
  // View Mode Actions
  togglePanMode: () => void;
  toggleFullscreen: () => void;
  toggleMinimap: () => void;
}

export const createViewportSlice: StateCreator<
  any,
  [],
  [],
  ViewportSlice
> = (set, get) => ({
  viewport: { zoom: 1, pan: { x: 0, y: 0 } },
  settings: {
    zoom: 1,
    pan: { x: 0, y: 0 },
    gridEnabled: true,
    snapToGrid: false,
    gridSize: 20,
    gridType: 'grid' as 'dots' | 'grid' | 'isometric' | 'hex',
    snapToEdges: true,
    snapToCenter: true,
    snapToDistribution: false,
    background: '#FFFFFF',
    theme: 'light'
  },
  isPanMode: false,
  isFullscreen: false,
  showMinimap: false,
  
  setZoom: (zoom) => {
    const clampedZoom = Math.max(ZOOM_CONFIG.min, Math.min(ZOOM_CONFIG.max, zoom));
    set((state: any) => ({
      viewport: { ...state.viewport, zoom: clampedZoom },
      settings: { ...state.settings, zoom: clampedZoom }
    }));
  },
  
  setPan: (x, y) => {
    set((state: any) => ({
      viewport: { ...state.viewport, pan: { x, y } },
      settings: { ...state.settings, pan: { x, y } }
    }));
  },
  
  /**
   * ✅ تحريك نسبي (أفضل للـ panning)
   */
  panBy: (deltaX, deltaY) => {
    set((state: any) => {
      const newX = state.viewport.pan.x + deltaX;
      const newY = state.viewport.pan.y + deltaY;
      return {
        viewport: { ...state.viewport, pan: { x: newX, y: newY } },
        settings: { ...state.settings, pan: { x: newX, y: newY } }
      };
    });
  },
  
  /**
   * ✅ تكبير حول نقطة محددة (للماوس)
   */
  zoomAtPoint: (screenX, screenY, zoomDelta) => {
    const state = get();
    const result = calculateZoomAtPoint(
      state.viewport.zoom,
      state.viewport.pan,
      { x: screenX, y: screenY },
      zoomDelta
    );
    
    set({
      viewport: result,
      settings: { ...state.settings, zoom: result.zoom, pan: result.pan }
    });
  },
  
  /**
   * ✅ تكبير بالـ wheel (مع حساسية مناسبة)
   */
  zoomByWheel: (deltaY, screenX, screenY) => {
    const zoomDelta = -deltaY * ZOOM_CONFIG.wheelSensitivity;
    get().zoomAtPoint(screenX, screenY, zoomDelta);
  },
  
  resetViewport: () => {
    set((state: any) => ({
      viewport: { zoom: 1, pan: { x: 0, y: 0 } },
      settings: { ...state.settings, zoom: 1, pan: { x: 0, y: 0 } }
    }));
  },
  
  zoomIn: () => {
    const state = get();
    // تكبير حول مركز الشاشة
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    const result = calculateCenterZoom(
      state.viewport.zoom,
      state.viewport.pan,
      containerWidth,
      containerHeight,
      ZOOM_CONFIG.step
    );
    
    set({
      viewport: result,
      settings: { ...state.settings, zoom: result.zoom, pan: result.pan }
    });
  },
  
  zoomOut: () => {
    const state = get();
    // تصغير حول مركز الشاشة
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    const result = calculateCenterZoom(
      state.viewport.zoom,
      state.viewport.pan,
      containerWidth,
      containerHeight,
      -ZOOM_CONFIG.step
    );
    
    set({
      viewport: result,
      settings: { ...state.settings, zoom: result.zoom, pan: result.pan }
    });
  },
  
  zoomToFit: () => {
    const elements = get().elements as CanvasElement[];
    if (elements.length === 0) {
      get().resetViewport();
      return;
    }
    
    const bounds = elements.reduce((acc: any, el: CanvasElement) => ({
      minX: Math.min(acc.minX, el.position.x),
      minY: Math.min(acc.minY, el.position.y),
      maxX: Math.max(acc.maxX, el.position.x + el.size.width),
      maxY: Math.max(acc.maxY, el.position.y + el.size.height)
    }), { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });
    
    const width = bounds.maxX - bounds.minX;
    const height = bounds.maxY - bounds.minY;
    const centerX = bounds.minX + width / 2;
    const centerY = bounds.minY + height / 2;
    
    const zoom = Math.min(
      window.innerWidth / (width + 100),
      window.innerHeight / (height + 100),
      1
    );
    
    const clampedZoom = Math.max(ZOOM_CONFIG.min, Math.min(ZOOM_CONFIG.max, zoom));
    const panX = -centerX * clampedZoom + window.innerWidth / 2;
    const panY = -centerY * clampedZoom + window.innerHeight / 2;
    
    set((state: any) => ({
      viewport: { zoom: clampedZoom, pan: { x: panX, y: panY } },
      settings: { ...state.settings, zoom: clampedZoom, pan: { x: panX, y: panY } }
    }));
  },
  
  setZoomPercentage: (percentage) => {
    get().setZoom(percentage / 100);
  },
  
  updateSettings: (settings) => {
    set((state: any) => ({
      settings: { ...state.settings, ...settings }
    }));
  },
  
  toggleGrid: () => {
    set((state: any) => ({
      settings: { ...state.settings, gridEnabled: !state.settings.gridEnabled }
    }));
  },
  
  toggleSnapToGrid: () => {
    set((state: any) => ({
      settings: { ...state.settings, snapToGrid: !state.settings.snapToGrid }
    }));
  },
  
  togglePanMode: () => set((state: any) => ({ isPanMode: !state.isPanMode })),
  
  toggleFullscreen: () => {
    const state = get();
    if (!state.isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    set({ isFullscreen: !state.isFullscreen });
  },
  
  toggleMinimap: () => set((state: any) => ({ showMinimap: !state.showMinimap }))
});

// ============================================
// 🎯 Viewport Selectors (للأداء)
// ============================================

/**
 * ✅ Selector للـ viewport فقط (يتجنب re-render غير ضروري)
 */
export const selectViewport = (state: any) => state.viewport;

/**
 * ✅ Selector للـ zoom فقط
 */
export const selectZoom = (state: any) => state.viewport.zoom;

/**
 * ✅ Selector للـ pan فقط
 */
export const selectPan = (state: any) => state.viewport.pan;

/**
 * ✅ Selector للـ settings فقط
 */
export const selectSettings = (state: any) => state.settings;

/**
 * ✅ Selector للدوال فقط (لا تسبب re-render)
 */
export const selectViewportActions = (state: any) => ({
  setZoom: state.setZoom,
  setPan: state.setPan,
  panBy: state.panBy,
  zoomAtPoint: state.zoomAtPoint,
  zoomByWheel: state.zoomByWheel,
  resetViewport: state.resetViewport,
  zoomIn: state.zoomIn,
  zoomOut: state.zoomOut,
  zoomToFit: state.zoomToFit,
});
