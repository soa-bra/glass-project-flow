import {
  calculateCenterZoom,
  calculateZoomAtPoint,
  createViewportSlice,
} from './viewportSlice';
import { DEFAULT_CANVAS_SETTINGS } from '../types';

type ViewportSliceState = ReturnType<typeof createViewportSlice>;

function createViewportSliceState(): ViewportSliceState {
  let state: Record<string, unknown> = {};
  const setState = (updater: Record<string, unknown> | ((current: Record<string, unknown>) => Record<string, unknown>)) => {
    const patch = typeof updater === 'function' ? updater(state) : updater;
    state = { ...state, ...patch };
  };
  const getState = () => state;
  const slice = createViewportSlice(setState as never, getState as never, {} as never);
  state = { ...state, ...slice };
  return slice;
}

describe('viewportSlice default settings', () => {
  it('uses a 32px dot grid by default for new planning canvases', () => {
    const slice = createViewportSliceState();

    expect(slice.settings.gridEnabled).toBe(true);
    expect(slice.settings.gridSize).toBe(32);
    expect(slice.settings.gridType).toBe('dots');
  });

  it('keeps the exported default canvas settings aligned with the store defaults', () => {
    expect(DEFAULT_CANVAS_SETTINGS.gridSize).toBe(32);
    expect(DEFAULT_CANVAS_SETTINGS.gridType).toBe('dots');
  });
});

describe('viewportSlice math helpers', () => {
  it('keeps the same world point under the cursor after zooming in', () => {
    const currentZoom = 1;
    const currentPan = { x: 120, y: 80 };
    const screenPoint = { x: 640, y: 360 };

    const worldXBefore = (screenPoint.x - currentPan.x) / currentZoom;
    const worldYBefore = (screenPoint.y - currentPan.y) / currentZoom;

    const result = calculateZoomAtPoint(
      currentZoom,
      currentPan,
      screenPoint,
      0.25,
    );

    const worldXAfter = (screenPoint.x - result.pan.x) / result.zoom;
    const worldYAfter = (screenPoint.y - result.pan.y) / result.zoom;

    expect(result.zoom).toBeCloseTo(1.25);
    expect(worldXAfter).toBeCloseTo(worldXBefore);
    expect(worldYAfter).toBeCloseTo(worldYBefore);
  });

  it('clamps zoom to the configured minimum and maximum bounds', () => {
    const zoomedOut = calculateZoomAtPoint(
      0.11,
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      -0.9,
    );

    const zoomedIn = calculateZoomAtPoint(
      4.9,
      { x: 0, y: 0 },
      { x: 100, y: 100 },
      0.5,
    );

    expect(zoomedOut.zoom).toBe(0.1);
    expect(zoomedIn.zoom).toBe(5);
  });

  it('zooms around the viewport center when using center zoom helper', () => {
    const currentZoom = 1;
    const currentPan = { x: 50, y: 30 };
    const containerWidth = 1200;
    const containerHeight = 800;

    const result = calculateCenterZoom(
      currentZoom,
      currentPan,
      containerWidth,
      containerHeight,
      0.1,
    );

    const center = {
      x: containerWidth / 2,
      y: containerHeight / 2,
    };

    const worldXBefore = (center.x - currentPan.x) / currentZoom;
    const worldYBefore = (center.y - currentPan.y) / currentZoom;
    const worldXAfter = (center.x - result.pan.x) / result.zoom;
    const worldYAfter = (center.y - result.pan.y) / result.zoom;

    expect(result.zoom).toBeCloseTo(1.1);
    expect(worldXAfter).toBeCloseTo(worldXBefore);
    expect(worldYAfter).toBeCloseTo(worldYBefore);
  });

  it('returns the current viewport unchanged when clamped zoom does not change', () => {
    const currentPan = { x: 10, y: 15 };

    const result = calculateZoomAtPoint(
      5,
      currentPan,
      { x: 200, y: 200 },
      0.2,
    );

    expect(result.zoom).toBe(5);
    expect(result.pan).toEqual(currentPan);
  });
});
