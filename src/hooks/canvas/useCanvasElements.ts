import { useCallback, useMemo } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { CanvasElement } from '@/types/canvas';
import { nanoid } from 'nanoid';

interface UseCanvasElementsOptions {
  defaultElementSize?: { width: number; height: number };
}

/**
 * هوك لإدارة عناصر الكانفاس (إضافة، حذف، تحديث، تحديد)
 */
export function useCanvasElements(options: UseCanvasElementsOptions = {}) {
  const { defaultElementSize = { width: 200, height: 100 } } = options;

  const elements = useCanvasStore(state => state.elements);
  const selectedElementIds = useCanvasStore(state => state.selectedElementIds);
  const addElement = useCanvasStore(state => state.addElement);
  const updateElement = useCanvasStore(state => state.updateElement);
  const deleteElement = useCanvasStore(state => state.deleteElement);
  const selectElement = useCanvasStore(state => state.selectElement);
  const clearSelection = useCanvasStore(state => state.clearSelection);
  const moveElements = useCanvasStore(state => state.moveElements);

  // العناصر المحددة
  const selectedElements = useMemo(() => {
    return elements.filter(el => selectedElementIds.includes(el.id));
  }, [elements, selectedElementIds]);

  // إنشاء عنصر جديد
  const createElement = useCallback((
    type: string,
    position: { x: number; y: number },
    overrides: Partial<CanvasElement> = {}
  ) => {
    const newElement: Omit<CanvasElement, 'id'> = {
      type,
      position,
      size: overrides.size || defaultElementSize,
      style: overrides.style || {},
      content: overrides.content || '',
      visible: true,
      locked: false,
      layer: elements.length,
      ...overrides
    };

    addElement(newElement);
    return newElement;
  }, [elements.length, defaultElementSize, addElement]);

  // نسخ العناصر المحددة
  const duplicateSelected = useCallback(() => {
    const offset = 20;
    const newElements: Omit<CanvasElement, 'id'>[] = [];

    selectedElements.forEach(element => {
      const newElement: Omit<CanvasElement, 'id'> = {
        ...element,
        position: {
          x: element.position.x + offset,
          y: element.position.y + offset
        }
      };
      addElement(newElement);
      newElements.push(newElement);
    });

    return newElements;
  }, [selectedElements, addElement]);

  // حذف العناصر المحددة
  const deleteSelected = useCallback(() => {
    selectedElementIds.forEach(id => deleteElement(id));
    clearSelection();
  }, [selectedElementIds, deleteElement, clearSelection]);

  // تحريك العناصر المحددة
  const moveSelected = useCallback((deltaX: number, deltaY: number) => {
    if (selectedElementIds.length === 0) return;
    moveElements(selectedElementIds, deltaX, deltaY);
  }, [selectedElementIds, moveElements]);

  // تحديث نمط العناصر المحددة
  const updateSelectedStyle = useCallback((style: Record<string, unknown>) => {
    selectedElementIds.forEach(id => {
      const element = elements.find(el => el.id === id);
      if (element) {
        updateElement(id, {
          style: { ...element.style, ...style }
        });
      }
    });
  }, [selectedElementIds, elements, updateElement]);

  // تحديد الكل
  const selectAll = useCallback(() => {
    elements.forEach(el => selectElement(el.id));
  }, [elements, selectElement]);

  // إلغاء التحديد عن عنصر معين
  const deselectElement = useCallback((elementId: string) => {
    // يمكن استخدام selectElement مع multi-select=false لتبديل التحديد
    // أو clearSelection ثم إعادة تحديد العناصر الأخرى
    const newSelection = selectedElementIds.filter(id => id !== elementId);
    clearSelection();
    newSelection.forEach(id => selectElement(id, true));
  }, [selectedElementIds, clearSelection, selectElement]);

  // التحقق من وجود عنصر في نقطة معينة
  const getElementAtPoint = useCallback((x: number, y: number): CanvasElement | null => {
    // البحث من الأعلى للأسفل (الطبقات العليا أولاً)
    const sortedElements = [...elements].sort((a, b) => (b.layer || 0) - (a.layer || 0));
    
    for (const element of sortedElements) {
      if (!element.visible) continue;
      
      const { position, size } = element;
      if (
        x >= position.x &&
        x <= position.x + size.width &&
        y >= position.y &&
        y <= position.y + size.height
      ) {
        return element;
      }
    }
    
    return null;
  }, [elements]);

  // الحصول على العناصر داخل منطقة معينة
  const getElementsInBounds = useCallback((bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  }): CanvasElement[] => {
    return elements.filter(element => {
      if (!element.visible) return false;
      
      const { position, size } = element;
      const elementRight = position.x + size.width;
      const elementBottom = position.y + size.height;
      const boundsRight = bounds.x + bounds.width;
      const boundsBottom = bounds.y + bounds.height;

      // التحقق من التقاطع
      return !(
        position.x > boundsRight ||
        elementRight < bounds.x ||
        position.y > boundsBottom ||
        elementBottom < bounds.y
      );
    });
  }, [elements]);

  return {
    // البيانات
    elements,
    selectedElements,
    selectedElementIds,
    
    // العمليات على العناصر
    createElement,
    updateElement,
    deleteElement,
    duplicateSelected,
    deleteSelected,
    moveSelected,
    updateSelectedStyle,
    
    // التحديد
    selectElement,
    deselectElement,
    clearSelection,
    selectAll,
    
    // الاستعلامات
    getElementAtPoint,
    getElementsInBounds
  };
}

export default useCanvasElements;
