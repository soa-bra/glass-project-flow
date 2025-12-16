import { useMemo, useState } from "react";
import { clamp } from "@/utils/canvasUtils";

type Camera = { x: number; y: number; zoom: number };
type Point = { x: number; y: number };

function zoomAtPoint(camera: Camera, nextZoom: number, pivot: Point): Camera {
  const wx = (pivot.x - camera.x) / camera.zoom;
  const wy = (pivot.y - camera.y) / camera.zoom;
  return {
    x: pivot.x - wx * nextZoom,
    y: pivot.y - wy * nextZoom,
    zoom: nextZoom,
  };
}

type SetCameraPatch = Partial<Camera> | ((c: Camera) => Partial<Camera>);

export function useCanvasCamera() {
  const [camera, setCameraState] = useState<Camera>({ x: 0, y: 0, zoom: 1 });

  const setCamera = useMemo(() => {
    return (patch: SetCameraPatch) => {
      setCameraState((cur) => {
        const nextPatch = typeof patch === "function" ? patch(cur) : patch;
        const next: Camera = { ...cur, ...nextPatch };
        if (next.x === cur.x && next.y === cur.y && next.zoom === cur.zoom) return cur;
        return next;
      });
    };
  }, []);

  const panBy = useMemo(() => {
    return (dxWorld: number, dyWorld: number) => {
      setCamera((c) => ({ x: c.x + dxWorld, y: c.y + dyWorld }));
    };
  }, [setCamera]);

  const setZoomAt = useMemo(() => {
    return (nextZoom: number, pivotScreen: Point) => {
      setCamera((c) => {
        const z = clamp(nextZoom, 0.2, 4);
        return zoomAtPoint(c, z, pivotScreen);
      });
    };
  }, [setCamera]);

  const resetCamera = useMemo(() => {
    return () => setCamera({ x: 0, y: 0, zoom: 1 });
  }, [setCamera]);

  return {
    camera,
    setCamera,
    panBy,
    setZoomAt,
    resetCamera,
  };
}
