import { useCallback } from "react";
import { useCanvasStore } from "../store/canvas.store";

export function useZoomPan(){
  const camera = useCanvasStore(s=>s.camera);
  const setCamera = useCanvasStore(s=>s.setCamera);

  const worldToScreen = useCallback((pt:{x:number;y:number})=>({
    x: pt.x * camera.k + camera.tx,
    y: pt.y * camera.k + camera.ty
  }), [camera.k, camera.tx, camera.ty]);

  const screenToWorld = useCallback((pt:{x:number;y:number})=>({
    x: (pt.x - camera.tx) / camera.k,
    y: (pt.y - camera.ty) / camera.k
  }), [camera.k, camera.tx, camera.ty]);

  const onWheelZoom = (e: WheelEvent) => {
    const rect = (e.currentTarget as HTMLElement | null)?.getBoundingClientRect?.();
    const cx = e.clientX - (rect?.left ?? 0);
    const cy = e.clientY - (rect?.top ?? 0);

    const delta = -e.deltaY;
    const k = Math.min(5, Math.max(0.1, camera.k * (delta>0 ? 1.05 : 0.95)));
    const wx = (cx - camera.tx) / camera.k;
    const wy = (cy - camera.ty) / camera.k;
    const tx = cx - wx * k;
    const ty = cy - wy * k;
    setCamera({ k, tx, ty });
  };

  return { camera, setCamera, worldToScreen, screenToWorld, onWheelZoom };
}
