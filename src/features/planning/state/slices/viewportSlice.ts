import { StateCreator } from 'zustand';
import type { CanvasElement, CanvasSettings, LayerInfo } from '@/types/canvas';

const ZOOM_CONFIG = { min: 0.1, max: 5, step: 0.1, wheelSensitivity: 0.001 } as const;
const DEFAULT_VIEWPORT = { zoom: 1, pan: { x: 0, y: 0 } } as const;
const DEFAULT_VIEWPORT_SIZE = { width: 1280, height: 720 } as const;

function clampZoomValue(zoom: number): number {
  return Math.max(ZOOM_CONFIG.min, Math.min(ZOOM_CONFIG.max, zoom));
}

function normalizeHostSize(hostSize: { width: number; height: number } | undefined): { width: number; height: number } {
  return {
    width: hostSize && hostSize.width > 0 ? hostSize.width : DEFAULT_VIEWPORT_SIZE.width,
    height: hostSize && hostSize.height > 0 ? hostSize.height : DEFAULT_VIEWPORT_SIZE.height,
  };
}

function buildViewportState(
  currentSettings: CanvasSettings,
  viewport: { zoom: number; pan: { x: number; y: number } },
) {
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

  return {
    zoom: newZoom,
    pan: {
      x: screenPoint.x - worldX * newZoom,
      y: screenPoint.y - worldY * newZoom,
    },
  };
}

export function calculateCenterZoom(
  currentZoom: number,
  currentPan: { x: number; y: number },
  containerWidth: number,
  containerHeight: number,
  zoomDelta: number,
): { zoom: number; pan: { x: number; y: number } } {
  return calculateZoomAtPoint(
    currentZoom,
    currentPan,
    { x: containerWidth / 2, y: containerHeight / 2 },
    zoomDelta,
  );
}

function getRenderableElementsForZoom(elements: CanvasElement[], layers: LayerInfo[] = []): CanvasElement[] {
  const layerVisibilityMap = new Map(layers.map((layer) => [layer.id, layer.visible]));

  return elements.filter((element) => {
    if (element.visible === false) return false;
    if (element.layerId && layerVisibilityMap.get(element.layerId) === false) return false;
    if (!Number.isFinite(element.position?.x) || !Number.isFinite(element.position?.y)) return false;
    if (!Number.isFinite(element.size?.width) || !Number.isFinite(element.size?.height)) return false;
    return element.size.width > 0 && element.size.height > 0;
  });
}

export interface ViewportSlice {
  viewport: { zoom: number; pan: { x: number; y: number } };
  viewportHostSize: { width: number; height: number };
  settings: CanvasSettings;
  isPanMode: boolean;
  isFullscreen: boolean;
  showMinimap: boolean;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  setViewportHostSize: (width: number, height: number) => void;
  panBy: (deltaX: number, deltaY: number) => void;
  zoomAtPoint: (screenX: number, screenY: number, zoomDelta: number) => void;
  zoomByWheel: (deltaY: number, screenX: number, screenY: number) => void;
  resetViewport: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomToFit: () => void;
  setZoomPercentage: (percentage: number) => void;
  updateSettings: (settings: Partial<CanvasSettings>) => void;
  toggleGrid: () => void;
  toggleSnapToGrid: () => void;
  togglePanMode: () => void;
  toggleFullscreen: () => void;
  toggleMinimap: () => void;
}

export const createViewportSlice: StateCreator<any, [], [], ViewportSlice> = (set, get) => ({
  viewport: { ...DEFAULT_VIEWPORT, pan: { ...DEFAULT_VIEWPORT.pan } },
  viewportHostSize: { ...DEFAULT_VIEWPORT_SIZE },
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
    set((state: any) => buildViewportState(state.settings, {
      ...state.viewport,
      zoom: clampZoomValue(zoom),
    }));
  },

  setPan: (x, y) => {
    set((state: any) => buildViewportState(state.settings, {
      ...state.viewport,
      pan: { x, y },
    }));
  },

  setViewportHostSize: (width, height) => {
    set({
      viewportHostSize: {
        width: width > 0 ? width : DEFAULT_VIEWPORT_SIZE.width,
        height: height > 0 ? height : DEFAULT_VIEWPORT_SIZE.height,
      },
    });
  },

  panBy: (deltaX, deltaY) => {
    set((state: any) => buildViewportState(state.settings, {
      ...state.viewport,
      pan: {
        x: state.viewport.pan.x + deltaX,
        y: state.viewport.pan.y + deltaY,
      },
    }));
  },

  zoomAtPoint: (screenX, screenY, zoomDelta) => {
    const state = get();
    const result = calculateZoomAtPoint(state.viewport.zoom, state.viewport.pan, { x: screenX, y: screenY }, zoomDelta);
    set(buildViewportState(state.settings, result));
  },

  zoomByWheel: (deltaY, screenX, screenY) => {
    get().zoomAtPoint(screenX, screenY, -deltaY * ZOOM_CONFIG.wheelSensitivity);
  },

  resetViewport: () => {
    set((state: any) => buildViewportState(state.settings, {
      zoom: DEFAULT_VIEWPORT.zoom,
      pan: { ...DEFAULT_VIEWPORT.pan },
    }));
  },

  zoomIn: () => {
    const state = get();
    const hostSize = normalizeHostSize(state.viewportHostSize);
    const result = calculateCenterZoom(
      state.viewport.zoom,
      state.viewport.pan,
      hostSize.width,
      hostSize.height,
      ZOOM_CONFIG.step,
    );
    set(buildViewportState(state.settings, result));
  },

  zoomOut: () => {
    const state = get();
    const hostSize = normalizeHostSize(state.viewportHostSize);
    const result = calculateCenterZoom(
      state.viewport.zoom,
      state.viewport.pan,
      hostSize.width,
      hostSize.height,
      -ZOOM_CONFIG.step,
    );
    set(buildViewportState(state.settings, result));
  },

  zoomToFit: () => {
    const state = get();
    const elements = getRenderableElementsForZoom(state.elements as CanvasElement[], state.layers as LayerInfo[]);
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

    const width = Math.max(bounds.maxX - bounds.minX, 1);
    const height = Math.max(bounds.maxY - bounds.minY, 1);
    const centerX = bounds.minX + width / 2;
    const centerY = bounds.minY + height / 2;
    const { width: hostWidth, height: hostHeight } = normalizeHostSize(state.viewportHostSize);

    const zoom = Math.min(hostWidth / (width + 100), hostHeight / (height + 100), 1);
    const clampedZoom = clampZoomValue(zoom);

    set((currentState: any) => buildViewportState(currentState.settings, {
      zoom: clampedZoom,
      pan: {
        x: -centerX * clampedZoom + hostWidth / 2,
        y: -centerY * clampedZoom + hostHeight / 2,
      },
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

  toggleGrid: () => set((state: any) => ({ settings: { ...state.settings, gridEnabled: !state.settings.gridEnabled } })),
  toggleSnapToGrid: () => set((state: any) => ({ settings: { ...state.settings, snapToGrid: !state.settings.snapToGrid } })),
  togglePanMode: () => set((state: any) => ({ isPanMode: !state.isPanMode })),
  toggleFullscreen: () => {
    const state = get();
    if (!state.isFullscreen) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
    set({ isFullscreen: !state.isFullscreen });
  },
  toggleMinimap: () => set((state: any) => ({ showMinimap: !state.showMinimap })),
});

export const selectViewport = (state: any) => state.viewport;
export const selectViewportHostSize = (state: any) => state.viewportHostSize;
export const selectZoom = (state: any) => state.viewport.zoom;
export const selectPan = (state: any) => state.viewport.pan;
export const selectSettings = (state: any) => state.settings;
export const selectViewportActions = (state: any) => ({
  setZoom: state.setZoom,
  setPan: state.setPan,
  setViewportHostSize: state.setViewportHostSize,
  panBy: state.panBy,
  zoomAtPoint: state.zoomAtPoint,
  zoomByWheel: state.zoomByWheel,
  resetViewport: state.resetViewport,
  zoomIn: state.zoomIn,
  zoomOut: state.zoomOut,
  zoomToFit: state.zoomToFit,
});
