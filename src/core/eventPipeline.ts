/**
 * Event Pipeline - خط أنابيب موحد للأحداث
 * 
 * يوفر مصدراً واحداً لتحويل إحداثيات الأحداث إلى World Space
 * وتوجيهها للأدوات النشطة
 * 
 * ⚠️ قاعدة صارمة: جميع الأدوات تستقبل إحداثيات World Space من هنا فقط
 */

import { canvasKernel, type Point, type Camera } from './canvasKernel';

// =============================================================================
// Types
// =============================================================================

export type PointerEventType = 'down' | 'move' | 'up' | 'cancel';

export interface CanvasPointerEvent {
  /** نوع الحدث */
  type: PointerEventType;
  /** إحداثيات World Space */
  worldPoint: Point;
  /** إحداثيات Screen Space الأصلية */
  screenPoint: Point;
  /** زر الماوس المضغوط */
  button: number;
  /** ضغط القلم (0-1) */
  pressure: number;
  /** مفاتيح التعديل */
  modifiers: {
    shift: boolean;
    ctrl: boolean;
    alt: boolean;
    meta: boolean;
  };
  /** الحدث الأصلي */
  nativeEvent: PointerEvent | MouseEvent | WheelEvent;
  /** الهدف الأصلي */
  target: EventTarget | null;
  /** منع السلوك الافتراضي */
  preventDefault: () => void;
  /** إيقاف انتشار الحدث */
  stopPropagation: () => void;
}

export interface WheelCanvasEvent {
  /** إحداثيات World Space */
  worldPoint: Point;
  /** مقدار التمرير */
  deltaX: number;
  deltaY: number;
  /** هل Ctrl مضغوط (للتكبير) */
  isZoom: boolean;
  /** مفاتيح التعديل */
  modifiers: {
    shift: boolean;
    ctrl: boolean;
    alt: boolean;
    meta: boolean;
  };
  /** الحدث الأصلي */
  nativeEvent: WheelEvent;
  /** منع السلوك الافتراضي */
  preventDefault: () => void;
}

export type ToolEventHandler = (event: CanvasPointerEvent) => void;
export type WheelEventHandler = (event: WheelCanvasEvent) => void;

// =============================================================================
// Event Pipeline Class
// =============================================================================

class EventPipelineImpl {
  private _containerRect: DOMRect | null = null;
  private _camera: Camera = { zoom: 1, pan: { x: 0, y: 0 } };

  /**
   * تحديث مرجع الحاوية
   */
  setContainerRect(rect: DOMRect | null): void {
    this._containerRect = rect;
  }

  /**
   * تحديث حالة الكاميرا
   */
  setCamera(camera: Camera): void {
    this._camera = camera;
  }

  /**
   * الحصول على حالة الكاميرا الحالية
   */
  get camera(): Camera {
    return this._camera;
  }

  /**
   * تحويل حدث Pointer إلى CanvasPointerEvent
   */
  processPointerEvent(
    e: PointerEvent | MouseEvent,
    type: PointerEventType,
    containerRect?: DOMRect | null,
    camera?: Camera
  ): CanvasPointerEvent {
    const rect = containerRect ?? this._containerRect;
    const cam = camera ?? this._camera;

    const screenPoint: Point = {
      x: e.clientX,
      y: e.clientY
    };

    const worldPoint = canvasKernel.screenToWorld(
      e.clientX,
      e.clientY,
      cam,
      rect
    );

    return {
      type,
      worldPoint,
      screenPoint,
      button: e.button,
      pressure: 'pressure' in e ? (e as PointerEvent).pressure : 0.5,
      modifiers: {
        shift: e.shiftKey,
        ctrl: e.ctrlKey,
        alt: e.altKey,
        meta: e.metaKey
      },
      nativeEvent: e,
      target: e.target,
      preventDefault: () => e.preventDefault(),
      stopPropagation: () => e.stopPropagation()
    };
  }

  /**
   * تحويل حدث Wheel إلى WheelCanvasEvent
   */
  processWheelEvent(
    e: WheelEvent,
    containerRect?: DOMRect | null,
    camera?: Camera
  ): WheelCanvasEvent {
    const rect = containerRect ?? this._containerRect;
    const cam = camera ?? this._camera;

    const worldPoint = canvasKernel.screenToWorld(
      e.clientX,
      e.clientY,
      cam,
      rect
    );

    return {
      worldPoint,
      deltaX: e.deltaX,
      deltaY: e.deltaY,
      isZoom: e.ctrlKey || e.metaKey,
      modifiers: {
        shift: e.shiftKey,
        ctrl: e.ctrlKey,
        alt: e.altKey,
        meta: e.metaKey
      },
      nativeEvent: e,
      preventDefault: () => e.preventDefault()
    };
  }

  /**
   * تحويل إحداثيات Screen إلى World مباشرة
   */
  screenToWorld(
    screenX: number,
    screenY: number,
    containerRect?: DOMRect | null,
    camera?: Camera
  ): Point {
    const rect = containerRect ?? this._containerRect;
    const cam = camera ?? this._camera;
    return canvasKernel.screenToWorld(screenX, screenY, cam, rect);
  }

  /**
   * تحويل فرق الإحداثيات من Screen إلى World
   */
  screenDeltaToWorld(deltaX: number, deltaY: number, zoom?: number): Point {
    const z = zoom ?? this._camera.zoom;
    return canvasKernel.screenDeltaToWorld(deltaX, deltaY, z);
  }

  /**
   * التحقق إذا كان الهدف عنصر canvas
   */
  isCanvasElement(target: EventTarget | null): boolean {
    if (!target || !(target instanceof HTMLElement)) return false;
    return !!target.closest('[data-canvas-element="true"]');
  }

  /**
   * التحقق إذا كان الهدف bounding box
   */
  isBoundingBox(target: EventTarget | null): boolean {
    if (!target || !(target instanceof HTMLElement)) return false;
    return !!target.closest('.bounding-box');
  }

  /**
   * التحقق إذا كان الهدف لوحة جانبية
   */
  isPanel(target: EventTarget | null): boolean {
    if (!target || !(target instanceof HTMLElement)) return false;
    return !!target.closest('[data-panel="true"]') || 
           !!target.closest('[data-text-panel="true"]');
  }

  /**
   * التحقق إذا كان النقر على canvas فارغ
   */
  isEmptyCanvasClick(target: EventTarget | null): boolean {
    return !this.isCanvasElement(target) && 
           !this.isBoundingBox(target) && 
           !this.isPanel(target);
  }
}

// =============================================================================
// Singleton Export
// =============================================================================

export const eventPipeline = new EventPipelineImpl();

// =============================================================================
// React Hook للاستخدام في المكونات
// =============================================================================

/**
 * Hook لتوفير Event Pipeline مع sync تلقائي للكاميرا
 */
export function createEventPipelineSync(
  containerRef: React.RefObject<HTMLElement>,
  camera: Camera
) {
  // تحديث الحالة
  eventPipeline.setCamera(camera);
  
  const updateContainerRect = () => {
    eventPipeline.setContainerRect(containerRef.current?.getBoundingClientRect() ?? null);
  };

  return {
    pipeline: eventPipeline,
    updateContainerRect,
    
    // Helper methods
    processPointerEvent: (e: PointerEvent | MouseEvent, type: PointerEventType) => {
      updateContainerRect();
      return eventPipeline.processPointerEvent(e, type);
    },
    
    processWheelEvent: (e: WheelEvent) => {
      updateContainerRect();
      return eventPipeline.processWheelEvent(e);
    },
    
    screenToWorld: (screenX: number, screenY: number) => {
      updateContainerRect();
      return eventPipeline.screenToWorld(screenX, screenY);
    },
    
    screenDeltaToWorld: (deltaX: number, deltaY: number) => {
      return eventPipeline.screenDeltaToWorld(deltaX, deltaY);
    }
  };
}
