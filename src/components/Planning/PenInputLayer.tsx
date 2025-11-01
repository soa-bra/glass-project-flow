// طبقة إدخال القلم - التقاط أحداث الرسم

import React, { useRef, useEffect, useCallback } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';

interface PenInputLayerProps {
  active: boolean;
  viewport: {
    zoom: number;
    pan: { x: number; y: number };
  };
}

const PenInputLayer: React.FC<PenInputLayerProps> = ({ active, viewport }) => {
  const {
    beginStroke,
    appendPoint,
    endStroke,
    clearPendingStroke,
    pen
  } = useCanvasStore();
  
  const overlayRef = useRef<HTMLDivElement>(null);
  const drawingRef = useRef(false);
  const shiftKeyRef = useRef(false);
  const altKeyRef = useRef(false);
  const firstPointRef = useRef<{ x: number; y: number } | null>(null);
  
  // تحويل إحداثيات الشاشة إلى إحداثيات الكانفاس
  const toCanvas = useCallback((clientX: number, clientY: number) => {
    if (!overlayRef.current) return { x: 0, y: 0 };
    
    const rect = overlayRef.current.getBoundingClientRect();
    
    // حساب الموقع النسبي داخل الـ overlay
    const relativeX = clientX - rect.left;
    const relativeY = clientY - rect.top;
    
    // تطبيق التحويل العكسي: إزالة pan أولاً ثم القسمة على zoom
    return {
      x: (relativeX - viewport.pan.x) / viewport.zoom,
      y: (relativeY - viewport.pan.y) / viewport.zoom
    };
  }, [viewport]);
  
  // بدء الرسم
  const handlePointerDown = useCallback((e: PointerEvent) => {
    // تجاهل النقرات على عناصر الواجهة
    const target = e.target as HTMLElement;
    if (
      !active || 
      e.button !== 0 ||
      target.tagName === 'BUTTON' ||
      target.tagName === 'INPUT' ||
      target.tagName === 'SELECT' ||
      target.closest('button') ||
      target.closest('[role="button"]') ||
      target.closest('nav') ||
      target.closest('aside')
    ) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const overlay = overlayRef.current;
    if (!overlay) return;
    
    overlay.setPointerCapture(e.pointerId);
    
    const canvasPoint = toCanvas(e.clientX, e.clientY);
    firstPointRef.current = canvasPoint;
    
    beginStroke({
      ...canvasPoint,
      t: performance.now()
    });
    
    drawingRef.current = true;
  }, [active, toCanvas, beginStroke]);
  
  // تحديث الرسم
  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!drawingRef.current) return;
    
    e.preventDefault();
    
    let canvasPoint = toCanvas(e.clientX, e.clientY);
    
    // إذا كان Shift مضغوطاً، قفل الاتجاه
    if (shiftKeyRef.current && firstPointRef.current) {
      const dx = canvasPoint.x - firstPointRef.current.x;
      const dy = canvasPoint.y - firstPointRef.current.y;
      const angle = Math.atan2(dy, dx);
      
      // تقريب إلى أقرب زاوية 45 درجة
      const snapAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
      const distance = Math.hypot(dx, dy);
      
      canvasPoint = {
        x: firstPointRef.current.x + Math.cos(snapAngle) * distance,
        y: firstPointRef.current.y + Math.sin(snapAngle) * distance
      };
    }
    
    appendPoint({
      ...canvasPoint,
      t: performance.now()
    });
  }, [toCanvas, appendPoint]);
  
  // إنهاء الرسم
  const handlePointerUp = useCallback((e: PointerEvent) => {
    if (!drawingRef.current) return;
    
    const overlay = overlayRef.current;
    if (overlay) {
      overlay.releasePointerCapture(e.pointerId);
    }
    
    drawingRef.current = false;
    firstPointRef.current = null;
    
    // استخدام Alt المؤقت أو الوضع الذكي الدائم
    const useSmartMode = altKeyRef.current || pen.smartMode;
    endStroke(useSmartMode);
  }, [endStroke, pen.smartMode]);
  
  // معالجة المفاتيح
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        shiftKeyRef.current = true;
      }
      if (e.key === 'Alt') {
        altKeyRef.current = true;
        e.preventDefault();
      }
      if (e.key === 'Escape') {
        if (drawingRef.current) {
          clearPendingStroke();
          drawingRef.current = false;
          firstPointRef.current = null;
        }
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        shiftKeyRef.current = false;
      }
      if (e.key === 'Alt') {
        altKeyRef.current = false;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [clearPendingStroke]);
  
  // تثبيت معالجات الأحداث
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay || !active) return;
    
    overlay.addEventListener('pointerdown', handlePointerDown);
    overlay.addEventListener('pointermove', handlePointerMove);
    overlay.addEventListener('pointerup', handlePointerUp);
    overlay.addEventListener('pointercancel', handlePointerUp);
    
    return () => {
      overlay.removeEventListener('pointerdown', handlePointerDown);
      overlay.removeEventListener('pointermove', handlePointerMove);
      overlay.removeEventListener('pointerup', handlePointerUp);
      overlay.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [active, handlePointerDown, handlePointerMove, handlePointerUp]);
  
  // تنظيف الحالة عند تعطيل الأداة
  useEffect(() => {
    if (!active && drawingRef.current) {
      drawingRef.current = false;
      firstPointRef.current = null;
      clearPendingStroke();
    }
  }, [active, clearPendingStroke]);
  
  if (!active) return null;
  
  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 touch-none"
      style={{
        zIndex: 100,
        cursor: 'crosshair',
        pointerEvents: 'auto'
      }}
    />
  );
};

export default PenInputLayer;
