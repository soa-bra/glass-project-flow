"use client";
import React, { useEffect, useMemo, useRef } from "react";
import Frame from "./Frame";
import WidgetsLayer from "./WidgetsLayer";
import ConnectorsLayer from "./ConnectorsLayer";
import GuidesLayer from "./GuidesLayer";
import PresenceLayer from "./PresenceLayer";
import QuickToolbar from "../floating/QuickToolbar";
import ContextMenus from "../floating/ContextMenus";

import { useCanvas } from "@/src/features/planning/hooks/useCanvas";
import { useZoomPan } from "@/src/features/planning/hooks/useZoomPan";
import { useGrid } from "@/src/features/planning/hooks/useGrid";
import { useTools } from "@/src/features/planning/store/tools.store";

interface CanvasSurfaceProps {
  boardId?: string;
}

const CanvasSurface: React.FC<CanvasSurfaceProps> = ({ boardId }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLCanvasElement>(null);

  const { camera, setCamera, worldToScreen, screenToWorld } = useZoomPan();
  const { visible: gridVisible, size: gridSize, type: gridType } = useGrid();
  const { onPointerDown, onPointerMove, onPointerUp, onWheelZoom, onKeyDown, onKeyUp, getFrames } = useCanvas();
  const { activeTool } = useTools();

  // رسم الشبكة على طبقة خلفية (Canvas) لسرعة أعلى
  useEffect(() => {
    const canvas = bgRef.current; if (!canvas) return;
    const parent = canvas.parentElement!;
    const dpr = window.devicePixelRatio || 1;
    const w = parent.clientWidth, h = parent.clientHeight;
    canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0,0,w,h);
    if (!gridVisible) return;

    const s = gridSize;
    ctx.save();
    ctx.translate(camera.tx, camera.ty);
    ctx.scale(camera.k, camera.k);

    if (gridType === "dots") {
      ctx.fillStyle = "#e5e7eb";
      const step = s;
      const bounds = { x: -camera.tx/camera.k - 1000, y: -camera.ty/camera.k - 1000, w: w/camera.k + 2000, h: h/camera.k + 2000 };
      for (let y = Math.floor(bounds.y/step)*step; y < bounds.y + bounds.h; y += step) {
        for (let x = Math.floor(bounds.x/step)*step; x < bounds.x + bounds.w; x += step) {
          ctx.fillRect(x, y, 1, 1);
        }
      }
    } else {
      ctx.strokeStyle = "#f1f5f9";
      ctx.lineWidth = 1 / camera.k;
      if (gridType === "grid") {
        const step = s;
        const startX = Math.floor((-camera.tx/camera.k)/step)*step;
        const startY = Math.floor((-camera.ty/camera.k)/step)*step;
        const maxX = startX + w/camera.k + step*2;
        const maxY = startY + h/camera.k + step*2;
        for (let x = startX; x < maxX; x += step) { ctx.beginPath(); ctx.moveTo(x, startY); ctx.lineTo(x, maxY); ctx.stroke(); }
        for (let y = startY; y < maxY; y += step) { ctx.beginPath(); ctx.moveTo(startX, y); ctx.lineTo(maxX, y); ctx.stroke(); }
      }
      // isometric/hex يمكن إضافتها لاحقًا بلا تغيير بقية النظام
    }
    ctx.restore();
  }, [camera.k, camera.tx, camera.ty, gridVisible, gridSize, gridType]);

  // أحداث المؤشر/لوح المفاتيح على طبقة الجذر
  useEffect(() => {
    const el = rootRef.current; if (!el) return;
    const onWheel = (e: WheelEvent) => { if (e.ctrlKey) { e.preventDefault(); onWheelZoom(e); } };
    el.addEventListener("wheel", onWheel, { passive: false });
    const onKey = (e: KeyboardEvent) => onKeyDown(e as any);
    const onKeyU = (e: KeyboardEvent) => onKeyUp(e as any);
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyU);
    return () => {
      el.removeEventListener("wheel", onWheel as any);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKeyU);
    };
  }, [onWheelZoom, onKeyDown, onKeyUp]);

  const transform = useMemo(
    () => ({ transform: `translate(${camera.tx}px, ${camera.ty}px) scale(${camera.k})`, transformOrigin: "0 0" as const }),
    [camera.tx, camera.ty, camera.k]
  );

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 overflow-hidden bg-neutral-50"
      onPointerDown={(e) => onPointerDown(e.nativeEvent, screenToWorld)}
      onPointerMove={(e) => onPointerMove(e.nativeEvent, screenToWorld)}
      onPointerUp={(e) => onPointerUp(e.nativeEvent, screenToWorld)}
      data-active-tool={activeTool}
      aria-label="Infinite Canvas Surface"
      role="application"
    >
      {/* طبقة الشبكة الخلفية */}
      <canvas ref={bgRef} className="absolute inset-0 pointer-events-none" aria-hidden />

      {/* العالم المرسوم */}
      <div className="absolute top-0 left-0 will-change-transform" style={transform}>
        {/* Frames */}
        {getFrames().map((f:any) => <Frame key={f.id} frame={f} />)}

        {/* Connectors قبل الودجتس لتقليل ترسيم فوقي */}
        <ConnectorsLayer />

        {/* Widgets */}
        <WidgetsLayer />

        {/* Guides & Overlays */}
        <GuidesLayer />
      </div>

      {/* Presence أعلى الكل لأنها screen-space */}
      <PresenceLayer worldToScreen={worldToScreen} />

      {/* أدوات عائمة سياقية */}
      <QuickToolbar />
      <ContextMenus />
    </div>
  );
};

export default CanvasSurface;
