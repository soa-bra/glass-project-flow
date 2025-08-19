// Emergency Fallback Canvas - طبقة رسم الطوارئ
import React, { useRef, useEffect } from 'react';

interface FallbackCanvasProps {
  enabled: boolean;
}

export default function FallbackCanvas({ enabled }: FallbackCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!enabled || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match parent
    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      
      // Clear and redraw
      draw(ctx, rect.width, rect.height);
    };

    const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Draw grid
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.lineWidth = 1;
      
      const gridSize = 24;
      
      // Vertical lines
      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      // Horizontal lines
      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      
      // Draw center sticky note
      const stickyX = width / 2 - 130;
      const stickyY = height / 2 - 90;
      const stickyW = 260;
      const stickyH = 180;
      
      // Sticky background
      ctx.fillStyle = '#fef3c7';
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 2;
      ctx.fillRect(stickyX, stickyY, stickyW, stickyH);
      ctx.strokeRect(stickyX, stickyY, stickyW, stickyH);
      
      // Sticky text
      ctx.fillStyle = '#92400e';
      ctx.font = '14px "IBM Plex Sans Arabic", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const lines = [
        'تم التشغيل ✓',
        '',
        'اللوحة جاهزة للاستخدام',
        'جاري تحميل المحرك...'
      ];
      
      lines.forEach((line, i) => {
        ctx.fillText(line, stickyX + stickyW / 2, stickyY + 50 + i * 25);
      });
    };

    updateSize();
    
    // Handle window resize
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{ display: enabled ? 'block' : 'none' }}
      data-test-id="fallback-canvas"
    />
  );
}