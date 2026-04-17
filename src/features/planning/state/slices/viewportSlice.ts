/**
 * Viewport Slice - إدارة التكبير والتحريك
 * ✅ مركزية جميع حسابات viewport
 */

import { StateCreator } from 'zustand';
import type { CanvasElement, CanvasSettings } from '@/types/canvas';

const ZOOM_CONFIG = {
  min: 0.1,
  max: 5,
  step: 0.1,
  wheelSensitivity: 0.001,
} as const;

const DEFAULT_VIEWPORT = {
  zoom: 1,
  pan: { x: 0, y: 0 },
} as const;

const DEFAULT_VIEWPORT_SIZE = {
  width: 1280,
  height: 720,
} as const;

function clampZoomValue(zoom: number): number {
  return Math.max(ZOOM_CONFIG.min, Math.min(ZOOM_CONFIG.max, zoom));
}

function getViewportHostSize(): { width: number; height: number } {
  if (typeof window === 'undefined') {
    return { ...DEFAULT_VIEWPORT_SIZE };
  }

  return {
    width: window.innerWidth || DEFAULT_VIEWPORT_SIZE.width,
    height: window.innerHeight || DEFAULT_VIEWPORT_SIZE.height,
  };
}

function buildViewportState(
  currentSettings: CanvasSettings,
  viewport: { zoom: number; pan: { x: number; y: number } },
): {
  viewport: { zoom: number; pan: { x: number; y: number } };
  settings: CanvasSettings;
} {
  return {
    viewport,
    settings: {
      ...currentSettings,
      zoom: viewport.zoom,
      pan: viewport.pan,
    },
  };
}

export function calculateZoomAtPoint(
  currentZoom: number,
  currentPan: { x: number; y: number },
  screenPoint: { x: number; y: number },
  zoomDelta: number,
): { zoom: number; pan: { x: number; y: number } } {
  const newZoom = clampZoomValue(currentZoom * (1 + zoomDelta));

  if (newZoom === currentZoom) {
    return { zoom: currentZoom, pan: currentPan };
  }

  const worldX = (screenPoint.x - currentPan.x) / currentZoom;
  const worldY = (screenPoint.y - currentPan.y) / currentZoom;

  const newPanX = screenPoint.x - worldX * newZoom;
  const newPanY = screenPoint.y - worldY * newZoom;

  return {
    zoom: newZoom,
    pan: { x: newPanX, y: newPanY },
  };
}

export function calculateCenterZoom(
  currentZoom: number,
  currentPan: { x: number; y: number },
  containerWidth: number,
  containerHeight: number,
  zoomDelta: number,
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
  viewport: { ...DEFAULT_VIEWPORT, pan: { ...DEFAULT_VIEWPORT.pan } },
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
    theme: 'light',
  },
  isPanMode: false,
  isFullscreen: false,
  showMinimap: false,

  setZoom: (zoom) => {
    set((state: any) => {
      const nextViewport = {
        ...state.viewport,
        zoom: clampZoomValue(zoom),
      };

      return buildViewportState(state.settings, nextViewport);
    });
  },

  setPan: (x, y) => {
    set((state: any) => {
      const nextViewport = {
        ...state.viewport,
        pan: { x, y },
      };

      return buildViewportState(state.settings, nextViewport);
    });
  },

  panBy: (deltaX, deltaY) => {
    set((state: any) => {
      const nextViewport = {
        ...state.viewport,
        pan: {
          x: state.viewport.pan.x + deltaX,
          y: state.viewport.pan.y + deltaY,
        },
      };

      return buildViewportState(state.settings, nextViewport);
    });
  },

  zoomAtPoint: (screenX, screenY, zoomDelta) => {
    const state = get();
    const result = calculateZoomAtPoint(
      state.viewport.zoom,
      state.viewport.pan,
      { x: screenX, y: screenY },
      zoomDelta,
    );

    set(buildViewportState(state.settings, result));
  },

  zoomByWheel: (deltaY, screenX, screenY) => {
    const zoomDelta = -deltaY * ZOOM_CONFIG.wheelSensitivity;
    get().zoomAtPoint(screenX, screenY, zoomDelta);
  },

  resetViewport: () => {
    set((state: any) => buildViewportState(state.settings, {
      zoom: DEFAULT_VIEWPORT.zoom,
      pan: { ...DEFAULT_VIEWPORT.pan },
    }));
  },

  zoomIn: () => {
    const state = get();
    const { width, height } = getViewportHostSize();
    const result = calculateCenterZoom(
      state.viewport.zoom,
      state.viewport.pan,
      width,
      height,
      ZOOM_CONFIG.step,
    );

    set(buildViewportState(state.settings, result));
  },

  zoomOut: () => {
    const state = get();
    const { width, height } = getViewportHostSize();
    const result = calculateCenterZoom(
      state.viewport.zoom,
      state.viewport.pan,
      width,
      height,
      -ZOOM_CONFIG.step,
    );

    set(buildViewportState(state.settings, result));
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
      maxY: Math.max(acc.maxY, el.position.y + el.size.height),
    }), { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });

    const width = bounds.maxX - bounds.minX;
    const height = bounds.maxY - bounds.minY;
    const centerX = bounds.minX + width / 2;
    const centerY = bounds.minY + height / 2;
    const viewportSize = getViewportHostSize();

    const zoom = Math.min(
      viewportSize.width / (width + 100),
      viewportSize.height / (height + 100),
      1,
    );

    const clampedZoom = clampZoomValue(zoom);
    const panX = -centerX * clampedZoom + viewportSize.width / 2;
    const panY = -centerY * clampedZoom + viewportSize.height / 2;

    set((state: any) => buildViewportState(state.settings, {
      zoom: clampedZoom,
      pan: { x: panX, y: panY },
    }));
  },

  setZoomPercentage: (percentage) => {
    get().setZoom(percentage / 100);
  },

  updateSettings: (settings) => {
    set((state: any) => {
      const nextViewport = {
        zoom: typeof settings.zoom === 'number' ? clampZoomValue(settings.zoom) : state.viewport.zoom,
        pan: settings.pan ? { x: settings.pan.x, y: settings.pan.y } : state.viewport.pan,
      };

      return {
        viewport: nextViewport,
        settings: {
          ...state.settings,
          ...settings,
          zoom: nextViewport.zoom,
          pan: nextViewport.pan,
        },
      };
    });
  },

  toggleGrid: () => {
    set((state: any) => ({
      settings: { ...state.settings, gridEnabled: !state.settings.gridEnabled },
    }));
  },

  toggleSnapToGrid: () => {
    set((state: any) => ({
      settings: { ...state.settings, snapToGrid: !state.settings.snapToGrid },
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

  toggleMinimap: () => set((state: any) => ({ showMinimap: !state.showMinimap })),
});

export const selectViewport = (state: any) => state.viewport;
export const selectZoom = (state: any) => state.viewport.zoom;
export const selectPan = (state: any) => state.viewport.pan;
export const selectSettings = (state: any) => state.settings;
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
