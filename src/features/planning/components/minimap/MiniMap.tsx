"use client";
import React, { useEffect, useRef } from "react";
import { useCanvas } from "@/src/features/planning/hooks/useCanvas";
import { useZoomPan } from "@/src/features/planning/hooks/useZoomPan";

const MiniMap: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const { getSceneBounds, getFrames, focusRect } = useCanvas();
  const { viewportRect } = useZoomPan();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const size = 180;
    canvas.width = size; canvas.height = size;

    const scene = getSceneBounds(); // {x,y,w,h}
    if (!scene) return;
    const scale = Math.min(size / scene.w, size / scene.h);
    const ox = (size - scene.w * scale) / 2;
    const oy = (size - scene.h * scale) / 2;

    ctx.clearRect(0,0,size,size);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0,0,size,size);
    ctx.strokeStyle = "#e5e7eb";
    ctx.strokeRect(0,0,size,size);

    // frames
    ctx.strokeStyle = "#94a3b8";
    getFrames().forEach((f:any) => {
      ctx.strokeRect(ox + (f.x - scene.x) * scale, oy + (f.y - scene.y) * scale, f.w * scale, f.h * scale);
    });

    // viewport
    if (viewportRect) {
      ctx.strokeStyle = "#2563eb";
      ctx.lineWidth = 2;
      const vr = viewportRect;
      ctx.strokeRect(ox + (vr.x - scene.x) * scale, oy + (vr.y - scene.y) * scale, vr.w * scale, vr.h * scale);
    }
  }, [getSceneBounds, getFrames, viewportRect]);

  const onClick = (e: React.MouseEvent) => {
    const canvas = ref.current!;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    // naive center focus by ratio
    const scene = getSceneBounds(); if (!scene) return;
    const size = 180;
    const scale = Math.min(size / scene.w, size / scene.h);
    const ox = (size - scene.w * scale) / 2;
    const oy = (size - scene.h * scale) / 2;
    const sx = (x - ox) / scale + scene.x;
    const sy = (y - oy) / scale + scene.y;
    focusRect({ x: sx - 200, y: sy - 150, w: 400, h: 300 });
  };

  return (
    <div className="absolute right-3 bottom-3 bg-white/90 backdrop-blur border rounded shadow p-1">
      <canvas ref={ref} width={180} height={180} onClick={onClick} className="cursor-crosshair" aria-label="MiniMap" />
    </div>
  );
};
export default MiniMap;
