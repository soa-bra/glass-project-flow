/**
 * Touch Gestures Hook - إدارة إيماءات اللمس المتعددة
 * 
 * يدعم:
 * - Pinch to Zoom (تكبير/تصغير بإصبعين)
 * - Two-finger Pan (تحريك بإصبعين)
 * - Single finger drag (سحب بإصبع واحد)
 * - Long press للقائمة السياقية
 */

import { useRef, useCallback, useEffect } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { useInteractionStore } from '@/stores/interactionStore';
import { canvasKernel } from '@/core/canvasKernel';

interface TouchPoint {
  x: number;
  y: number;
  id: number;
}

interface GestureState {
  initialTouches: TouchPoint[];
  initialDistance: number;
  initialZoom: number;
  initialPan: { x: number; y: number };
  centerPoint: { x: number; y: number };
  isPinching: boolean;
  isTwoFingerPan: boolean;
  longPressTimer: ReturnType<typeof setTimeout> | null;
}

interface UseTouchGesturesOptions {
  containerRef: React.RefObject<HTMLElement>;
  onLongPress?: (point: { x: number; y: number }) => void;
  longPressDelay?: number;
  minPinchDistance?: number;
}

export function useTouchGestures({
  containerRef,
  onLongPress,
  longPressDelay = 500,
  minPinchDistance = 10
}: UseTouchGesturesOptions) {
  const { viewport, setZoom, setPan } = useCanvasStore();
  const { startPanning, resetToIdle, isMode } = useInteractionStore();
  
  const gestureState = useRef<GestureState>({
    initialTouches: [],
    initialDistance: 0,
    initialZoom: 1,
    initialPan: { x: 0, y: 0 },
    centerPoint: { x: 0, y: 0 },
    isPinching: false,
    isTwoFingerPan: false,
    longPressTimer: null
  });
  
  // حساب المسافة بين نقطتين
  const getDistance = useCallback((p1: TouchPoint, p2: TouchPoint): number => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);
  
  // حساب نقطة المركز
  const getCenter = useCallback((p1: TouchPoint, p2: TouchPoint): { x: number; y: number } => {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2
    };
  }, []);
  
  // تحويل Touch إلى TouchPoint
  const touchToPoint = useCallback((touch: Touch): TouchPoint => ({
    x: touch.clientX,
    y: touch.clientY,
    id: touch.identifier
  }), []);
  
  // إلغاء Long Press
  const cancelLongPress = useCallback(() => {
    if (gestureState.current.longPressTimer) {
      clearTimeout(gestureState.current.longPressTimer);
      gestureState.current.longPressTimer = null;
    }
  }, []);
  
  // ============= معالجات الأحداث =============
  
  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touches = Array.from(e.touches).map(touchToPoint);
    const state = gestureState.current;
    
    cancelLongPress();
    
    if (touches.length === 1) {
      // لمسة واحدة - بدء Long Press timer
      const touch = touches[0];
      
      state.longPressTimer = setTimeout(() => {
        onLongPress?.({ x: touch.x, y: touch.y });
      }, longPressDelay);
      
      state.initialTouches = touches;
      
    } else if (touches.length === 2) {
      // لمستين - بدء Pinch/Pan
      e.preventDefault();
      
      state.initialTouches = touches;
      state.initialDistance = getDistance(touches[0], touches[1]);
      state.initialZoom = viewport.zoom;
      state.initialPan = { ...viewport.pan };
      state.centerPoint = getCenter(touches[0], touches[1]);
      state.isPinching = true;
      state.isTwoFingerPan = true;
    }
  }, [touchToPoint, getDistance, getCenter, viewport, cancelLongPress, onLongPress, longPressDelay]);
  
  const handleTouchMove = useCallback((e: TouchEvent) => {
    const touches = Array.from(e.touches).map(touchToPoint);
    const state = gestureState.current;
    
    cancelLongPress();
    
    if (touches.length === 2 && state.isPinching) {
      e.preventDefault();
      
      const currentDistance = getDistance(touches[0], touches[1]);
      const currentCenter = getCenter(touches[0], touches[1]);
      
      // حساب الـ Zoom الجديد
      const distanceChange = currentDistance / state.initialDistance;
      let newZoom = state.initialZoom * distanceChange;
      
      // حدود الـ Zoom
      newZoom = Math.max(0.1, Math.min(5, newZoom));
      
      // حساب الـ Pan للحفاظ على نقطة المركز
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        
        // الموقع في العالم عند بداية الإيماءة
        const initialCamera = { zoom: state.initialZoom, pan: state.initialPan };
        const worldAtStart = canvasKernel.screenToWorld(
          state.centerPoint.x - rect.left,
          state.centerPoint.y - rect.top,
          initialCamera
        );
        
        // حساب الـ Pan الجديد للحفاظ على نفس الموقع
        const newPanX = (currentCenter.x - rect.left) - worldAtStart.x * newZoom;
        const newPanY = (currentCenter.y - rect.top) - worldAtStart.y * newZoom;
        
        // إضافة تأثير الـ Pan من حركة الإصبعين
        const panDeltaX = currentCenter.x - state.centerPoint.x;
        const panDeltaY = currentCenter.y - state.centerPoint.y;
        
        setZoom(newZoom);
        setPan(newPanX + panDeltaX, newPanY + panDeltaY);
      }
      
      // تحديث المركز للإطار التالي
      state.centerPoint = currentCenter;
      state.initialDistance = currentDistance;
      state.initialZoom = newZoom;
    }
  }, [touchToPoint, getDistance, getCenter, containerRef, setZoom, setPan, cancelLongPress]);
  
  const handleTouchEnd = useCallback((e: TouchEvent) => {
    const state = gestureState.current;
    
    cancelLongPress();
    
    if (e.touches.length < 2) {
      state.isPinching = false;
      state.isTwoFingerPan = false;
    }
    
    if (e.touches.length === 0) {
      state.initialTouches = [];
      resetToIdle();
    }
  }, [cancelLongPress, resetToIdle]);
  
  // ============= تسجيل المستمعين =============
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // تعطيل السلوك الافتراضي للمس
    container.style.touchAction = 'none';
    
    const options: AddEventListenerOptions = { passive: false };
    
    container.addEventListener('touchstart', handleTouchStart, options);
    container.addEventListener('touchmove', handleTouchMove, options);
    container.addEventListener('touchend', handleTouchEnd, options);
    container.addEventListener('touchcancel', handleTouchEnd, options);
    
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
      cancelLongPress();
    };
  }, [containerRef, handleTouchStart, handleTouchMove, handleTouchEnd, cancelLongPress]);
  
  return {
    isPinching: gestureState.current.isPinching,
    isTwoFingerPan: gestureState.current.isTwoFingerPan,
    cancelLongPress
  };
}

export default useTouchGestures;
