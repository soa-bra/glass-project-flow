import { useEffect, useRef, useCallback } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { eventPipeline } from '@/engine/canvas/events/eventPipeline';
import { getContainerRect } from '@/engine/canvas/kernel/canvasKernel';

interface Props {
  containerRef: React.RefObject<HTMLDivElement>;
  active: boolean;
}

export default function PenInputLayer({ containerRef, active }: Props) {
  const { 
    viewport, 
    beginStroke, 
    appendPoint, 
    endStroke, 
    clearPendingStroke,
    eraseStrokeAtPoint,
    toolSettings 
  } = useCanvasStore();
  const drawingRef = useRef(false);
  const eraserMode = toolSettings.pen.eraserMode;
  
  // ✅ استخدام Event Pipeline للتحويل
  const toCanvas = useCallback((clientX: number, clientY: number) => {
    const rect = getContainerRect(containerRef);
    return eventPipeline.screenToWorld(clientX, clientY, rect, viewport);
  }, [viewport, containerRef]);
  
  useEffect(() => {
    if (!active) return;
    
    const handlePointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      
      // تجاهل إذا كان على عنصر canvas أو bounding box
      const target = e.target as HTMLElement;
      if (target.closest('[data-canvas-element="true"]') || 
          target.closest('.bounding-box')) {
        return;
      }
      
      const { x, y } = toCanvas(e.clientX, e.clientY);
      
      if (eraserMode) {
        // وضع الممحاة - محاولة مسح الخط
        eraseStrokeAtPoint(x, y, 15);
      } else {
        // وضع القلم - بدء رسم خط جديد
        beginStroke(x, y, e.pressure);
      }
      
      drawingRef.current = true;
      e.preventDefault();
    };
    
    const handlePointerMove = (e: PointerEvent) => {
      if (!drawingRef.current) return;
      const { x, y } = toCanvas(e.clientX, e.clientY);
      
      if (eraserMode) {
        // وضع الممحاة - استمرار المسح أثناء السحب
        eraseStrokeAtPoint(x, y, 15);
      } else {
        // وضع القلم - إضافة نقطة للخط
        appendPoint(x, y, e.pressure);
      }
      
      e.preventDefault();
    };
    
    const handlePointerUp = (e: PointerEvent) => {
      if (!drawingRef.current) return;
      
      if (!eraserMode) {
        // وضع القلم فقط - إنهاء الخط
        endStroke();
      }
      
      drawingRef.current = false;
    };
    
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [active, toCanvas, beginStroke, appendPoint, endStroke, eraserMode, eraseStrokeAtPoint]);
  
  // تنظيف عند تعطيل الأداة
  useEffect(() => {
    if (!active && drawingRef.current) {
      clearPendingStroke();
      drawingRef.current = false;
    }
  }, [active, clearPendingStroke]);
  
  return null; // طبقة غير مرئية
}
