/**
 * Canvas Coordinate Transformation Utilities
 * تحويل الإحداثيات بين شاشة المستخدم وإحداثيات الكانفاس
 */

export interface Viewport {
  zoom: number;
  pan: { x: number; y: number };
}

/**
 * تحويل إحداثيات الشاشة إلى إحداثيات الكانفاس
 */
export const screenToCanvasCoordinates = (
  screenX: number,
  screenY: number,
  viewport: Viewport,
  containerRect?: DOMRect
): { x: number; y: number } => {
  const offsetX = containerRect?.left || 0;
  const offsetY = containerRect?.top || 0;
  
  return {
    x: (screenX - offsetX - viewport.pan.x) / viewport.zoom,
    y: (screenY - offsetY - viewport.pan.y) / viewport.zoom
  };
};

/**
 * تحويل إحداثيات الكانفاس إلى إحداثيات الشاشة
 */
export const canvasToScreenCoordinates = (
  canvasX: number,
  canvasY: number,
  viewport: Viewport,
  containerRect?: DOMRect
): { x: number; y: number } => {
  const offsetX = containerRect?.left || 0;
  const offsetY = containerRect?.top || 0;
  
  return {
    x: canvasX * viewport.zoom + viewport.pan.x + offsetX,
    y: canvasY * viewport.zoom + viewport.pan.y + offsetY
  };
};

/**
 * حساب المسافة بين نقطتين
 */
export const distanceBetween = (
  p1: { x: number; y: number },
  p2: { x: number; y: number }
): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * تطبيق snap to grid على الإحداثيات
 */
export const snapToGrid = (
  x: number,
  y: number,
  gridSize: number,
  enabled: boolean
): { x: number; y: number } => {
  if (!enabled) return { x, y };
  
  return {
    x: Math.round(x / gridSize) * gridSize,
    y: Math.round(y / gridSize) * gridSize
  };
};

/**
 * حساب حدود مجموعة من العناصر
 */
export const calculateBounds = (elements: Array<{
  position: { x: number; y: number };
  size: { width: number; height: number };
}>) => {
  if (elements.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0, centerX: 0, centerY: 0 };
  }
  
  const minX = Math.min(...elements.map(el => el.position.x));
  const minY = Math.min(...elements.map(el => el.position.y));
  const maxX = Math.max(...elements.map(el => el.position.x + el.size.width));
  const maxY = Math.max(...elements.map(el => el.position.y + el.size.height));
  
  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
    centerX: minX + (maxX - minX) / 2,
    centerY: minY + (maxY - minY) / 2
  };
};
