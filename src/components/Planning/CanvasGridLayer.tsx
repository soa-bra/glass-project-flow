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
  
  const { viewport, settings } = useCanvasStore();

  // دالة الرسم
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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

    // التحقق إذا كان يجب إعادة الرسم
    const shouldRender = gridRenderer.shouldRerender(
      viewport,
      containerWidth,
      containerHeight,
      settings.gridEnabled
    );

    if (shouldRender || needsResize) {
      gridRenderer.render(
        ctx,
        viewport,
        containerWidth,
        containerHeight,
        {
          ...config,
          gridSize: settings.gridSize,
          enabled: settings.gridEnabled
        }
      );
    }
  }, [viewport, settings.gridEnabled, settings.gridSize, config]);

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
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0"
        style={{ 
          imageRendering: 'pixelated',
          // منع أي تحويلات CSS على الكانفاس نفسه
          transform: 'none'
        }}
      />
    </div>
  );
};

export default CanvasGridLayer;
