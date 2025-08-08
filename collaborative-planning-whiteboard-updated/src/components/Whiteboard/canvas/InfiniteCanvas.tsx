import React, { useRef, useEffect, useState } from 'react';
import { useWhiteboardStore } from '../../../store/whiteboard';

const GRID_SPACING = 40;

function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number, spacing: number) {
  ctx.strokeStyle = 'rgba(0,0,0,0.05)';
  ctx.lineWidth = 1;
  // Draw vertical lines
  for (let x = -width; x < width * 2; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, -height);
    ctx.lineTo(x, height * 2);
    ctx.stroke();
  }
  // Draw horizontal lines
  for (let y = -height; y < height * 2; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(-width, y);
    ctx.lineTo(width * 2, y);
    ctx.stroke();
  }
}

const InfiniteCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    pan,
    zoom,
    showGrid,
    setPan,
    setZoom,
  } = useWhiteboardStore((state) => ({
    pan: state.pan,
    zoom: state.zoom,
    showGrid: state.showGrid,
    setPan: state.setPan,
    setZoom: state.setZoom,
  }));

  const [isPanning, setIsPanning] = useState(false);
  const startPan = useRef({ x: 0, y: 0 });
  const pointerStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
      redraw();
    };
    const redraw = () => {
      ctx.save();
      // clear full canvas
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
      ctx.save();
      // apply pan and zoom
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);
      if (showGrid) {
        drawGrid(
          ctx,
          canvas.offsetWidth / zoom,
          canvas.offsetHeight / zoom,
          GRID_SPACING
        );
      }
      // TODO: draw items here
      ctx.restore();
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [pan, zoom, showGrid]);

  // Redraw when state changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    // clear and redraw
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    ctx.save();
    ctx.translate(pan.x * dpr, pan.y * dpr);
    ctx.scale(zoom, zoom);
    if (showGrid) {
      drawGrid(
        ctx,
        canvas.offsetWidth / zoom / dpr,
        canvas.offsetHeight / zoom / dpr,
        GRID_SPACING
      );
    }
    ctx.restore();
  }, [pan, zoom, showGrid]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handlePointerDown = (e: PointerEvent) => {
      setIsPanning(true);
      pointerStart.current = { x: e.clientX, y: e.clientY };
      startPan.current = { ...pan };
      canvas.setPointerCapture(e.pointerId);
    };
    const handlePointerMove = (e: PointerEvent) => {
      if (!isPanning) return;
      const dx = e.clientX - pointerStart.current.x;
      const dy = e.clientY - pointerStart.current.y;
      setPan({ x: startPan.current.x + dx, y: startPan.current.y + dy });
    };
    const handlePointerUp = (e: PointerEvent) => {
      setIsPanning(false);
      canvas.releasePointerCapture(e.pointerId);
    };
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const { clientX, clientY, deltaY } = e;
      const rect = canvas.getBoundingClientRect();
      const x = (clientX - rect.left - pan.x) / zoom;
      const y = (clientY - rect.top - pan.y) / zoom;
      let newZoom = zoom * (deltaY > 0 ? 0.9 : 1.1);
      newZoom = Math.min(Math.max(newZoom, 0.1), 5);
      const newPanX = pan.x - (x * newZoom - x * zoom);
      const newPanY = pan.y - (y * newZoom - y * zoom);
      setZoom(newZoom);
      setPan({ x: newPanX, y: newPanY });
    };
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [pan, zoom, isPanning]);

  return <canvas ref={canvasRef} className="w-full h-full touch-none cursor-grab" />;
};

export default InfiniteCanvas;