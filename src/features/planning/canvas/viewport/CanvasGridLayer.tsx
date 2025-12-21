/**
 * Canvas Grid Layer - طبقة الشبكة الديناميكية
 * 
 * ترسم شبكة ديناميكية بناءً على viewport الحالي
 * مع دعم أنماط متعددة: خطوط، نقاط، إيزومتريك، سداسي
 */

import React, { useRef, useEffect, useCallback } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { canvasKernel } from '@/core/canvasKernel';
import { gridRenderer, type GridConfig } from '@/core/gridRenderer';

interface CanvasGridLayerProps {
  config?: Partial<GridConfig>;
}

export const CanvasGridLayer: React.FC<CanvasGridLayerProps> = ({ config }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);
  
  const { settings, viewport } = useCanvasStore();

  // رسم الشبكة كخطوط
  const drawLines = useCallback((
    ctx: CanvasRenderingContext2D,
    startX: number, startY: number,
    endX: number, endY: number,
    gridSize: number, majorEvery: number,
    containerWidth: number, containerHeight: number
  ) => {
    // رسم الخطوط الثانوية
    ctx.beginPath();
    ctx.strokeStyle = config?.minorLineColor || 'rgba(11, 15, 18, 0.06)';
    ctx.lineWidth = config?.minorLineWidth || 1;

    for (let worldX = startX; worldX <= endX; worldX += gridSize) {
      if (Math.abs(worldX % (gridSize * majorEvery)) < 0.01) continue;
      const screenX = Math.round(worldX * viewport.zoom + viewport.pan.x) + 0.5;
      ctx.moveTo(screenX, 0);
      ctx.lineTo(screenX, containerHeight);
    }

    for (let worldY = startY; worldY <= endY; worldY += gridSize) {
      if (Math.abs(worldY % (gridSize * majorEvery)) < 0.01) continue;
      const screenY = Math.round(worldY * viewport.zoom + viewport.pan.y) + 0.5;
      ctx.moveTo(0, screenY);
      ctx.lineTo(containerWidth, screenY);
    }
    ctx.stroke();

    // رسم الخطوط الرئيسية
    ctx.beginPath();
    ctx.strokeStyle = config?.majorLineColor || 'rgba(11, 15, 18, 0.12)';
    ctx.lineWidth = config?.majorLineWidth || 1;

    const majorGridSize = gridSize * majorEvery;
    const majorStartX = Math.floor(startX / majorGridSize) * majorGridSize;
    const majorStartY = Math.floor(startY / majorGridSize) * majorGridSize;

    for (let worldX = majorStartX; worldX <= endX; worldX += majorGridSize) {
      const screenX = Math.round(worldX * viewport.zoom + viewport.pan.x) + 0.5;
      ctx.moveTo(screenX, 0);
      ctx.lineTo(screenX, containerHeight);
    }

    for (let worldY = majorStartY; worldY <= endY; worldY += majorGridSize) {
      const screenY = Math.round(worldY * viewport.zoom + viewport.pan.y) + 0.5;
      ctx.moveTo(0, screenY);
      ctx.lineTo(containerWidth, screenY);
    }
    ctx.stroke();
  }, [viewport.zoom, viewport.pan.x, viewport.pan.y, config]);

  // رسم الشبكة كنقاط
  const drawDots = useCallback((
    ctx: CanvasRenderingContext2D,
    startX: number, startY: number,
    endX: number, endY: number,
    gridSize: number, majorEvery: number
  ) => {
    const dotSize = 1.5 * viewport.zoom;
    const majorDotSize = 2.5 * viewport.zoom;

    for (let worldX = startX; worldX <= endX; worldX += gridSize) {
      for (let worldY = startY; worldY <= endY; worldY += gridSize) {
        const screenX = worldX * viewport.zoom + viewport.pan.x;
        const screenY = worldY * viewport.zoom + viewport.pan.y;
        
        const isMajor = Math.abs(worldX % (gridSize * majorEvery)) < 0.01 && 
                        Math.abs(worldY % (gridSize * majorEvery)) < 0.01;
        
        ctx.beginPath();
        ctx.fillStyle = isMajor 
          ? (config?.majorLineColor || 'rgba(11, 15, 18, 0.25)')
          : (config?.minorLineColor || 'rgba(11, 15, 18, 0.12)');
        ctx.arc(screenX, screenY, isMajor ? majorDotSize : dotSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [viewport.zoom, viewport.pan.x, viewport.pan.y, config]);

  // رسم شبكة إيزومتريك
  const drawIsometric = useCallback((
    ctx: CanvasRenderingContext2D,
    startX: number, startY: number,
    endX: number, endY: number,
    gridSize: number,
    containerWidth: number, containerHeight: number
  ) => {
    ctx.beginPath();
    ctx.strokeStyle = config?.minorLineColor || 'rgba(11, 15, 18, 0.08)';
    ctx.lineWidth = 1;

    const isoAngle = Math.PI / 6; // 30 degrees
    const stepX = gridSize * Math.cos(isoAngle);
    const stepY = gridSize * Math.sin(isoAngle);

    // خطوط مائلة للأسفل يميناً
    for (let worldX = startX - (endY - startY); worldX <= endX; worldX += gridSize) {
      const screenStartX = worldX * viewport.zoom + viewport.pan.x;
      const screenStartY = startY * viewport.zoom + viewport.pan.y;
      const length = containerHeight / Math.sin(isoAngle);
      ctx.moveTo(screenStartX, screenStartY);
      ctx.lineTo(screenStartX + length * Math.cos(isoAngle), screenStartY + length * Math.sin(isoAngle));
    }

    // خطوط مائلة للأسفل يساراً
    for (let worldX = startX; worldX <= endX + (endY - startY); worldX += gridSize) {
      const screenStartX = worldX * viewport.zoom + viewport.pan.x;
      const screenStartY = startY * viewport.zoom + viewport.pan.y;
      const length = containerHeight / Math.sin(isoAngle);
      ctx.moveTo(screenStartX, screenStartY);
      ctx.lineTo(screenStartX - length * Math.cos(isoAngle), screenStartY + length * Math.sin(isoAngle));
    }

    ctx.stroke();
  }, [viewport.zoom, viewport.pan.x, viewport.pan.y, config]);

  // رسم شبكة سداسية
  const drawHex = useCallback((
    ctx: CanvasRenderingContext2D,
    startX: number, startY: number,
    endX: number, endY: number,
    gridSize: number
  ) => {
    ctx.strokeStyle = config?.minorLineColor || 'rgba(11, 15, 18, 0.08)';
    ctx.lineWidth = 1;

    const hexWidth = gridSize * 2;
    const hexHeight = gridSize * Math.sqrt(3);
    const horizontalSpacing = hexWidth * 0.75;
    const verticalSpacing = hexHeight;

    let col = 0;
    for (let worldX = startX; worldX <= endX + hexWidth; worldX += horizontalSpacing) {
      const offsetY = (col % 2 === 0) ? 0 : hexHeight / 2;
      for (let worldY = startY - hexHeight; worldY <= endY + hexHeight; worldY += verticalSpacing) {
        const screenX = worldX * viewport.zoom + viewport.pan.x;
        const screenY = (worldY + offsetY) * viewport.zoom + viewport.pan.y;
        
        drawHexagon(ctx, screenX, screenY, gridSize * viewport.zoom);
      }
      col++;
    }
  }, [viewport.zoom, viewport.pan.x, viewport.pan.y, config]);

  // دالة مساعدة لرسم سداسي
  const drawHexagon = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const px = x + size * Math.cos(angle);
      const py = y + size * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
  };

  // دالة الرسم الرئيسية
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const dpr = canvasKernel.dpr;

    // تحديث حجم الكانفاس
    const needsResize = 
      canvas.width !== containerWidth * dpr ||
      canvas.height !== containerHeight * dpr;

    if (needsResize) {
      canvas.width = containerWidth * dpr;
      canvas.height = containerHeight * dpr;
      canvas.style.width = `${containerWidth}px`;
      canvas.style.height = `${containerHeight}px`;
      gridRenderer.invalidateCache();
    }

    if (!settings.gridEnabled) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    // حساب المنطقة المرئية
    const visibleStartX = -viewport.pan.x / viewport.zoom;
    const visibleStartY = -viewport.pan.y / viewport.zoom;
    const visibleEndX = visibleStartX + containerWidth / viewport.zoom;
    const visibleEndY = visibleStartY + containerHeight / viewport.zoom;

    const gridSize = settings.gridSize;
    const padding = gridSize * 2;
    const majorEvery = 5;

    const startX = Math.floor((visibleStartX - padding) / gridSize) * gridSize;
    const startY = Math.floor((visibleStartY - padding) / gridSize) * gridSize;
    const endX = Math.ceil((visibleEndX + padding) / gridSize) * gridSize;
    const endY = Math.ceil((visibleEndY + padding) / gridSize) * gridSize;

    // مسح الكانفاس
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);

    // رسم حسب النمط المحدد
    const gridType = settings.gridType || 'grid';
    
    switch (gridType) {
      case 'dots':
        drawDots(ctx, startX, startY, endX, endY, gridSize, majorEvery);
        break;
      case 'isometric':
        drawIsometric(ctx, startX, startY, endX, endY, gridSize, containerWidth, containerHeight);
        break;
      case 'hex':
        drawHex(ctx, startX, startY, endX, endY, gridSize);
        break;
      case 'grid':
      default:
        drawLines(ctx, startX, startY, endX, endY, gridSize, majorEvery, containerWidth, containerHeight);
        break;
    }

    ctx.restore();
  }, [settings.gridEnabled, settings.gridSize, settings.gridType, viewport.zoom, viewport.pan.x, viewport.pan.y, drawLines, drawDots, drawIsometric, drawHex]);

  // إعادة الرسم عند التغييرات
  useEffect(() => {
    const scheduleRender = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(render);
    };

    scheduleRender();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [render]);

  // إعادة الرسم عند تغيير حجم النافذة
  useEffect(() => {
    const handleResize = () => {
      gridRenderer.invalidateCache();
      render();
    };

    window.addEventListener('resize', handleResize);
    
    const mediaQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    const handleDPRChange = () => {
      canvasKernel.updateDPR();
      gridRenderer.invalidateCache();
      render();
    };
    mediaQuery.addEventListener('change', handleDPRChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', handleDPRChange);
    };
  }, [render]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
};

export default CanvasGridLayer;
