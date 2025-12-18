/**
 * Grid Renderer - رسم الشبكة اللانهائية في World Space
 * 
 * يستخدم Canvas API للرسم الفعال مع دعم:
 * - DevicePixelRatio للحصول على رسم حاد
 * - World Space coordinates
 * - تثبيت الشبكة أثناء pan/zoom
 */

import { canvasKernel, type Camera, type Bounds } from './canvasKernel';

// =============================================================================
// Types
// =============================================================================

export interface GridConfig {
  /** حجم خلية الشبكة الصغيرة (بالبكسل في World Space) */
  gridSize: number;
  /** مضاعف الخطوط الرئيسية (كل كم خط يظهر خط سميك) */
  majorLineEvery: number;
  /** لون الخطوط الثانوية */
  minorLineColor: string;
  /** لون الخطوط الرئيسية */
  majorLineColor: string;
  /** سماكة الخطوط الثانوية */
  minorLineWidth: number;
  /** سماكة الخطوط الرئيسية */
  majorLineWidth: number;
  /** هل الشبكة مفعّلة */
  enabled: boolean;
  /** إزاحة الرسم لتحويل World Space إلى Canvas Space */
  offset?: { x: number; y: number };
}

export const DEFAULT_GRID_CONFIG: GridConfig = {
  gridSize: 20,
  majorLineEvery: 5,
  minorLineColor: 'rgba(11, 15, 18, 0.06)',
  majorLineColor: 'rgba(11, 15, 18, 0.12)',
  minorLineWidth: 1,
  majorLineWidth: 1,
  enabled: true,
  offset: { x: 0, y: 0 }
};

// =============================================================================
// Grid Renderer Class
// =============================================================================

class GridRendererImpl {
  private _lastRenderParams: string = '';

  /**
   * رسم الشبكة على Canvas
   * 
   * @param ctx - Canvas 2D context
   * @param camera - حالة الكاميرا (zoom, pan)
   * @param containerWidth - عرض الحاوية (بالبكسل الفعلي)
   * @param containerHeight - ارتفاع الحاوية (بالبكسل الفعلي)
   * @param config - إعدادات الشبكة
   */
  render(
    ctx: CanvasRenderingContext2D,
    camera: Camera,
    containerWidth: number,
    containerHeight: number,
    config: Partial<GridConfig> = {}
  ): void {
    const gridConfig = { ...DEFAULT_GRID_CONFIG, ...config };
    
    if (!gridConfig.enabled) {
      ctx.clearRect(0, 0, containerWidth, containerHeight);
      return;
    }

    const dpr = canvasKernel.dpr;
    
    // مسح الكانفاس
    ctx.clearRect(0, 0, containerWidth * dpr, containerHeight * dpr);
    
    // حساب حدود العرض في World Space
    const visibleBounds = canvasKernel.getVisibleBounds(
      camera,
      containerWidth,
      containerHeight
    );

    // حساب نطاق الخطوط المرئية
    const gridSize = gridConfig.gridSize;
    const majorEvery = gridConfig.majorLineEvery;
    
    // توسيع النطاق قليلاً لتجنب القطع
    const padding = gridSize * 2;
    const startX = Math.floor((visibleBounds.x - padding) / gridSize) * gridSize;
    const startY = Math.floor((visibleBounds.y - padding) / gridSize) * gridSize;
    const endX = Math.ceil((visibleBounds.x + visibleBounds.width + padding) / gridSize) * gridSize;
    const endY = Math.ceil((visibleBounds.y + visibleBounds.height + padding) / gridSize) * gridSize;

    // تطبيق DPR للرسم الحاد
    ctx.save();
    ctx.scale(dpr, dpr);

    // حساب الإزاحة لتحويل World Space إلى Canvas Space
    const offsetX = gridConfig.offset?.x ?? 0;
    const offsetY = gridConfig.offset?.y ?? 0;

    // رسم الخطوط الثانوية أولاً
    this.drawGridLines(
      ctx,
      camera,
      startX,
      startY,
      endX,
      endY,
      gridSize,
      majorEvery,
      gridConfig.minorLineColor,
      gridConfig.minorLineWidth,
      false,
      offsetX,
      offsetY
    );

    // رسم الخطوط الرئيسية فوقها
    this.drawGridLines(
      ctx,
      camera,
      startX,
      startY,
      endX,
      endY,
      gridSize * majorEvery,
      1, // لا نريد تخطي أي خط رئيسي
      gridConfig.majorLineColor,
      gridConfig.majorLineWidth,
      true,
      offsetX,
      offsetY
    );

    ctx.restore();
  }

  /**
   * رسم خطوط الشبكة في World Space مباشرة
   * (CSS transform يتولى التحويل إلى Screen Space)
   */
  private drawGridLines(
    ctx: CanvasRenderingContext2D,
    _camera: Camera,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    gridSize: number,
    majorEvery: number,
    color: string,
    lineWidth: number,
    isMajor: boolean,
    offsetX: number = 0,
    offsetY: number = 0
  ): void {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    // رسم الخطوط العمودية - تحويل World Space إلى Canvas Space
    for (let worldX = startX; worldX <= endX; worldX += gridSize) {
      // تخطي الخطوط الرئيسية إذا كنا نرسم الثانوية
      if (!isMajor && majorEvery > 1 && Math.abs(worldX % (gridSize * majorEvery)) < 0.01) {
        continue;
      }

      // تحويل من World Space إلى Canvas Space بإضافة الـ offset
      const canvasX = Math.round(worldX + offsetX) + 0.5;
      const canvasStartY = startY + offsetY;
      const canvasEndY = endY + offsetY;
      ctx.moveTo(canvasX, canvasStartY);
      ctx.lineTo(canvasX, canvasEndY);
    }

    // رسم الخطوط الأفقية - تحويل World Space إلى Canvas Space
    for (let worldY = startY; worldY <= endY; worldY += gridSize) {
      // تخطي الخطوط الرئيسية إذا كنا نرسم الثانوية
      if (!isMajor && majorEvery > 1 && Math.abs(worldY % (gridSize * majorEvery)) < 0.01) {
        continue;
      }

      // تحويل من World Space إلى Canvas Space بإضافة الـ offset
      const canvasY = Math.round(worldY + offsetY) + 0.5;
      const canvasStartX = startX + offsetX;
      const canvasEndX = endX + offsetX;
      ctx.moveTo(canvasStartX, canvasY);
      ctx.lineTo(canvasEndX, canvasY);
    }

    ctx.stroke();
  }

  /**
   * تحديد إذا كان يجب إعادة الرسم
   */
  shouldRerender(
    camera: Camera,
    containerWidth: number,
    containerHeight: number,
    enabled: boolean
  ): boolean {
    const params = `${camera.zoom.toFixed(4)}-${camera.pan.x.toFixed(2)}-${camera.pan.y.toFixed(2)}-${containerWidth}-${containerHeight}-${enabled}`;
    if (params === this._lastRenderParams) {
      return false;
    }
    this._lastRenderParams = params;
    return true;
  }

  /**
   * إعادة تعيين حالة الـ cache
   */
  invalidateCache(): void {
    this._lastRenderParams = '';
  }
}

// =============================================================================
// Singleton Export
// =============================================================================

export const gridRenderer = new GridRendererImpl();
