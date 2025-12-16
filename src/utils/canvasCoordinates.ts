export type Camera = {
  x: number;
  y: number;
  zoom: number;
};

export type Point = {
  x: number;
  y: number;
};

/**
 * Screen point is always relative to the viewport top-left.
 * Camera uses screen-space translation (px) + scale.
 */

export function screenToWorld(screen: Point, camera: Camera): Point {
  return {
    x: (screen.x - camera.x) / camera.zoom,
    y: (screen.y - camera.y) / camera.zoom,
  };
}

export function worldToScreen(world: Point, camera: Camera): Point {
  return {
    x: world.x * camera.zoom + camera.x,
    y: world.y * camera.zoom + camera.y,
  };
}

/**
 * Zoom around a pivot in screen space (relative to viewport).
 * Keeps the pivot point stable under the cursor.
 */
export function zoomAtPoint(camera: Camera, nextZoom: number, pivotScreen: Point): Camera {
  const z0 = camera.zoom;
  const z1 = nextZoom;

  if (z1 === z0) return camera;

  const scale = z1 / z0;

  return {
    zoom: z1,
    x: pivotScreen.x - (pivotScreen.x - camera.x) * scale,
    y: pivotScreen.y - (pivotScreen.y - camera.y) * scale,
  };
}
