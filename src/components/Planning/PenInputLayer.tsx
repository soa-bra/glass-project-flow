import { useEffect, useRef, useCallback } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';

interface Props {
  containerRef: React.RefObject<HTMLDivElement>;
  active: boolean;
}

export default function PenInputLayer({ containerRef, active }: Props) {
  const { viewport, beginStroke, appendPoint, endStroke, clearPendingStroke } = useCanvasStore();
  const drawingRef = useRef(false);
  
  const toCanvas = useCallback((clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    
    const x = (clientX - rect.left - viewport.pan.x) / viewport.zoom;
    const y = (clientY - rect.top - viewport.pan.y) / viewport.zoom;
    return { x, y };
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
      beginStroke(x, y, e.pressure);
      drawingRef.current = true;
      e.preventDefault();
    };
    
    const handlePointerMove = (e: PointerEvent) => {
      if (!drawingRef.current) return;
      const { x, y } = toCanvas(e.clientX, e.clientY);
      appendPoint(x, y, e.pressure);
      e.preventDefault();
    };
    
    const handlePointerUp = (e: PointerEvent) => {
      if (!drawingRef.current) return;
      endStroke();
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
  }, [active, toCanvas, beginStroke, appendPoint, endStroke]);
  
  // تنظيف عند تعطيل الأداة
  useEffect(() => {
    if (!active && drawingRef.current) {
      clearPendingStroke();
      drawingRef.current = false;
    }
  }, [active, clearPendingStroke]);
  
  return null; // طبقة غير مرئية
}
