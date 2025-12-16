import { useCallback, useRef } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { screenToCanvasCoordinates } from '@/utils/canvasCoordinates';

interface UseCanvasEventsOptions {
  containerRef: React.RefObject<HTMLElement>;
  onElementClick?: (elementId: string, event: React.MouseEvent) => void;
  onCanvasClick?: (position: { x: number; y: number }, event: React.MouseEvent) => void;
  onElementDragStart?: (elementId: string, position: { x: number; y: number }) => void;
  onElementDragMove?: (elementId: string, position: { x: number; y: number }) => void;
  onElementDragEnd?: (elementId: string, position: { x: number; y: number }) => void;
  onSelectionBoxStart?: (position: { x: number; y: number }) => void;
  onSelectionBoxMove?: (position: { x: number; y: number }) => void;
  onSelectionBoxEnd?: (bounds: { x: number; y: number; width: number; height: number }) => void;
}

/**
 * هوك لإدارة أحداث الكانفاس (النقر، السحب، التحديد)
 */
export function useCanvasEvents(options: UseCanvasEventsOptions) {
  const {
    containerRef,
    onElementClick,
    onCanvasClick,
    onElementDragStart,
    onElementDragMove,
    onElementDragEnd,
    onSelectionBoxStart,
    onSelectionBoxMove,
    onSelectionBoxEnd
  } = options;

  const viewport = useCanvasStore(state => state.viewport);
  const typingMode = useCanvasStore(state => state.typingMode);
  
  const { zoom, pan } = viewport;
  
  const isDraggingRef = useRef(false);
  const isSelectingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const selectionStartRef = useRef({ x: 0, y: 0 });

  // تحويل إحداثيات الشاشة إلى إحداثيات الكانفاس
  const getCanvasPosition = useCallback((clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    return screenToCanvasCoordinates(clientX, clientY, { zoom, pan }, rect);
  }, [containerRef, zoom, pan]);

  // معالجة النقر على الكانفاس
  const handleCanvasMouseDown = useCallback((event: React.MouseEvent) => {
    if (typingMode) return;
    
    const position = getCanvasPosition(event.clientX, event.clientY);
    
    // إذا لم يكن النقر على عنصر، ابدأ صندوق التحديد
    const target = event.target as HTMLElement;
    const isOnElement = target.closest('[data-canvas-element]');
    
    if (!isOnElement) {
      isSelectingRef.current = true;
      selectionStartRef.current = position;
      onSelectionBoxStart?.(position);
      onCanvasClick?.(position, event);
    }
  }, [typingMode, getCanvasPosition, onSelectionBoxStart, onCanvasClick]);

  // معالجة تحريك الماوس على الكانفاس
  const handleCanvasMouseMove = useCallback((event: React.MouseEvent) => {
    const position = getCanvasPosition(event.clientX, event.clientY);
    
    if (isSelectingRef.current) {
      onSelectionBoxMove?.(position);
    }
    
    if (isDraggingRef.current) {
      onElementDragMove?.('', position);
    }
  }, [getCanvasPosition, onSelectionBoxMove, onElementDragMove]);

  // معالجة رفع زر الماوس
  const handleCanvasMouseUp = useCallback((event: React.MouseEvent) => {
    const position = getCanvasPosition(event.clientX, event.clientY);
    
    if (isSelectingRef.current) {
      const bounds = {
        x: Math.min(selectionStartRef.current.x, position.x),
        y: Math.min(selectionStartRef.current.y, position.y),
        width: Math.abs(position.x - selectionStartRef.current.x),
        height: Math.abs(position.y - selectionStartRef.current.y)
      };
      onSelectionBoxEnd?.(bounds);
      isSelectingRef.current = false;
    }
    
    if (isDraggingRef.current) {
      onElementDragEnd?.('', position);
      isDraggingRef.current = false;
    }
  }, [getCanvasPosition, onSelectionBoxEnd, onElementDragEnd]);

  // معالجة النقر على عنصر
  const handleElementMouseDown = useCallback((
    elementId: string, 
    event: React.MouseEvent
  ) => {
    if (typingMode) return;
    
    event.stopPropagation();
    const position = getCanvasPosition(event.clientX, event.clientY);
    
    isDraggingRef.current = true;
    dragStartRef.current = position;
    
    onElementDragStart?.(elementId, position);
    onElementClick?.(elementId, event);
  }, [typingMode, getCanvasPosition, onElementDragStart, onElementClick]);

  // معالجة مغادرة الماوس للكانفاس
  const handleCanvasMouseLeave = useCallback(() => {
    if (isSelectingRef.current) {
      isSelectingRef.current = false;
    }
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
    }
  }, []);

  return {
    // حالات السحب والتحديد
    isDragging: isDraggingRef.current,
    isSelecting: isSelectingRef.current,
    
    // المعالجات
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleCanvasMouseLeave,
    handleElementMouseDown,
    
    // أدوات مساعدة
    getCanvasPosition
  };
}

export default useCanvasEvents;
