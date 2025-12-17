/**
 * Canvas Kernel - المصدر الوحيد للحقيقة لتحويلات الإحداثيات
 * 
 * هذا الملف هو المرجع الأساسي لجميع عمليات:
 * - تحويل الإحداثيات (World Space ↔ Screen Space)
 * - حالة الكاميرا (zoom, pan)
 * - توليد CSS transforms
 * - معالجة DevicePixelRatio
 * 
 * ⚠️ قاعدة صارمة: جميع حسابات الإحداثيات يجب أن تمر من هنا
 */

// =============================================================================
// Types
// =============================================================================

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Camera {
  zoom: number;
  pan: Point;
}

export interface Viewport extends Camera {
  containerRect?: DOMRect;
}

// =============================================================================
// Canvas Kernel Class
// =============================================================================

class CanvasKernelImpl {
  private _dpr: number = 1;

  constructor() {
    // تحديث DPR عند التهيئة
    this.updateDPR();
  }

  /**
   * تحديث Device Pixel Ratio
   */
  updateDPR(): void {
    if (typeof window !== 'undefined') {
      this._dpr = window.devicePixelRatio || 1;
    }
  }

  /**
   * الحصول على Device Pixel Ratio
   */
  get dpr(): number {
    return this._dpr;
  }

  // ===========================================================================
  // Coordinate Transformations
  // ===========================================================================

  /**
   * تحويل إحداثيات الشاشة (Screen Space) إلى إحداثيات العالم (World Space)
   * 
   * @param screenX - إحداثي X على الشاشة (e.clientX)
   * @param screenY - إحداثي Y على الشاشة (e.clientY)
   * @param camera - حالة الكاميرا (zoom, pan)
   * @param containerRect - أبعاد الحاوية (اختياري)
   * @returns إحداثيات World Space
   */
  screenToWorld(
    screenX: number,
    screenY: number,
    camera: Camera,
    containerRect?: DOMRect | null
  ): Point {
    const offsetX = containerRect?.left ?? 0;
    const offsetY = containerRect?.top ?? 0;

    return {
      x: (screenX - offsetX - camera.pan.x) / camera.zoom,
      y: (screenY - offsetY - camera.pan.y) / camera.zoom
    };
  }

  /**
   * تحويل إحداثيات العالم (World Space) إلى إحداثيات الشاشة (Screen Space)
   * 
   * @param worldX - إحداثي X في World Space
   * @param worldY - إحداثي Y في World Space
   * @param camera - حالة الكاميرا
   * @param containerRect - أبعاد الحاوية (اختياري)
   * @returns إحداثيات Screen Space
   */
  worldToScreen(
    worldX: number,
    worldY: number,
    camera: Camera,
    containerRect?: DOMRect | null
  ): Point {
    const offsetX = containerRect?.left ?? 0;
    const offsetY = containerRect?.top ?? 0;

    return {
      x: worldX * camera.zoom + camera.pan.x + offsetX,
      y: worldY * camera.zoom + camera.pan.y + offsetY
    };
  }

  /**
   * تحويل فرق الإحداثيات من Screen Space إلى World Space
   * مفيد لحسابات السحب (dragging)
   * 
   * @param deltaScreenX - فرق X على الشاشة
   * @param deltaScreenY - فرق Y على الشاشة
   * @param zoom - مستوى التكبير
   * @returns فرق الإحداثيات في World Space
   */
  screenDeltaToWorld(deltaScreenX: number, deltaScreenY: number, zoom: number): Point {
    return {
      x: deltaScreenX / zoom,
      y: deltaScreenY / zoom
    };
  }

  /**
   * تحويل فرق الإحداثيات من World Space إلى Screen Space
   * 
   * @param deltaWorldX - فرق X في World
   * @param deltaWorldY - فرق Y في World
   * @param zoom - مستوى التكبير
   * @returns فرق الإحداثيات في Screen Space
   */
  worldDeltaToScreen(deltaWorldX: number, deltaWorldY: number, zoom: number): Point {
    return {
      x: deltaWorldX * zoom,
      y: deltaWorldY * zoom
    };
  }

  // ===========================================================================
  // CSS Transform Generation
  // ===========================================================================

  /**
   * توليد CSS transform string للكانفاس
   * 
   * @param camera - حالة الكاميرا
   * @returns CSS transform string
   */
  getCanvasTransform(camera: Camera): string {
    return `translate(${camera.pan.x}px, ${camera.pan.y}px) scale(${camera.zoom})`;
  }

  /**
   * توليد CSS transform للعناصر الثابتة (مثل الشبكة)
   * 
   * @param camera - حالة الكاميرا
   * @returns CSS transform string
   */
  getFixedLayerTransform(camera: Camera): string {
    return `scale(${camera.zoom}) translate(${camera.pan.x / camera.zoom}px, ${camera.pan.y / camera.zoom}px)`;
  }

  // ===========================================================================
  // Bounds & Geometry Calculations (World Space)
  // ===========================================================================

  /**
   * حساب حدود مجموعة من العناصر في World Space
   */
  calculateBounds(elements: Array<{ position: Point; size: Size }>): Bounds & {
    centerX: number;
    centerY: number;
  } {
    if (elements.length === 0) {
      return { x: 0, y: 0, width: 0, height: 0, centerX: 0, centerY: 0 };
    }

    const minX = Math.min(...elements.map(el => el.position.x));
    const minY = Math.min(...elements.map(el => el.position.y));
    const maxX = Math.max(...elements.map(el => el.position.x + el.size.width));
    const maxY = Math.max(...elements.map(el => el.position.y + el.size.height));

    const width = maxX - minX;
    const height = maxY - minY;

    return {
      x: minX,
      y: minY,
      width,
      height,
      centerX: minX + width / 2,
      centerY: minY + height / 2
    };
  }

  /**
   * حساب المسافة بين نقطتين في World Space
   */
  distance(p1: Point, p2: Point): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * التحقق من تقاطع مستطيلين في World Space
   */
  boundsIntersect(a: Bounds, b: Bounds): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  /**
   * التحقق إذا كانت نقطة داخل مستطيل
   */
  pointInBounds(point: Point, bounds: Bounds): boolean {
    return (
      point.x >= bounds.x &&
      point.x <= bounds.x + bounds.width &&
      point.y >= bounds.y &&
      point.y <= bounds.y + bounds.height
    );
  }

  // ===========================================================================
  // Grid Snapping (World Space)
  // ===========================================================================

  /**
   * محاذاة نقطة للشبكة
   */
  snapToGrid(point: Point, gridSize: number, enabled: boolean = true): Point {
    if (!enabled || gridSize <= 0) return point;

    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  }

  /**
   * محاذاة حدود للشبكة
   */
  snapBoundsToGrid(bounds: Bounds, gridSize: number, enabled: boolean = true): Bounds {
    if (!enabled || gridSize <= 0) return bounds;

    const snappedPos = this.snapToGrid({ x: bounds.x, y: bounds.y }, gridSize, enabled);
    
    return {
      ...snappedPos,
      width: Math.round(bounds.width / gridSize) * gridSize || gridSize,
      height: Math.round(bounds.height / gridSize) * gridSize || gridSize
    };
  }

  // ===========================================================================
  // Viewport Calculations
  // ===========================================================================

  /**
   * حساب حدود العرض المرئية في World Space
   */
  getVisibleBounds(camera: Camera, containerWidth: number, containerHeight: number): Bounds {
    return {
      x: -camera.pan.x / camera.zoom,
      y: -camera.pan.y / camera.zoom,
      width: containerWidth / camera.zoom,
      height: containerHeight / camera.zoom
    };
  }

  /**
   * حساب التكبير المناسب لإظهار حدود معينة
   */
  calculateZoomToFit(
    bounds: Bounds,
    containerWidth: number,
    containerHeight: number,
    padding: number = 50
  ): { zoom: number; pan: Point } {
    const availableWidth = containerWidth - padding * 2;
    const availableHeight = containerHeight - padding * 2;

    if (bounds.width === 0 || bounds.height === 0) {
      return { zoom: 1, pan: { x: 0, y: 0 } };
    }

    const zoomX = availableWidth / bounds.width;
    const zoomY = availableHeight / bounds.height;
    const zoom = Math.min(zoomX, zoomY, 2); // الحد الأقصى 200%

    const centerX = bounds.x + bounds.width / 2;
    const centerY = bounds.y + bounds.height / 2;

    return {
      zoom,
      pan: {
        x: containerWidth / 2 - centerX * zoom,
        y: containerHeight / 2 - centerY * zoom
      }
    };
  }

  // ===========================================================================
  // DevicePixelRatio Utilities
  // ===========================================================================

  /**
   * الحصول على قيمة مُعدَّلة حسب DPR
   */
  getScaledValue(value: number): number {
    return value * this._dpr;
  }

  /**
   * الحصول على قيمة بدون تعديل DPR
   */
  getUnscaledValue(value: number): number {
    return value / this._dpr;
  }
}

// =============================================================================
// Singleton Export
// =============================================================================

export const canvasKernel = new CanvasKernelImpl();

// =============================================================================
// Helper Functions (للتوافق مع الكود القديم)
// =============================================================================

/**
 * تحويل إحداثيات الشاشة إلى إحداثيات الكانفاس (World Space)
 * @deprecated استخدم canvasKernel.screenToWorld بدلاً من ذلك
 */
export const screenToCanvasCoordinates = (
  screenX: number,
  screenY: number,
  viewport: Camera,
  containerRect?: DOMRect
): Point => {
  return canvasKernel.screenToWorld(screenX, screenY, viewport, containerRect);
};

/**
 * تحويل إحداثيات الكانفاس إلى إحداثيات الشاشة
 * @deprecated استخدم canvasKernel.worldToScreen بدلاً من ذلك
 */
export const canvasToScreenCoordinates = (
  canvasX: number,
  canvasY: number,
  viewport: Camera,
  containerRect?: DOMRect
): Point => {
  return canvasKernel.worldToScreen(canvasX, canvasY, viewport, containerRect);
};

/**
 * Snap to grid
 * @deprecated استخدم canvasKernel.snapToGrid بدلاً من ذلك
 */
export const snapToGrid = (
  x: number,
  y: number,
  gridSize: number,
  enabled: boolean
): Point => {
  return canvasKernel.snapToGrid({ x, y }, gridSize, enabled);
};

/**
 * حساب المسافة بين نقطتين
 * @deprecated استخدم canvasKernel.distance بدلاً من ذلك
 */
export const distanceBetween = (p1: Point, p2: Point): number => {
  return canvasKernel.distance(p1, p2);
};

/**
 * حساب حدود مجموعة من العناصر
 * @deprecated استخدم canvasKernel.calculateBounds بدلاً من ذلك
 */
export const calculateBounds = (elements: Array<{
  position: Point;
  size: Size;
}>) => {
  const result = canvasKernel.calculateBounds(elements);
  return {
    minX: result.x,
    minY: result.y,
    maxX: result.x + result.width,
    maxY: result.y + result.height,
    width: result.width,
    height: result.height,
    centerX: result.centerX,
    centerY: result.centerY
  };
};

// =============================================================================
// React Hook for Container Rect
// =============================================================================

/**
 * دالة مساعدة للحصول على containerRect من ref
 */
export const getContainerRect = (ref: React.RefObject<HTMLElement>): DOMRect | null => {
  return ref.current?.getBoundingClientRect() ?? null;
};
