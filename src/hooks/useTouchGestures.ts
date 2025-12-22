/**
 * Touch Gestures Hook - إدارة إيماءات اللمس المتعددة
 * ✅ المرحلة 4: دعم Touch محسّن
 * 
 * يدعم:
 * - Tap to Select (نقرة واحدة للتحديد)
 * - Double Tap (نقرتين للتحرير)
 * - Long Press (ضغط طويل للقائمة السياقية)
 * - Two-finger Tap (نقرة بإصبعين للإضافة للتحديد)
 * - Pinch to Zoom (تكبير/تصغير بإصبعين)
 * - Two-finger Pan (تحريك بإصبعين)
 */

import { useRef, useCallback, useEffect } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { useInteractionStore } from '@/stores/interactionStore';
import { canvasKernel } from '@/core/canvasKernel';
import { findElementAtPoint } from '@/core/spatialIndex';
import { selectLayerVisibilityMap } from '@/features/planning/state/selectors';

interface TouchPoint {
  x: number;
  y: number;
  id: number;
  timestamp: number;
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
  // ✅ إضافات للتحديد
  lastTapTime: number;
  lastTapPoint: { x: number; y: number } | null;
  tapCount: number;
  hasMoved: boolean;
  startPoint: { x: number; y: number } | null;
}

// ✅ ثوابت قابلة للتعديل
const TAP_TIMEOUT = 300; // الوقت الأقصى للنقرة (ms)
const DOUBLE_TAP_DELAY = 350; // الوقت الأقصى بين النقرتين (ms)
const LONG_PRESS_DELAY = 500; // مدة الضغط الطويل (ms)
const TAP_MOVE_THRESHOLD = 10; // الحد الأقصى للحركة خلال النقرة (px)
const TWO_FINGER_TAP_DELAY = 150; // وقت النقرة بإصبعين (ms)

interface UseTouchGesturesOptions {
  containerRef: React.RefObject<HTMLElement>;
  onLongPress?: (point: { x: number; y: number }, elementId?: string) => void;
  onDoubleTap?: (point: { x: number; y: number }, elementId?: string) => void;
  onTap?: (point: { x: number; y: number }, elementId?: string) => void;
  onTwoFingerTap?: (point: { x: number; y: number }) => void;
  longPressDelay?: number;
  minPinchDistance?: number;
}

export function useTouchGestures({
  containerRef,
  onLongPress,
  onDoubleTap,
  onTap,
  onTwoFingerTap,
  longPressDelay = LONG_PRESS_DELAY,
  minPinchDistance = 10
}: UseTouchGesturesOptions) {
  const { viewport, setZoom, setPan, elements, layers, selectElement, clearSelection } = useCanvasStore();
  const { startPanning, resetToIdle, isMode } = useInteractionStore();
  
  const gestureState = useRef<GestureState>({
    initialTouches: [],
    initialDistance: 0,
    initialZoom: 1,
    initialPan: { x: 0, y: 0 },
    centerPoint: { x: 0, y: 0 },
    isPinching: false,
    isTwoFingerPan: false,
    longPressTimer: null,
    lastTapTime: 0,
    lastTapPoint: null,
    tapCount: 0,
    hasMoved: false,
    startPoint: null
  });
  
  // ✅ الحصول على Layer Visibility Map
  const getVisibilityMap = useCallback(() => {
    return selectLayerVisibilityMap({
      elements,
      layers,
      selectedElementIds: [],
      viewport,
      history: { past: [], future: [] },
      activeTool: 'select',
      activeLayerId: null
    });
  }, [elements, layers, viewport]);
  
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
    id: touch.identifier,
    timestamp: Date.now()
  }), []);
  
  // إلغاء Long Press
  const cancelLongPress = useCallback(() => {
    if (gestureState.current.longPressTimer) {
      clearTimeout(gestureState.current.longPressTimer);
      gestureState.current.longPressTimer = null;
    }
  }, []);
  
  // ✅ البحث عن العنصر في نقطة محددة
  const findElementAt = useCallback((screenX: number, screenY: number): string | undefined => {
    const container = containerRef.current;
    if (!container) return undefined;
    
    const rect = container.getBoundingClientRect();
    const worldPoint = canvasKernel.screenToWorld(
      screenX - rect.left,
      screenY - rect.top,
      viewport
    );
    
    const visibilityMap = getVisibilityMap();
    const element = findElementAtPoint(worldPoint.x, worldPoint.y, elements, visibilityMap);
    
    return element?.id;
  }, [containerRef, viewport, elements, getVisibilityMap]);
  
  // ✅ معالجة النقرة الواحدة (Tap to Select)
  const handleTap = useCallback((point: { x: number; y: number }) => {
    const elementId = findElementAt(point.x, point.y);
    
    if (onTap) {
      onTap(point, elementId);
    } else {
      // السلوك الافتراضي: تحديد العنصر
      if (elementId) {
        selectElement(elementId, false);
      } else {
        clearSelection();
      }
    }
  }, [findElementAt, onTap, selectElement, clearSelection]);
  
  // ✅ معالجة النقرة المزدوجة (Double Tap for Edit)
  const handleDoubleTap = useCallback((point: { x: number; y: number }) => {
    const elementId = findElementAt(point.x, point.y);
    
    if (onDoubleTap) {
      onDoubleTap(point, elementId);
    } else if (elementId) {
      // السلوك الافتراضي: فتح التحرير
      // يمكن إضافة منطق لفتح TextEditor أو تحرير العنصر
      selectElement(elementId, false);
      // إرسال حدث مخصص لبدء التحرير
      const event = new CustomEvent('element-edit-request', { 
        detail: { elementId, point } 
      });
      window.dispatchEvent(event);
    }
  }, [findElementAt, onDoubleTap, selectElement]);
  
  // ✅ معالجة الضغط الطويل (Long Press for Context Menu)
  const handleLongPressAction = useCallback((point: { x: number; y: number }) => {
    const elementId = findElementAt(point.x, point.y);
    
    // اهتزاز خفيف للتغذية الراجعة (إذا كان مدعوماً)
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    if (onLongPress) {
      onLongPress(point, elementId);
    } else if (elementId) {
      // السلوك الافتراضي: تحديد وإظهار القائمة
      selectElement(elementId, false);
      // إرسال حدث لفتح القائمة السياقية
      const event = new CustomEvent('element-context-menu', { 
        detail: { elementId, point } 
      });
      window.dispatchEvent(event);
    }
  }, [findElementAt, onLongPress, selectElement]);
  
  // ✅ معالجة النقرة بإصبعين (Two-finger Tap for Multi-select)
  const handleTwoFingerTap = useCallback((center: { x: number; y: number }) => {
    const elementId = findElementAt(center.x, center.y);
    
    if (onTwoFingerTap) {
      onTwoFingerTap(center);
    } else if (elementId) {
      // السلوك الافتراضي: إضافة للتحديد (multi-select)
      selectElement(elementId, true); // true = multi-select
    }
  }, [findElementAt, onTwoFingerTap, selectElement]);
  
  // ============= معالجات الأحداث =============
  
  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touches = Array.from(e.touches).map(touchToPoint);
    const state = gestureState.current;
    
    cancelLongPress();
    state.hasMoved = false;
    
    if (touches.length === 1) {
      // لمسة واحدة
      const touch = touches[0];
      state.startPoint = { x: touch.x, y: touch.y };
      
      // بدء Long Press timer
      state.longPressTimer = setTimeout(() => {
        if (!state.hasMoved) {
          handleLongPressAction({ x: touch.x, y: touch.y });
        }
      }, longPressDelay);
      
      state.initialTouches = touches;
      
    } else if (touches.length === 2) {
      // لمستين - بدء Pinch/Pan أو Two-finger Tap
      e.preventDefault();
      
      const center = getCenter(touches[0], touches[1]);
      
      state.initialTouches = touches;
      state.initialDistance = getDistance(touches[0], touches[1]);
      state.initialZoom = viewport.zoom;
      state.initialPan = { ...viewport.pan };
      state.centerPoint = center;
      state.isPinching = true;
      state.isTwoFingerPan = true;
      
      // تعيين timer للكشف عن Two-finger Tap
      setTimeout(() => {
        // إذا لم تتحرك الأصابع، فهي نقرة بإصبعين
        if (!state.hasMoved && e.touches.length === 2) {
          handleTwoFingerTap(center);
        }
      }, TWO_FINGER_TAP_DELAY);
    }
  }, [touchToPoint, getDistance, getCenter, viewport, cancelLongPress, longPressDelay, handleLongPressAction, handleTwoFingerTap]);
  
  const handleTouchMove = useCallback((e: TouchEvent) => {
    const touches = Array.from(e.touches).map(touchToPoint);
    const state = gestureState.current;
    
    // التحقق من الحركة
    if (state.startPoint && touches.length === 1) {
      const dx = touches[0].x - state.startPoint.x;
      const dy = touches[0].y - state.startPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > TAP_MOVE_THRESHOLD) {
        state.hasMoved = true;
        cancelLongPress();
      }
    } else if (touches.length === 2) {
      state.hasMoved = true;
    }
    
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
    const now = Date.now();
    
    cancelLongPress();
    
    // ✅ معالجة النقرات (Tap / Double Tap)
    if (e.changedTouches.length === 1 && !state.hasMoved && !state.isPinching) {
      const touch = e.changedTouches[0];
      const point = { x: touch.clientX, y: touch.clientY };
      
      // التحقق من Double Tap
      if (
        state.lastTapPoint &&
        now - state.lastTapTime < DOUBLE_TAP_DELAY &&
        Math.abs(point.x - state.lastTapPoint.x) < TAP_MOVE_THRESHOLD &&
        Math.abs(point.y - state.lastTapPoint.y) < TAP_MOVE_THRESHOLD
      ) {
        // Double Tap!
        handleDoubleTap(point);
        state.lastTapTime = 0;
        state.lastTapPoint = null;
      } else {
        // تأخير للتحقق من عدم وجود Double Tap
        state.lastTapTime = now;
        state.lastTapPoint = point;
        
        // انتظار قليلاً قبل تنفيذ Tap
        setTimeout(() => {
          if (state.lastTapTime === now) {
            // لم يحدث Double Tap، نفذ Single Tap
            handleTap(point);
          }
        }, DOUBLE_TAP_DELAY);
      }
    }
    
    if (e.touches.length < 2) {
      state.isPinching = false;
      state.isTwoFingerPan = false;
    }
    
    if (e.touches.length === 0) {
      state.initialTouches = [];
      state.startPoint = null;
      resetToIdle();
    }
  }, [cancelLongPress, resetToIdle, handleTap, handleDoubleTap]);
  
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
