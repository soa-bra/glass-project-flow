import { useEffect, useRef, useCallback } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { toast } from 'sonner';
import { eventPipeline } from '@/core/eventPipeline';
import { getContainerRect } from '@/core/canvasKernel';

interface Props {
  containerRef: React.RefObject<HTMLDivElement>;
  active: boolean;
}

export default function FrameInputLayer({ containerRef, active }: Props) {
  const { 
    viewport, 
    toolSettings, 
    addElement, 
    assignElementsToFrame,
    setIsDrawing,
    setDrawStartPoint,
    setTempElement 
  } = useCanvasStore();
  
  const drawingRef = useRef(false);
  const startPointRef = useRef<{ x: number; y: number } | null>(null);
  const keysRef = useRef({ shift: false, alt: false });
  
  // ✅ استخدام Event Pipeline للتحويل
  const toCanvas = useCallback((clientX: number, clientY: number) => {
    const rect = getContainerRect(containerRef);
    return eventPipeline.screenToWorld(clientX, clientY, rect, viewport);
  }, [viewport, containerRef]);
  
  // حساب أبعاد الإطار مع دعم Shift/Alt
  const calculateFrameBounds = useCallback((
    startX: number,
    startY: number,
    currentX: number,
    currentY: number,
    shift: boolean,
    alt: boolean
  ) => {
    let dx = currentX - startX;
    let dy = currentY - startY;
    
    // Alt: رسم من المركز
    if (alt) {
      const width = Math.abs(dx) * 2;
      const height = shift ? width : Math.abs(dy) * 2;
      
      return {
        x: startX - width / 2,
        y: startY - height / 2,
        width,
        height
      };
    }
    
    // Shift: نسبة 1:1
    if (shift) {
      const side = Math.max(Math.abs(dx), Math.abs(dy));
      return {
        x: dx >= 0 ? startX : startX - side,
        y: dy >= 0 ? startY : startY - side,
        width: side,
        height: side
      };
    }
    
    // رسم عادي
    return {
      x: Math.min(startX, currentX),
      y: Math.min(startY, currentY),
      width: Math.abs(dx),
      height: Math.abs(dy)
    };
  }, []);
  
  useEffect(() => {
    if (!active) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // ✅ فحص typingMode أولاً - منع جميع الاختصارات أثناء الكتابة
      const typingMode = useCanvasStore.getState().typingMode;
      if (typingMode) {
        return; // لا تُنفّذ أي شيء أثناء الكتابة
      }
      
      if (e.key === 'Shift') keysRef.current.shift = true;
      if (e.key === 'Alt') keysRef.current.alt = true;
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') keysRef.current.shift = false;
      if (e.key === 'Alt') keysRef.current.alt = false;
    };
    
    const handlePointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      
      // تجاهل إذا كان على عنصر canvas أو bounding box
      const target = e.target as HTMLElement;
      if (target.closest('[data-canvas-element="true"]') || 
          target.closest('.bounding-box')) {
        return;
      }
      
      const point = toCanvas(e.clientX, e.clientY);
      startPointRef.current = point;
      drawingRef.current = true;
      
      setIsDrawing(true);
      setDrawStartPoint(point);
      
      const initialElement = {
        id: 'temp',
        type: 'frame' as const,
        position: point,
        size: { width: 0, height: 0 },
        title: toolSettings.frame.title || 'إطار جديد',
        style: {
          backgroundColor: 'transparent',
          border: `${toolSettings.frame.strokeWidth}px solid ${toolSettings.frame.strokeColor}`,
          borderRadius: '8px'
        },
        children: []
      };
      
      setTempElement(initialElement as any);
      e.preventDefault();
    };
    
    const handlePointerMove = (e: PointerEvent) => {
      if (!drawingRef.current || !startPointRef.current) return;
      
      const currentPoint = toCanvas(e.clientX, e.clientY);
      const bounds = calculateFrameBounds(
        startPointRef.current.x,
        startPointRef.current.y,
        currentPoint.x,
        currentPoint.y,
        keysRef.current.shift,
        keysRef.current.alt
      );
      
      const currentTemp = useCanvasStore.getState().tempElement;
      if (currentTemp) {
        setTempElement({
          ...currentTemp,
          position: { x: bounds.x, y: bounds.y },
          size: { width: bounds.width, height: bounds.height }
        });
      }
      
      e.preventDefault();
    };
    
    const handlePointerUp = () => {
      if (!drawingRef.current) return;
      
      const tempEl = useCanvasStore.getState().tempElement;
      if (tempEl && tempEl.size.width > 10 && tempEl.size.height > 10) {
        const finalElement = { ...tempEl };
        delete (finalElement as any).id;
        
        addElement(finalElement);
        
        // تجميع العناصر داخل الإطار تلقائياً (فوريًا بدون setTimeout)
        const elements = useCanvasStore.getState().elements;
        const newFrameId = elements
          .filter(el => el.type === 'frame')
          .sort((a, b) => {
            const aTime = (a as any).createdAt || 0;
            const bTime = (b as any).createdAt || 0;
            return bTime - aTime;
          })[0]?.id;
        
        if (newFrameId) {
          assignElementsToFrame(newFrameId);
          
          // قراءة العدد بعد التجميع الفوري
          const updatedElements = useCanvasStore.getState().elements;
          const frame = updatedElements.find(el => el.id === newFrameId) as any;
          const childrenCount = frame?.children?.length || 0;
          
          if (childrenCount > 0) {
            toast.success(`تم إنشاء الإطار وتجميع ${childrenCount} عنصر`);
          } else {
            toast.success('تم إنشاء الإطار');
          }
        }
      }
      
      drawingRef.current = false;
      startPointRef.current = null;
      setIsDrawing(false);
      setDrawStartPoint(null);
      setTempElement(null);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [active, toCanvas, calculateFrameBounds, toolSettings, addElement, assignElementsToFrame, setIsDrawing, setDrawStartPoint, setTempElement]);
  
  // تنظيف عند تعطيل الأداة
  useEffect(() => {
    if (!active && drawingRef.current) {
      setTempElement(null);
      setIsDrawing(false);
      setDrawStartPoint(null);
      drawingRef.current = false;
    }
  }, [active, setIsDrawing, setDrawStartPoint, setTempElement]);
  
  return null; // طبقة غير مرئية
}
