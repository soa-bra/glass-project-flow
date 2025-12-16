import { useCallback, useRef } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';

interface UseCanvasCameraOptions {
  minZoom?: number;
  maxZoom?: number;
  zoomStep?: number;
}

/**
 * هوك لإدارة كاميرا الكانفاس (التكبير والتصغير والتحريك)
 */
export function useCanvasCamera(options: UseCanvasCameraOptions = {}) {
  const { minZoom = 0.1, maxZoom = 5, zoomStep = 0.1 } = options;
  
  const viewport = useCanvasStore(state => state.viewport);
  const setZoom = useCanvasStore(state => state.setZoom);
  const setPan = useCanvasStore(state => state.setPan);
  
  const { zoom, pan } = viewport;
  const isPanningRef = useRef(false);
  const lastPanPositionRef = useRef({ x: 0, y: 0 });

  // تكبير
  const zoomIn = useCallback(() => {
    const newZoom = Math.min(zoom + zoomStep, maxZoom);
    setZoom(newZoom);
  }, [zoom, zoomStep, maxZoom, setZoom]);

  // تصغير
  const zoomOut = useCallback(() => {
    const newZoom = Math.max(zoom - zoomStep, minZoom);
    setZoom(newZoom);
  }, [zoom, zoomStep, minZoom, setZoom]);

  // تكبير إلى نقطة معينة
  const zoomToPoint = useCallback((
    targetZoom: number, 
    point: { x: number; y: number }
  ) => {
    const clampedZoom = Math.max(minZoom, Math.min(maxZoom, targetZoom));
    const zoomRatio = clampedZoom / zoom;
    
    const newPanX = point.x - (point.x - pan.x) * zoomRatio;
    const newPanY = point.y - (point.y - pan.y) * zoomRatio;
    
    setZoom(clampedZoom);
    setPan(newPanX, newPanY);
  }, [zoom, pan, minZoom, maxZoom, setZoom, setPan]);

  // إعادة ضبط الكاميرا
  const resetCamera = useCallback(() => {
    setZoom(1);
    setPan(0, 0);
  }, [setZoom, setPan]);

  // بدء التحريك
  const startPanning = useCallback((clientX: number, clientY: number) => {
    isPanningRef.current = true;
    lastPanPositionRef.current = { x: clientX, y: clientY };
  }, []);

  // تحديث التحريك
  const updatePanning = useCallback((clientX: number, clientY: number) => {
    if (!isPanningRef.current) return;
    
    const deltaX = clientX - lastPanPositionRef.current.x;
    const deltaY = clientY - lastPanPositionRef.current.y;
    
    setPan(pan.x + deltaX, pan.y + deltaY);
    
    lastPanPositionRef.current = { x: clientX, y: clientY };
  }, [pan, setPan]);

  // إنهاء التحريك
  const stopPanning = useCallback(() => {
    isPanningRef.current = false;
  }, []);

  // التكبير بعجلة الماوس
  const handleWheelZoom = useCallback((
    event: WheelEvent | React.WheelEvent,
    containerRect?: DOMRect
  ) => {
    event.preventDefault();
    
    const rect = containerRect || (event.currentTarget as HTMLElement)?.getBoundingClientRect();
    if (!rect) return;
    
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    const zoomDelta = event.deltaY > 0 ? -zoomStep : zoomStep;
    const newZoom = Math.max(minZoom, Math.min(maxZoom, zoom + zoomDelta));
    
    zoomToPoint(newZoom, { x: mouseX, y: mouseY });
  }, [zoom, zoomStep, minZoom, maxZoom, zoomToPoint]);

  return {
    // الحالة
    zoom,
    pan,
    isPanning: isPanningRef.current,
    
    // التكبير/التصغير
    zoomIn,
    zoomOut,
    zoomToPoint,
    resetCamera,
    handleWheelZoom,
    
    // التحريك
    startPanning,
    updatePanning,
    stopPanning
  };
}

export default useCanvasCamera;
