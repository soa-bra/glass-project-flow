/**
 * hitTesting - أدوات اكتشاف النقر على العناصر
 * Utilities for detecting clicks on elements
 * 
 * @module features/planning/elements/text/utils/hitTesting
 */

import type { CanvasElement } from '@/types/canvas';
import type { ResizeHandle } from '../hooks/useTextResize';

interface Point {
  x: number;
  y: number;
}

interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * التحقق من وجود نقطة داخل حدود مستطيل
 * Check if point is within rectangle bounds
 */
export function isPointInBounds(point: Point, bounds: Bounds): boolean {
  return (
    point.x >= bounds.x &&
    point.x <= bounds.x + bounds.width &&
    point.y >= bounds.y &&
    point.y <= bounds.y + bounds.height
  );
}

/**
 * التحقق من وجود نقطة على عنصر
 * Check if point hits an element
 */
export function hitTestElement(
  point: Point, 
  element: CanvasElement, 
  zoom: number = 1,
  pan: { x: number; y: number } = { x: 0, y: 0 }
): boolean {
  // تحويل النقطة من إحداثيات الشاشة إلى إحداثيات اللوحة
  const canvasPoint = screenToCanvas(point, zoom, pan);
  
  const bounds: Bounds = {
    x: element.position.x,
    y: element.position.y,
    width: element.size?.width || 200,
    height: element.size?.height || 40,
  };
  
  return isPointInBounds(canvasPoint, bounds);
}

/**
 * البحث عن العنصر تحت نقطة معينة
 * Find element under a point (topmost first)
 */
export function findElementAtPoint(
  point: Point,
  elements: CanvasElement[],
  zoom: number = 1,
  pan: { x: number; y: number } = { x: 0, y: 0 }
): CanvasElement | null {
  // البحث من الأعلى للأسفل (العناصر الأحدث فوق)
  for (let i = elements.length - 1; i >= 0; i--) {
    const element = elements[i];
    if (!element.visible) continue;
    
    if (hitTestElement(point, element, zoom, pan)) {
      return element;
    }
  }
  
  return null;
}

/**
 * البحث عن جميع العناصر تحت نقطة معينة
 * Find all elements under a point
 */
export function findAllElementsAtPoint(
  point: Point,
  elements: CanvasElement[],
  zoom: number = 1,
  pan: { x: number; y: number } = { x: 0, y: 0 }
): CanvasElement[] {
  return elements.filter(element => {
    if (!element.visible) return false;
    return hitTestElement(point, element, zoom, pan);
  });
}

/**
 * التحقق من النقر على مقبض تغيير الحجم
 * Check if point hits a resize handle
 */
export function hitTestResizeHandle(
  point: Point,
  element: CanvasElement,
  zoom: number = 1,
  pan: { x: number; y: number } = { x: 0, y: 0 },
  handleSize: number = 8
): ResizeHandle | null {
  const canvasPoint = screenToCanvas(point, zoom, pan);
  const { position, size } = element;
  const w = size?.width || 200;
  const h = size?.height || 40;
  const x = position.x;
  const y = position.y;
  
  // تعريف مواضع المقابض
  const handles: { handle: ResizeHandle; x: number; y: number }[] = [
    { handle: 'nw', x, y },
    { handle: 'n', x: x + w / 2, y },
    { handle: 'ne', x: x + w, y },
    { handle: 'w', x, y: y + h / 2 },
    { handle: 'e', x: x + w, y: y + h / 2 },
    { handle: 'sw', x, y: y + h },
    { handle: 's', x: x + w / 2, y: y + h },
    { handle: 'se', x: x + w, y: y + h },
  ];
  
  // حجم منطقة اللمس (معدل للـ zoom)
  const hitSize = handleSize / zoom;
  
  for (const { handle, x: hx, y: hy } of handles) {
    const dx = Math.abs(canvasPoint.x - hx);
    const dy = Math.abs(canvasPoint.y - hy);
    
    if (dx <= hitSize && dy <= hitSize) {
      return handle;
    }
  }
  
  return null;
}

/**
 * تحويل إحداثيات الشاشة إلى إحداثيات اللوحة
 * Convert screen coordinates to canvas coordinates
 */
export function screenToCanvas(
  point: Point,
  zoom: number,
  pan: { x: number; y: number }
): Point {
  return {
    x: (point.x - pan.x) / zoom,
    y: (point.y - pan.y) / zoom,
  };
}

/**
 * تحويل إحداثيات اللوحة إلى إحداثيات الشاشة
 * Convert canvas coordinates to screen coordinates
 */
export function canvasToScreen(
  point: Point,
  zoom: number,
  pan: { x: number; y: number }
): Point {
  return {
    x: point.x * zoom + pan.x,
    y: point.y * zoom + pan.y,
  };
}

/**
 * الحصول على حدود العنصر بإحداثيات الشاشة
 * Get element bounds in screen coordinates
 */
export function getElementScreenBounds(
  element: CanvasElement,
  zoom: number,
  pan: { x: number; y: number }
): Bounds {
  const topLeft = canvasToScreen(element.position, zoom, pan);
  
  return {
    x: topLeft.x,
    y: topLeft.y,
    width: (element.size?.width || 200) * zoom,
    height: (element.size?.height || 40) * zoom,
  };
}

/**
 * التحقق من تداخل مستطيلين
 * Check if two rectangles overlap
 */
export function doRectsOverlap(rect1: Bounds, rect2: Bounds): boolean {
  return !(
    rect1.x + rect1.width < rect2.x ||
    rect2.x + rect2.width < rect1.x ||
    rect1.y + rect1.height < rect2.y ||
    rect2.y + rect2.height < rect1.y
  );
}

/**
 * الحصول على العناصر داخل منطقة التحديد
 * Get elements within selection rectangle
 */
export function getElementsInSelection(
  selectionRect: Bounds,
  elements: CanvasElement[],
  zoom: number = 1,
  pan: { x: number; y: number } = { x: 0, y: 0 }
): CanvasElement[] {
  // تحويل منطقة التحديد إلى إحداثيات اللوحة
  const canvasRect: Bounds = {
    x: (selectionRect.x - pan.x) / zoom,
    y: (selectionRect.y - pan.y) / zoom,
    width: selectionRect.width / zoom,
    height: selectionRect.height / zoom,
  };
  
  return elements.filter(element => {
    if (!element.visible) return false;
    
    const elementBounds: Bounds = {
      x: element.position.x,
      y: element.position.y,
      width: element.size?.width || 200,
      height: element.size?.height || 40,
    };
    
    return doRectsOverlap(canvasRect, elementBounds);
  });
}

export default {
  isPointInBounds,
  hitTestElement,
  findElementAtPoint,
  findAllElementsAtPoint,
  hitTestResizeHandle,
  screenToCanvas,
  canvasToScreen,
  getElementScreenBounds,
  doRectsOverlap,
  getElementsInSelection,
};
