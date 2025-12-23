/**
 * Canvas Coordinate Transformation Utilities
 * 
 * ⚠️ ملاحظة: هذا الملف موجود للتوافق مع الكود القديم فقط
 * جميع الوظائف تُعيد توجيه المكالمات إلى Canvas Kernel
 * 
 * @deprecated استخدم canvasKernel من '@/core/canvasKernel' مباشرة
 */

import { 
  canvasKernel, 
  screenToCanvasCoordinates,
  canvasToScreenCoordinates,
  snapToGrid,
  distanceBetween,
  calculateBounds,
  type Point,
  type Camera,
  type Bounds
} from '@/engine/canvas/kernel/canvasKernel';

// Re-export everything from the kernel for backwards compatibility
export {
  canvasKernel,
  screenToCanvasCoordinates,
  canvasToScreenCoordinates,
  snapToGrid,
  distanceBetween,
  calculateBounds
};

// Re-export types
export type { Point, Camera, Bounds };

// Legacy interface for compatibility
export interface Viewport {
  zoom: number;
  pan: { x: number; y: number };
}
