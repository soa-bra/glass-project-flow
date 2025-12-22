/**
 * useTextResize - Hook لتغيير حجم عناصر النص
 * Hook for resizing text elements on canvas
 * 
 * @module features/planning/elements/text/hooks/useTextResize
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import type { CanvasElement } from '@/types/canvas';

/** أنواع مقابض تغيير الحجم - Resize handle types */
export type ResizeHandle = 
  | 'n' | 's' | 'e' | 'w' 
  | 'ne' | 'nw' | 'se' | 'sw';

interface ResizeState {
  /** هل يتم تغيير الحجم حالياً - Is resizing active */
  isResizing: boolean;
  /** معرف العنصر - Element ID */
  elementId: string | null;
  /** المقبض المستخدم - Active handle */
  handle: ResizeHandle | null;
  /** نقطة البداية - Start point */
  startPoint: { x: number; y: number } | null;
  /** الحجم الأصلي - Original size */
  originalSize: { width: number; height: number } | null;
  /** الموضع الأصلي - Original position */
  originalPosition: { x: number; y: number } | null;
}

interface UseTextResizeOptions {
  /** معامل التكبير - Zoom factor */
  zoom: number;
  /** الحد الأدنى للعرض - Minimum width */
  minWidth?: number;
  /** الحد الأدنى للارتفاع - Minimum height */
  minHeight?: number;
  /** عند بدء تغيير الحجم - On resize start */
  onResizeStart?: (elementId: string) => void;
  /** عند انتهاء تغيير الحجم - On resize end */
  onResizeEnd?: (elementId: string, size: { width: number; height: number }) => void;
}

interface UseTextResizeReturn {
  /** حالة تغيير الحجم - Resize state */
  resizeState: ResizeState;
  /** بدء تغيير الحجم - Start resizing */
  startResize: (elementId: string, handle: ResizeHandle, clientX: number, clientY: number) => void;
  /** تحديث تغيير الحجم - Update resize */
  updateResize: (clientX: number, clientY: number) => void;
  /** إنهاء تغيير الحجم - End resizing */
  endResize: () => void;
  /** الحصول على مواضع المقابض - Get handle positions */
  getHandlePositions: (element: CanvasElement) => HandlePosition[];
}

interface HandlePosition {
  handle: ResizeHandle;
  x: number;
  y: number;
  cursor: string;
}

/**
 * Hook لتغيير حجم عناصر النص
 * Hook for text element resizing
 */
export function useTextResize(options: UseTextResizeOptions): UseTextResizeReturn {
  const { 
    zoom, 
    minWidth = 50, 
    minHeight = 24, 
    onResizeStart, 
    onResizeEnd 
  } = options;
  
  const { elements, updateElement } = useCanvasStore();

  const [resizeState, setResizeState] = useState<ResizeState>({
    isResizing: false,
    elementId: null,
    handle: null,
    startPoint: null,
    originalSize: null,
    originalPosition: null,
  });

  // مرجع للقيم الحالية
  const currentRef = useRef<{
    size: { width: number; height: number };
    position: { x: number; y: number };
  } | null>(null);

  /**
   * بدء تغيير الحجم
   * Start resizing an element
   */
  const startResize = useCallback((
    elementId: string,
    handle: ResizeHandle,
    clientX: number,
    clientY: number
  ) => {
    const element = elements.find(el => el.id === elementId);
    if (!element || element.locked) return;

    const originalSize = {
      width: element.size?.width || 200,
      height: element.size?.height || 40,
    };

    const originalPosition = {
      x: element.position.x,
      y: element.position.y,
    };

    setResizeState({
      isResizing: true,
      elementId,
      handle,
      startPoint: { x: clientX, y: clientY },
      originalSize,
      originalPosition,
    });

    currentRef.current = { size: originalSize, position: originalPosition };
    onResizeStart?.(elementId);
  }, [elements, onResizeStart]);

  /**
   * تحديث تغيير الحجم
   * Update resize dimensions
   */
  const updateResize = useCallback((clientX: number, clientY: number) => {
    const { isResizing, elementId, handle, startPoint, originalSize, originalPosition } = resizeState;
    
    if (!isResizing || !elementId || !handle || !startPoint || !originalSize || !originalPosition) {
      return;
    }

    const deltaX = (clientX - startPoint.x) / zoom;
    const deltaY = (clientY - startPoint.y) / zoom;

    let newWidth = originalSize.width;
    let newHeight = originalSize.height;
    let newX = originalPosition.x;
    let newY = originalPosition.y;

    // حساب الأبعاد الجديدة بناءً على المقبض
    switch (handle) {
      case 'e':
        newWidth = Math.max(minWidth, originalSize.width + deltaX);
        break;
      case 'w':
        newWidth = Math.max(minWidth, originalSize.width - deltaX);
        newX = originalPosition.x + (originalSize.width - newWidth);
        break;
      case 's':
        newHeight = Math.max(minHeight, originalSize.height + deltaY);
        break;
      case 'n':
        newHeight = Math.max(minHeight, originalSize.height - deltaY);
        newY = originalPosition.y + (originalSize.height - newHeight);
        break;
      case 'se':
        newWidth = Math.max(minWidth, originalSize.width + deltaX);
        newHeight = Math.max(minHeight, originalSize.height + deltaY);
        break;
      case 'sw':
        newWidth = Math.max(minWidth, originalSize.width - deltaX);
        newHeight = Math.max(minHeight, originalSize.height + deltaY);
        newX = originalPosition.x + (originalSize.width - newWidth);
        break;
      case 'ne':
        newWidth = Math.max(minWidth, originalSize.width + deltaX);
        newHeight = Math.max(minHeight, originalSize.height - deltaY);
        newY = originalPosition.y + (originalSize.height - newHeight);
        break;
      case 'nw':
        newWidth = Math.max(minWidth, originalSize.width - deltaX);
        newHeight = Math.max(minHeight, originalSize.height - deltaY);
        newX = originalPosition.x + (originalSize.width - newWidth);
        newY = originalPosition.y + (originalSize.height - newHeight);
        break;
    }

    currentRef.current = {
      size: { width: newWidth, height: newHeight },
      position: { x: newX, y: newY },
    };

    updateElement(elementId, {
      size: { width: newWidth, height: newHeight },
      position: { x: newX, y: newY },
    });
  }, [resizeState, zoom, minWidth, minHeight, updateElement]);

  /**
   * إنهاء تغيير الحجم
   * End resizing
   */
  const endResize = useCallback(() => {
    if (resizeState.isResizing && resizeState.elementId && currentRef.current) {
      onResizeEnd?.(resizeState.elementId, currentRef.current.size);
    }

    setResizeState({
      isResizing: false,
      elementId: null,
      handle: null,
      startPoint: null,
      originalSize: null,
      originalPosition: null,
    });

    currentRef.current = null;
  }, [resizeState, onResizeEnd]);

  /**
   * الحصول على مواضع المقابض
   * Get handle positions for an element
   */
  const getHandlePositions = useCallback((element: CanvasElement): HandlePosition[] => {
    const { position, size } = element;
    const w = size?.width || 200;
    const h = size?.height || 40;
    const x = position.x;
    const y = position.y;

    return [
      { handle: 'nw', x, y, cursor: 'nwse-resize' },
      { handle: 'n', x: x + w / 2, y, cursor: 'ns-resize' },
      { handle: 'ne', x: x + w, y, cursor: 'nesw-resize' },
      { handle: 'w', x, y: y + h / 2, cursor: 'ew-resize' },
      { handle: 'e', x: x + w, y: y + h / 2, cursor: 'ew-resize' },
      { handle: 'sw', x, y: y + h, cursor: 'nesw-resize' },
      { handle: 's', x: x + w / 2, y: y + h, cursor: 'ns-resize' },
      { handle: 'se', x: x + w, y: y + h, cursor: 'nwse-resize' },
    ];
  }, []);

  // إضافة مستمعات الأحداث العامة
  useEffect(() => {
    if (!resizeState.isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      updateResize(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
      endResize();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizeState.isResizing, updateResize, endResize]);

  return {
    resizeState,
    startResize,
    updateResize,
    endResize,
    getHandlePositions,
  };
}

export default useTextResize;
