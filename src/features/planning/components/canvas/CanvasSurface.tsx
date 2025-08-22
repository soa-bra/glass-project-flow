
import React, { useRef, useEffect } from 'react';

export default function CanvasSurface() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // رسم شبكة بسيطة
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;

    const gridSize = 20;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }, []);

  return (
    <div className="w-full h-full bg-white relative">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-full"
      />
    </div>
  );
}
