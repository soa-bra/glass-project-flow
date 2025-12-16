import { useMemo, useState } from "react";
import type { Camera, Point } from "./canvasCoordinates";
import { clamp } from "./canvasUtils";
import { zoomAtPoint } from "./canvasCoordinates";

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
