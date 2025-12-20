/**
 * Selection Coordinator - المنسق المركزي لأحداث التحديد
 * ✅ المرحلة 3: توحيد Event Handling
 * 
 * هذا الملف يوفر نقطة دخول مركزية لجميع أحداث التحديد،
 * مما يمنع التعارضات ويوحد السلوك عبر المكونات.
 */

import { useCanvasStore } from '@/stores/canvasStore';
import { useInteractionStore } from '@/stores/interactionStore';
import { canvasKernel, type Point, type Bounds } from '@/core/canvasKernel';
import type { CanvasElement } from '@/types/canvas';

// ============================================
// 🎯 أنواع الأحداث والأولويات
// ============================================

export type SelectionEventType = 
  | 'element-click'      // نقر على عنصر
  | 'element-drag'       // سحب عنصر
  | 'resize-start'       // بدء تغيير الحجم
  | 'box-select-start'   // بدء التحديد المتعدد
  | 'box-select-update'  // تحديث التحديد المتعدد
  | 'box-select-end'     // إنهاء التحديد المتعدد
  | 'canvas-click'       // نقر على الكانفاس الفارغ
  | 'bounding-box-drag'; // سحب من BoundingBox

export interface SelectionEvent {
  type: SelectionEventType;
  screenPoint: Point;
  worldPoint?: Point;
  elementId?: string;
  modifiers: {
    shift: boolean;
    ctrl: boolean;
    alt: boolean;
    meta: boolean;
  };
  originalEvent: React.PointerEvent | React.MouseEvent | PointerEvent | MouseEvent;
}

// ترتيب الأولويات (الأعلى = الأولوية الأعلى)
const EVENT_PRIORITY: Record<SelectionEventType, number> = {
  'resize-start': 100,        // أعلى أولوية
  'element-drag': 90,
  'bounding-box-drag': 80,
  'element-click': 70,
  'box-select-start': 60,
  'box-select-update': 50,
  'box-select-end': 40,
  'canvas-click': 10,         // أقل أولوية
};

// ============================================
// 🔧 Selection Coordinator Class
// ============================================

class SelectionCoordinator {
  private activeEvent: SelectionEventType | null = null;
  private eventLock = false;
  private lastEventTime = 0;
  private readonly DEBOUNCE_MS = 16; // 60fps

  /**
   * تحديد ما إذا كان يمكن معالجة حدث جديد
   */
  canProcessEvent(eventType: SelectionEventType): boolean {
    // إذا لا يوجد حدث نشط، السماح
    if (!this.activeEvent) return true;
    
    // إذا الحدث الجديد له أولوية أعلى أو مساوية
    return EVENT_PRIORITY[eventType] >= EVENT_PRIORITY[this.activeEvent];
  }

  /**
   * قفل الحدث الحالي
   */
  lockEvent(eventType: SelectionEventType): boolean {
    if (this.eventLock && !this.canProcessEvent(eventType)) {
      return false;
    }
    
    this.activeEvent = eventType;
    this.eventLock = true;
    this.lastEventTime = Date.now();
    return true;
  }

  /**
   * تحرير القفل
   */
  releaseEvent(): void {
    this.activeEvent = null;
    this.eventLock = false;
  }

  /**
   * الحصول على الحدث النشط
   */
  getActiveEvent(): SelectionEventType | null {
    return this.activeEvent;
  }

  /**
   * التحقق من قفل الحدث
   */
  isLocked(): boolean {
    return this.eventLock;
  }

  // ============================================
  // 🎮 معالجات الأحداث الرئيسية
  // ============================================

  /**
   * ✅ المرحلة 1: معالجة محسّنة للنقر على عنصر
   */
  handleElementClick(event: SelectionEvent): void {
    if (!this.canProcessEvent('element-click')) return;
    
    const { elementId, modifiers } = event;
    if (!elementId) return;
    
    const { selectElement, selectedElementIds, selectElements } = useCanvasStore.getState();
    const isMultiSelect = modifiers.shift || modifiers.ctrl || modifiers.meta;
    const isSelected = selectedElementIds.includes(elementId);
    
    if (isMultiSelect) {
      // Toggle selection with Shift/Ctrl/Meta
      if (isSelected) {
        selectElements(selectedElementIds.filter(id => id !== elementId));
      } else {
        selectElements([...selectedElementIds, elementId]);
      }
    } else if (!isSelected) {
      // Single selection - only if not already selected
      selectElement(elementId, false);
    }
    // ✅ إذا كان محدد بالفعل وبدون Shift، لا تفعل شيء (السماح للسحب)
  }

  /**
   * ✅ المرحلة 1: معالجة تحديد عنصر جديد (من CanvasElement)
   */
  handleElementSelect(
    elementId: string,
    isCurrentlySelected: boolean,
    modifiers: { shift: boolean; ctrl: boolean; meta: boolean }
  ): { shouldStartDrag: boolean; wasSelectionChanged: boolean } {
    const { selectElement, selectedElementIds, selectElements } = useCanvasStore.getState();
    const isMultiSelect = modifiers.shift || modifiers.ctrl || modifiers.meta;
    
    // إذا كان العنصر محدد بالفعل
    if (isCurrentlySelected) {
      if (isMultiSelect) {
        // إلغاء التحديد
        selectElements(selectedElementIds.filter(id => id !== elementId));
        return { shouldStartDrag: false, wasSelectionChanged: true };
      }
      // محدد بالفعل بدون Shift - لا تغير شيء، BoundingBox سيتولى السحب
      return { shouldStartDrag: false, wasSelectionChanged: false };
    }
    
    // العنصر غير محدد - قم بتحديده
    if (isMultiSelect) {
      selectElements([...selectedElementIds, elementId]);
    } else {
      selectElement(elementId, false);
    }
    
    // ✅ بدء السحب للعنصر الجديد
    return { shouldStartDrag: true, wasSelectionChanged: true };
  }

  /**
   * معالجة بدء سحب العناصر المحددة
   */
  handleDragStart(event: SelectionEvent): boolean {
    if (!this.lockEvent('bounding-box-drag')) return false;
    
    // تسجيل بدء السحب
    return true;
  }

  /**
   * معالجة بدء تغيير الحجم
   */
  handleResizeStart(event: SelectionEvent, handle: string): boolean {
    if (!this.lockEvent('resize-start')) return false;
    
    // تسجيل بدء تغيير الحجم
    return true;
  }

  /**
   * معالجة بدء التحديد المتعدد (Box Select)
   */
  handleBoxSelectStart(event: SelectionEvent): boolean {
    if (!this.lockEvent('box-select-start')) return false;
    
    const { startBoxSelect } = useInteractionStore.getState();
    const worldPoint = event.worldPoint || this.screenToWorld(event);
    
    // مسح التحديد إذا لم يكن Shift مضغوطاً
    if (!event.modifiers.shift) {
      useCanvasStore.getState().clearSelection();
    }
    
    startBoxSelect(worldPoint, event.modifiers.shift);
    return true;
  }

  /**
   * معالجة النقر على الكانفاس الفارغ
   */
  handleCanvasClick(event: SelectionEvent): void {
    if (!this.canProcessEvent('canvas-click')) return;
    
    // مسح التحديد
    useCanvasStore.getState().clearSelection();
  }

  /**
   * معالجة إنهاء الحدث
   */
  handleEventEnd(): void {
    this.releaseEvent();
  }

  // ============================================
  // 🔧 أدوات مساعدة
  // ============================================

  /**
   * تحويل إحداثيات الشاشة إلى World Space
   */
  private screenToWorld(event: SelectionEvent): Point {
    const { viewport } = useCanvasStore.getState();
    return canvasKernel.screenToWorld(
      event.screenPoint.x,
      event.screenPoint.y,
      viewport,
      null
    );
  }

  /**
   * البحث عن العنصر تحت نقطة معينة
   */
  findElementAtPoint(worldPoint: Point): CanvasElement | null {
    const { elements, layers } = useCanvasStore.getState();
    
    // البحث من الأعلى للأسفل (العناصر الأحدث أولاً)
    for (let i = elements.length - 1; i >= 0; i--) {
      const element = elements[i];
      
      // تجاهل العناصر غير المرئية أو المقفلة
      const layer = layers.find(l => l.id === element.layerId);
      if (!layer?.visible || !element.visible || element.locked) continue;
      
      // التحقق من التقاطع
      const bounds: Bounds = {
        x: element.position.x,
        y: element.position.y,
        width: element.size.width,
        height: element.size.height
      };
      
      if (canvasKernel.pointInBounds(worldPoint, bounds)) {
        return element;
      }
    }
    
    return null;
  }

  /**
   * تحديد نوع الهدف من عنصر DOM
   */
  identifyTarget(target: HTMLElement): {
    type: 'element' | 'resize-handle' | 'bounding-box' | 'canvas';
    elementId?: string;
    handle?: string;
  } {
    // التحقق من مقبض تغيير الحجم
    if (target.hasAttribute('data-resize-handle')) {
      return {
        type: 'resize-handle',
        handle: target.getAttribute('data-resize-handle') || undefined
      };
    }
    
    // التحقق من BoundingBox
    if (target.closest('.bounding-box')) {
      return { type: 'bounding-box' };
    }
    
    // التحقق من عنصر كانفاس
    const elementContainer = target.closest('[data-element-id]');
    if (elementContainer) {
      return {
        type: 'element',
        elementId: elementContainer.getAttribute('data-element-id') || undefined
      };
    }
    
    const canvasElement = target.closest('[data-canvas-element="true"]');
    if (canvasElement) {
      // محاولة الحصول على الـ ID من الـ parent
      return { type: 'element' };
    }
    
    return { type: 'canvas' };
  }

  /**
   * إنشاء حدث تحديد من حدث DOM
   */
  createSelectionEvent(
    type: SelectionEventType,
    e: React.PointerEvent | React.MouseEvent | PointerEvent | MouseEvent,
    elementId?: string
  ): SelectionEvent {
    return {
      type,
      screenPoint: { x: e.clientX, y: e.clientY },
      elementId,
      modifiers: {
        shift: e.shiftKey,
        ctrl: e.ctrlKey,
        alt: e.altKey,
        meta: e.metaKey
      },
      originalEvent: e
    };
  }
}

// ============================================
// 📦 Singleton Export
// ============================================

export const selectionCoordinator = new SelectionCoordinator();

// ============================================
// 🪝 React Hook
// ============================================

import { useCallback, useRef } from 'react';

/**
 * ✅ المرحلة 1: Hook محسّن لاستخدام Selection Coordinator في المكونات
 */
export function useSelectionCoordinator() {
  const isProcessingRef = useRef(false);
  
  /**
   * ✅ معالجة حدث Pointer Down على عنصر
   */
  const handleElementPointerDown = useCallback((
    e: React.PointerEvent | React.MouseEvent,
    elementId: string,
    isSelected: boolean
  ): { action: 'selected' | 'deselected' | 'drag-ready' | 'resize' | 'passthrough'; handle?: string } => {
    const target = selectionCoordinator.identifyTarget(e.target as HTMLElement);
    
    // إذا كان مقبض تغيير الحجم
    if (target.type === 'resize-handle') {
      return { action: 'resize', handle: target.handle };
    }
    
    const modifiers = {
      shift: e.shiftKey,
      ctrl: e.ctrlKey,
      meta: e.metaKey
    };
    
    // ✅ استخدام المنطق المحسّن
    const result = selectionCoordinator.handleElementSelect(elementId, isSelected, modifiers);
    
    if (result.wasSelectionChanged) {
      if (isSelected && modifiers.shift) {
        return { action: 'deselected' };
      }
      if (result.shouldStartDrag) {
        return { action: 'selected' };
      }
    }
    
    // العنصر محدد بالفعل - جاهز للسحب من BoundingBox
    return { action: 'drag-ready' };
  }, []);
  
  /**
   * معالجة حدث Pointer Down على الكانفاس
   */
  const handleCanvasPointerDown = useCallback((
    e: React.PointerEvent | React.MouseEvent,
    containerRect: DOMRect | null
  ): { action: 'box-select' | 'passthrough' | 'none' } => {
    const target = selectionCoordinator.identifyTarget(e.target as HTMLElement);
    
    // إذا كان على عنصر أو BoundingBox، تجاهل
    if (target.type === 'element' || target.type === 'bounding-box') {
      return { action: 'passthrough' };
    }
    
    const event = selectionCoordinator.createSelectionEvent('box-select-start', e);
    
    // حساب World Point إذا توفر الـ container
    if (containerRect) {
      const { viewport } = useCanvasStore.getState();
      event.worldPoint = canvasKernel.screenToWorld(
        e.clientX,
        e.clientY,
        viewport,
        containerRect
      );
    }
    
    // بدء Box Select
    if (selectionCoordinator.handleBoxSelectStart(event)) {
      return { action: 'box-select' };
    }
    
    return { action: 'none' };
  }, []);
  
  /**
   * معالجة إنهاء الأحداث
   */
  const handlePointerUp = useCallback(() => {
    selectionCoordinator.handleEventEnd();
  }, []);
  
  /**
   * ✅ التحقق من إمكانية بدء السحب
   */
  const canStartDrag = useCallback(() => {
    return !selectionCoordinator.isLocked() || 
           selectionCoordinator.canProcessEvent('bounding-box-drag');
  }, []);
  
  return {
    handleElementPointerDown,
    handleCanvasPointerDown,
    handlePointerUp,
    canStartDrag,
    isLocked: () => selectionCoordinator.isLocked(),
    getActiveEvent: () => selectionCoordinator.getActiveEvent(),
    coordinator: selectionCoordinator
  };
}
