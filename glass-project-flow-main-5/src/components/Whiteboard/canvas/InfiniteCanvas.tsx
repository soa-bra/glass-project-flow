import React, { useRef, useEffect, useState } from 'react';
import { useWhiteboardStore } from '../../../store/whiteboard';

const GRID_SPACING = 40;

function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  spacing: number
) {
  ctx.strokeStyle = 'rgba(0,0,0,0.05)';
  ctx.lineWidth = 1;
  for (let x = -width; x < width * 2; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, -height);
    ctx.lineTo(x, height * 2);
    ctx.stroke();
  }
  for (let y = -height; y < height * 2; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(-width, y);
    ctx.lineTo(width * 2, y);
    ctx.stroke();
  }
}

const InfiniteCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { pan, zoom, showGrid } = useWhiteboardStore((state) => ({
    pan: state.pan,
    zoom: state.zoom,
    showGrid: state.showGrid,
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
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
      ctx.save();
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
      ctx.restore();
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [pan, zoom, showGrid]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { setPanImmediate, setZoomImmediate, saveSnapshot } = useWhiteboardStore.getState();
    
    const handlePointerDown = (e: PointerEvent) => {
      saveSnapshot(); // Save state before starting to pan
      setIsPanning(true);
      pointerStart.current = { x: e.clientX, y: e.clientY };
      startPan.current = { ...useWhiteboardStore.getState().pan };
      canvas.setPointerCapture(e.pointerId);
    };
    const handlePointerMove = (e: PointerEvent) => {
      if (!isPanning) return;
      const dx = e.clientX - pointerStart.current.x;
      const dy = e.clientY - pointerStart.current.y;
      setPanImmediate({ x: startPan.current.x + dx, y: startPan.current.y + dy });
    };
    const handlePointerUp = (e: PointerEvent) => {
      setIsPanning(false);
      canvas.releasePointerCapture(e.pointerId);
    };
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const { clientX, clientY, deltaY } = e;
      const rect = canvas.getBoundingClientRect();
      const { pan: panState, zoom: zoomState, saveSnapshot } = useWhiteboardStore.getState();
      saveSnapshot(); // Save state before zooming
      const x = (clientX - rect.left - panState.x) / zoomState;
      const y = (clientY - rect.top - panState.y) / zoomState;
      let newZoom = zoomState * (deltaY > 0 ? 0.9 : 1.1);
      newZoom = Math.min(Math.max(newZoom, 0.1), 5);
      const newPanX = panState.x - (x * newZoom - x * zoomState);
      const newPanY = panState.y - (y * newZoom - y * zoomState);
      setZoomImmediate(newZoom);
      setPanImmediate({ x: newPanX, y: newPanY });
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
  }, []);
  return <canvas ref={canvasRef} className="w-full h-full touch-none cursor-grab" />;
};

export default InfiniteCanvas;