/**
 * Canvas Grid Layer - طبقة الشبكة اللانهائية
 * 
 * ترسم شبكة لانهائية مثبتة في World Space باستخدام Canvas API
 * مع دعم DevicePixelRatio للحصول على رسم حاد
 */

import React, { useRef, useEffect, useCallback } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { canvasKernel } from '@/core/canvasKernel';
import { gridRenderer, type GridConfig, DEFAULT_GRID_CONFIG } from '@/core/gridRenderer';

interface CanvasGridLayerProps {
  /** إعدادات الشبكة (اختياري) */
  config?: Partial<GridConfig>;
}

export const CanvasGridLayer: React.FC<CanvasGridLayerProps> = ({ config }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);
  
  const { settings } = useCanvasStore();

  // دالة الرسم - في World Space مباشرة
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // حجم منطقة الشبكة الثابت (World Space)
    const gridWidth = 10000;
    const gridHeight = 10000;
    const dpr = canvasKernel.dpr;

    // تحديث حجم الكانفاس مع DPR
    const needsResize = 
      canvas.width !== gridWidth * dpr ||
      canvas.height !== gridHeight * dpr;

    if (needsResize) {
      canvas.width = gridWidth * dpr;
      canvas.height = gridHeight * dpr;
      canvas.style.width = `${gridWidth}px`;
      canvas.style.height = `${gridHeight}px`;
      gridRenderer.invalidateCache();
    }

    // الإزاحة لتحويل World Space إلى Canvas Space
    const gridOffset = 5000;
    
    // رسم الشبكة مباشرة بنطاق محدد في World Space
    // من -5000 إلى 5000 يغطي كامل منطقة الكانفاس
    gridRenderer.renderDirect(
      ctx,
      {
        startX: -gridOffset,  // -5000 في World Space
        startY: -gridOffset,  // -5000 في World Space
        endX: gridOffset,     // 5000 في World Space
        endY: gridOffset      // 5000 في World Space
      },
      gridWidth,
      gridHeight,
      {
        ...config,
        gridSize: settings.gridSize,
        enabled: settings.gridEnabled,
        offset: { x: gridOffset, y: gridOffset }
      }
    );
  }, [settings.gridEnabled, settings.gridSize, config]);

  // استخدام requestAnimationFrame للرسم السلس
  useEffect(() => {
    const scheduleRender = () => {
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
    
    // تحديث DPR عند تغييره (مثلاً عند نقل النافذة بين شاشات)
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
      className="absolute pointer-events-none overflow-visible"
      style={{ 
        zIndex: 0,
        // توسيع منطقة الشبكة لتغطية المساحة المرئية عند الـ pan
        left: '-5000px',
        top: '-5000px',
        width: '10000px',
        height: '10000px'
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0"
        style={{ 
          imageRendering: 'pixelated'
        }}
      />
    </div>
  );
};

export default CanvasGridLayer;
