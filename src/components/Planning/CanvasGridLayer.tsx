/**
 * Canvas Grid Layer - طبقة الشبكة الديناميكية
 * 
 * ترسم شبكة ديناميكية بناءً على viewport الحالي
 * مع دعم DevicePixelRatio للحصول على رسم حاد
 */

import React, { useRef, useEffect, useCallback } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { canvasKernel } from '@/core/canvasKernel';
import { gridRenderer, type GridConfig } from '@/core/gridRenderer';

interface CanvasGridLayerProps {
  /** إعدادات الشبكة (اختياري) */
  config?: Partial<GridConfig>;
}

export const CanvasGridLayer: React.FC<CanvasGridLayerProps> = ({ config }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);
  
  const { settings, viewport } = useCanvasStore();

  // دالة الرسم الديناميكية بناءً على viewport
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // حجم الكانفاس يطابق حجم الحاوية
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const dpr = canvasKernel.dpr;

    // تحديث حجم الكانفاس مع DPR
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

    // حساب المنطقة المرئية في World Space بناءً على viewport
    const visibleStartX = -viewport.pan.x / viewport.zoom;
    const visibleStartY = -viewport.pan.y / viewport.zoom;
    const visibleEndX = visibleStartX + containerWidth / viewport.zoom;
    const visibleEndY = visibleStartY + containerHeight / viewport.zoom;

    // توسيع النطاق قليلاً لتجنب القطع عند الحواف
    const gridSize = settings.gridSize;
    const padding = gridSize * 2;

    // مسح الكانفاس
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // تطبيق DPR
    ctx.save();
    ctx.scale(dpr, dpr);

    // رسم الشبكة في Screen Space
    // نحول إحداثيات World Space إلى Screen Space
    const majorEvery = 5;
    
    // محاذاة مع حجم الشبكة
    const startX = Math.floor((visibleStartX - padding) / gridSize) * gridSize;
    const startY = Math.floor((visibleStartY - padding) / gridSize) * gridSize;
    const endX = Math.ceil((visibleEndX + padding) / gridSize) * gridSize;
    const endY = Math.ceil((visibleEndY + padding) / gridSize) * gridSize;

    // رسم الخطوط الثانوية
    ctx.beginPath();
    ctx.strokeStyle = config?.minorLineColor || 'rgba(11, 15, 18, 0.06)';
    ctx.lineWidth = config?.minorLineWidth || 1;

    for (let worldX = startX; worldX <= endX; worldX += gridSize) {
      // تخطي الخطوط الرئيسية
      if (Math.abs(worldX % (gridSize * majorEvery)) < 0.01) continue;
      
      // تحويل من World Space إلى Screen Space
      const screenX = Math.round(worldX * viewport.zoom + viewport.pan.x) + 0.5;
      ctx.moveTo(screenX, 0);
      ctx.lineTo(screenX, containerHeight);
    }

    for (let worldY = startY; worldY <= endY; worldY += gridSize) {
      // تخطي الخطوط الرئيسية
      if (Math.abs(worldY % (gridSize * majorEvery)) < 0.01) continue;
      
      // تحويل من World Space إلى Screen Space
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
    const majorStartX = Math.floor((visibleStartX - padding) / majorGridSize) * majorGridSize;
    const majorStartY = Math.floor((visibleStartY - padding) / majorGridSize) * majorGridSize;
    const majorEndX = Math.ceil((visibleEndX + padding) / majorGridSize) * majorGridSize;
    const majorEndY = Math.ceil((visibleEndY + padding) / majorGridSize) * majorGridSize;

    for (let worldX = majorStartX; worldX <= majorEndX; worldX += majorGridSize) {
      const screenX = Math.round(worldX * viewport.zoom + viewport.pan.x) + 0.5;
      ctx.moveTo(screenX, 0);
      ctx.lineTo(screenX, containerHeight);
    }

    for (let worldY = majorStartY; worldY <= majorEndY; worldY += majorGridSize) {
      const screenY = Math.round(worldY * viewport.zoom + viewport.pan.y) + 0.5;
      ctx.moveTo(0, screenY);
      ctx.lineTo(containerWidth, screenY);
    }
    ctx.stroke();

    ctx.restore();
  }, [settings.gridEnabled, settings.gridSize, viewport.zoom, viewport.pan.x, viewport.pan.y, config]);

  // إعادة الرسم عند تغيير viewport أو الإعدادات
  useEffect(() => {
    const scheduleRender = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(() => {
        render();
      });
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
    
    // تحديث DPR عند تغييره
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
