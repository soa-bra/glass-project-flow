/**
 * Selection Slice - إدارة التحديد والحافظة
 * ✅ المرحلة 1: Deep Clone + Paste at Position + Fixed Types
 * ✅ المرحلة 2: Smart Offset محسّن + Overlap Detection
 */

import { StateCreator } from 'zustand';
import type { CanvasElement, LayerInfo } from '@/types/canvas';

// نوع الـ Store الكامل لتجنب any
type CanvasStoreState = SelectionSlice & {
  elements: CanvasElement[];
  layers: LayerInfo[];
  viewport: { zoom: number; pan: { x: number; y: number } };
  addElement: (element: Omit<CanvasElement, 'id'> & { id?: string }) => void;
  deleteElements: (elementIds: string[]) => void;
  pushHistory: () => void;
};

export interface SelectionSlice {
  selectedElementIds: string[];
  clipboard: CanvasElement[];
  
  // Selection Actions
  selectElement: (elementId: string, multiSelect?: boolean) => void;
  selectElements: (elementIds: string[]) => void;
  clearSelection: () => void;
  
  // Clipboard Actions
  copyElements: (elementIds: string[]) => void;
  pasteElements: (position?: { x: number; y: number }) => void;
  cutElements: (elementIds: string[]) => void;
}

// ✅ تتبع آخر موقع لصق لتجنب التراكم
let lastPastePosition: { x: number; y: number } | null = null;
let consecutivePasteCount = 0;

// ✅ ثوابت قابلة للتعديل
const PASTE_OFFSET_BASE = 20; // الإزاحة الأساسية بين العناصر الملصقة
const PASTE_OFFSET_INCREMENT = 15; // زيادة الإزاحة لكل لصق متتالي
const OVERLAP_DETECTION_THRESHOLD = 5; // حد التراكب (بالبكسل)

/**
 * Deep clone عنصر كانفاس بشكل كامل
 */
function deepCloneElement(element: CanvasElement): CanvasElement {
  try {
    return structuredClone(element);
  } catch {
    return JSON.parse(JSON.stringify(element));
  }
}

/**
 * حساب مركز viewport الحالي في World Space
 */
function getViewportCenter(viewport: { zoom: number; pan: { x: number; y: number } }): { x: number; y: number } {
  const screenCenterX = window.innerWidth / 2;
  const screenCenterY = window.innerHeight / 2;
  
  const worldX = (screenCenterX - viewport.pan.x) / viewport.zoom;
  const worldY = (screenCenterY - viewport.pan.y) / viewport.zoom;
  
  return { x: worldX, y: worldY };
}

/**
 * حساب مركز مجموعة عناصر
 */
function getElementsCenter(elements: CanvasElement[]): { x: number; y: number } {
  if (elements.length === 0) return { x: 0, y: 0 };
  
  const bounds = elements.reduce(
    (acc, el) => ({
      minX: Math.min(acc.minX, el.position.x),
      minY: Math.min(acc.minY, el.position.y),
      maxX: Math.max(acc.maxX, el.position.x + el.size.width),
      maxY: Math.max(acc.maxY, el.position.y + el.size.height),
    }),
    { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
  );
  
  return {
    x: (bounds.minX + bounds.maxX) / 2,
    y: (bounds.minY + bounds.maxY) / 2,
  };
}

/**
 * حساب أبعاد مجموعة عناصر
 */
function getElementsBounds(elements: CanvasElement[]): { width: number; height: number } {
  if (elements.length === 0) return { width: 0, height: 0 };
  
  const bounds = elements.reduce(
    (acc, el) => ({
      minX: Math.min(acc.minX, el.position.x),
      minY: Math.min(acc.minY, el.position.y),
      maxX: Math.max(acc.maxX, el.position.x + el.size.width),
      maxY: Math.max(acc.maxY, el.position.y + el.size.height),
    }),
    { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
  );
  
  return {
    width: bounds.maxX - bounds.minX,
    height: bounds.maxY - bounds.minY,
  };
}

/**
 * ✅ التحقق من وجود تراكب مع عناصر موجودة
 */
function hasOverlapWithExisting(
  proposedPosition: { x: number; y: number },
  clipboardBounds: { width: number; height: number },
  existingElements: CanvasElement[]
): boolean {
  const proposedBounds = {
    x: proposedPosition.x - clipboardBounds.width / 2,
    y: proposedPosition.y - clipboardBounds.height / 2,
    width: clipboardBounds.width,
    height: clipboardBounds.height,
  };

  return existingElements.some((el) => {
    const elementBounds = {
      x: el.position.x,
      y: el.position.y,
      width: el.size.width,
      height: el.size.height,
    };

    // التحقق من التراكب
    return !(
      proposedBounds.x + proposedBounds.width < elementBounds.x - OVERLAP_DETECTION_THRESHOLD ||
      proposedBounds.x > elementBounds.x + elementBounds.width + OVERLAP_DETECTION_THRESHOLD ||
      proposedBounds.y + proposedBounds.height < elementBounds.y - OVERLAP_DETECTION_THRESHOLD ||
      proposedBounds.y > elementBounds.y + elementBounds.height + OVERLAP_DETECTION_THRESHOLD
    );
  });
}

/**
 * ✅ إيجاد موقع لصق ذكي يتجنب التراكب
 */
function findSmartPastePosition(
  basePosition: { x: number; y: number },
  clipboardBounds: { width: number; height: number },
  existingElements: CanvasElement[]
): { x: number; y: number } {
  // إذا لم يكن هناك تراكب، استخدم الموقع الأساسي
  if (!hasOverlapWithExisting(basePosition, clipboardBounds, existingElements)) {
    return basePosition;
  }

  // محاولة إيجاد موقع خالي بالتحرك بشكل حلزوني
  const directions = [
    { dx: 1, dy: 0 },   // يمين
    { dx: 1, dy: 1 },   // أسفل يمين
    { dx: 0, dy: 1 },   // أسفل
    { dx: -1, dy: 1 },  // أسفل يسار
    { dx: -1, dy: 0 },  // يسار
    { dx: -1, dy: -1 }, // أعلى يسار
    { dx: 0, dy: -1 },  // أعلى
    { dx: 1, dy: -1 },  // أعلى يمين
  ];

  const step = PASTE_OFFSET_BASE;
  
  for (let distance = 1; distance <= 10; distance++) {
    for (const dir of directions) {
      const testPosition = {
        x: basePosition.x + dir.dx * step * distance,
        y: basePosition.y + dir.dy * step * distance,
      };
      
      if (!hasOverlapWithExisting(testPosition, clipboardBounds, existingElements)) {
        return testPosition;
      }
    }
  }

  // إذا لم نجد موقعاً خالياً، استخدم offset بسيط
  return {
    x: basePosition.x + PASTE_OFFSET_BASE * 5,
    y: basePosition.y + PASTE_OFFSET_BASE * 5,
  };
}

export const createSelectionSlice: StateCreator<
  CanvasStoreState,
  [],
  [],
  SelectionSlice
> = (set, get) => ({
  selectedElementIds: [],
  clipboard: [],
  
  selectElement: (elementId, multiSelect = false) => {
    set((state) => {
      if (multiSelect) {
        const isSelected = state.selectedElementIds.includes(elementId);
        const newSelection = isSelected
          ? state.selectedElementIds.filter((id) => id !== elementId)
          : [...state.selectedElementIds, elementId];
        
        return { selectedElementIds: Array.from(new Set(newSelection)) };
      }
      
      return { selectedElementIds: [elementId] };
    });
  },
  
  selectElements: (elementIds) => {
    set({ selectedElementIds: elementIds });
  },
  
  clearSelection: () => {
    set({ selectedElementIds: [] });
  },
  
  /**
   * نسخ عناصر محددة للـ clipboard
   * ✅ يستخدم Deep Clone لتجنب المراجع المشتركة
   */
  copyElements: (elementIds) => {
    const elements = get().elements.filter((el) => elementIds.includes(el.id));
    
    // ✅ Deep clone لكل عنصر
    const clonedElements = elements.map(deepCloneElement);
    
    set({ clipboard: clonedElements });
    
    // ✅ إعادة تعيين متتبع اللصق عند النسخ
    lastPastePosition = null;
    consecutivePasteCount = 0;
  },
  
  /**
   * لصق العناصر من الـ clipboard
   * ✅ المرحلة 2: Smart Offset محسّن + Overlap Detection
   */
  pasteElements: (position) => {
    const clipboard = get().clipboard;
    if (clipboard.length === 0) return;
    
    const viewport = get().viewport;
    const existingElements = get().elements;
    
    // حساب مركز العناصر المنسوخة وأبعادها
    const clipboardCenter = getElementsCenter(clipboard);
    const clipboardBounds = getElementsBounds(clipboard);
    
    // ✅ تحديد موقع اللصق الأساسي
    let basePosition: { x: number; y: number };
    
    if (position) {
      // لصق في الموقع المحدد (مثلاً من context menu)
      basePosition = position;
      // إعادة تعيين العداد عند اللصق في موقع جديد
      consecutivePasteCount = 0;
    } else {
      // لصق في مركز الشاشة الحالي
      const viewportCenter = getViewportCenter(viewport);
      
      // ✅ التحقق من اللصق المتتالي في نفس المكان
      if (
        lastPastePosition &&
        Math.abs(lastPastePosition.x - viewportCenter.x) < 50 &&
        Math.abs(lastPastePosition.y - viewportCenter.y) < 50
      ) {
        // لصق متتالي - زيادة الإزاحة
        consecutivePasteCount++;
        const offset = PASTE_OFFSET_BASE + PASTE_OFFSET_INCREMENT * consecutivePasteCount;
        basePosition = {
          x: viewportCenter.x + offset,
          y: viewportCenter.y + offset,
        };
      } else {
        // لصق في موقع جديد
        consecutivePasteCount = 0;
        basePosition = viewportCenter;
      }
    }
    
    // ✅ إيجاد موقع ذكي يتجنب التراكب
    const smartPosition = findSmartPastePosition(
      basePosition,
      clipboardBounds,
      existingElements
    );
    
    // حفظ آخر موقع لصق
    lastPastePosition = smartPosition;
    
    // حساب الإزاحة اللازمة
    const offsetX = smartPosition.x - clipboardCenter.x;
    const offsetY = smartPosition.y - clipboardCenter.y;
    
    // إنشاء العناصر الجديدة
    clipboard.forEach((el) => {
      const copy = deepCloneElement(el);
      delete (copy as any).id;
      
      copy.position = {
        x: el.position.x + offsetX,
        y: el.position.y + offsetY,
      };
      
      get().addElement(copy);
    });
    
    // تحديد العناصر الجديدة الملصقة
    const allElements = get().elements;
    const pastedElements = allElements.slice(-clipboard.length);
    set({ selectedElementIds: pastedElements.map((el) => el.id) });
  },
  
  /**
   * قص العناصر (نسخ + حذف)
   */
  cutElements: (elementIds) => {
    get().copyElements(elementIds);
    get().deleteElements(elementIds);
    
    // إعادة تعيين متتبع اللصق عند القص
    lastPastePosition = null;
    consecutivePasteCount = 0;
  },
});
