/**
 * useTextDrag - Hook لتحريك عناصر النص
 * Hook for dragging text elements on canvas
 * 
 * @module features/planning/elements/text/hooks/useTextDrag
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import type { CanvasElement } from '@/types/canvas';

interface DragState {
  /** هل يتم السحب حالياً - Is dragging active */
  isDragging: boolean;
  /** معرف العنصر المسحوب - ID of element being dragged */
  elementId: string | null;
  /** نقطة البداية - Start point */
  startPoint: { x: number; y: number } | null;
  /** الموضع الأصلي للعنصر - Original element position */
  originalPosition: { x: number; y: number } | null;
}

interface UseTextDragOptions {
  /** معامل التكبير - Zoom factor */
  zoom: number;
  /** إزاحة العرض - Pan offset */
  pan: { x: number; y: number };
  /** عند بدء السحب - On drag start */
  onDragStart?: (elementId: string) => void;
  /** عند انتهاء السحب - On drag end */
  onDragEnd?: (elementId: string, position: { x: number; y: number }) => void;
}

interface UseTextDragReturn {
  /** حالة السحب - Drag state */
  dragState: DragState;
  /** بدء السحب - Start dragging */
  startDrag: (elementId: string, clientX: number, clientY: number) => void;
  /** تحديث السحب - Update drag position */
  updateDrag: (clientX: number, clientY: number) => void;
  /** إنهاء السحب - End dragging */
  endDrag: () => void;
  /** إلغاء السحب - Cancel dragging */
  cancelDrag: () => void;
}

/**
 * Hook لتحريك عناصر النص
 * Hook for text element dragging
 */
export function useTextDrag(options: UseTextDragOptions): UseTextDragReturn {
  const { zoom, pan, onDragStart, onDragEnd } = options;
  const { elements, updateElement } = useCanvasStore();

  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    elementId: null,
    startPoint: null,
    originalPosition: null,
  });

  // مرجع للموضع الحالي لتجنب تحديثات متكررة
  const currentPositionRef = useRef<{ x: number; y: number } | null>(null);

  /**
   * بدء السحب
   * Start dragging an element
   */
  const startDrag = useCallback((
    elementId: string, 
    clientX: number, 
    clientY: number
  ) => {
    const element = elements.find(el => el.id === elementId);
    if (!element || element.locked) return;

    const originalPosition = { 
      x: element.position.x, 
      y: element.position.y 
    };

    setDragState({
      isDragging: true,
      elementId,
      startPoint: { x: clientX, y: clientY },
      originalPosition,
    });

    currentPositionRef.current = originalPosition;
    onDragStart?.(elementId);
  }, [elements, onDragStart]);

  /**
   * تحديث موضع السحب
   * Update drag position
   */
  const updateDrag = useCallback((clientX: number, clientY: number) => {
    if (!dragState.isDragging || !dragState.elementId || !dragState.startPoint || !dragState.originalPosition) {
      return;
    }

    // حساب الإزاحة بالنسبة للـ zoom
    const deltaX = (clientX - dragState.startPoint.x) / zoom;
    const deltaY = (clientY - dragState.startPoint.y) / zoom;

    const newX = dragState.originalPosition.x + deltaX;
    const newY = dragState.originalPosition.y + deltaY;

    // تحديث فقط إذا تغير الموضع بشكل ملحوظ
    if (
      !currentPositionRef.current ||
      Math.abs(newX - currentPositionRef.current.x) > 0.5 ||
      Math.abs(newY - currentPositionRef.current.y) > 0.5
    ) {
      currentPositionRef.current = { x: newX, y: newY };
      
      updateElement(dragState.elementId, {
        position: { x: newX, y: newY }
      });
    }
  }, [dragState, zoom, updateElement]);

  /**
   * إنهاء السحب
   * End dragging
   */
  const endDrag = useCallback(() => {
    if (dragState.isDragging && dragState.elementId && currentPositionRef.current) {
      onDragEnd?.(dragState.elementId, currentPositionRef.current);
    }

    setDragState({
      isDragging: false,
      elementId: null,
      startPoint: null,
      originalPosition: null,
    });

    currentPositionRef.current = null;
  }, [dragState, onDragEnd]);

  /**
   * إلغاء السحب وإعادة الموضع الأصلي
   * Cancel dragging and restore original position
   */
  const cancelDrag = useCallback(() => {
    if (dragState.isDragging && dragState.elementId && dragState.originalPosition) {
      updateElement(dragState.elementId, {
        position: dragState.originalPosition
      });
    }

    setDragState({
      isDragging: false,
      elementId: null,
      startPoint: null,
      originalPosition: null,
    });

    currentPositionRef.current = null;
  }, [dragState, updateElement]);

  // إضافة مستمعات الأحداث العامة للسحب
  useEffect(() => {
    if (!dragState.isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      updateDrag(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
      endDrag();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cancelDrag();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dragState.isDragging, updateDrag, endDrag, cancelDrag]);

  return {
    dragState,
    startDrag,
    updateDrag,
    endDrag,
    cancelDrag,
  };
}

export default useTextDrag;
