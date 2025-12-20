/**
 * Selection Slice - إدارة التحديد والحافظة
 * ✅ المرحلة 1: Deep Clone + Paste at Position + Fixed Types
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

// ثابت لتتبع عدد اللصق وتجنب التراكم
let pasteCounter = 0;

/**
 * Deep clone عنصر كانفاس بشكل كامل
 */
function deepCloneElement(element: CanvasElement): CanvasElement {
  // استخدام structuredClone للنسخ العميق
  try {
    return structuredClone(element);
  } catch {
    // Fallback للبيئات التي لا تدعم structuredClone
    return JSON.parse(JSON.stringify(element));
  }
}

/**
 * حساب مركز viewport الحالي في World Space
 */
function getViewportCenter(viewport: { zoom: number; pan: { x: number; y: number } }): { x: number; y: number } {
  const screenCenterX = window.innerWidth / 2;
  const screenCenterY = window.innerHeight / 2;
  
  // تحويل من Screen Space إلى World Space
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
    
    // إعادة تعيين عداد اللصق عند النسخ
    pasteCounter = 0;
  },
  
  /**
   * لصق العناصر من الـ clipboard
   * ✅ يدعم اللصق في موقع محدد أو في مركز الشاشة
   * ✅ Smart offset لتجنب تراكم العناصر
   */
  pasteElements: (position) => {
    const clipboard = get().clipboard;
    if (clipboard.length === 0) return;
    
    const viewport = get().viewport;
    const newElementIds: string[] = [];
    
    // زيادة عداد اللصق للـ offset الذكي
    pasteCounter++;
    const smartOffset = pasteCounter * 20; // 20px لكل عملية لصق
    
    // تحديد موقع اللصق
    let targetPosition: { x: number; y: number };
    
    if (position) {
      // لصق في الموقع المحدد
      targetPosition = position;
    } else {
      // لصق في مركز الشاشة الحالي
      targetPosition = getViewportCenter(viewport);
    }
    
    // حساب مركز العناصر المنسوخة
    const clipboardCenter = getElementsCenter(clipboard);
    
    // حساب الإزاحة اللازمة
    const offsetX = targetPosition.x - clipboardCenter.x + smartOffset;
    const offsetY = targetPosition.y - clipboardCenter.y + smartOffset;
    
    clipboard.forEach((el) => {
      // Deep clone للعنصر
      const copy = deepCloneElement(el);
      
      // إزالة الـ id لإنشاء عنصر جديد
      delete (copy as any).id;
      
      // تطبيق الإزاحة
      copy.position = {
        x: el.position.x + offsetX,
        y: el.position.y + offsetY,
      };
      
      get().addElement(copy);
      
      // جمع الـ IDs الجديدة (addElement سيُنشئ id جديد)
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
    
    // إعادة تعيين عداد اللصق عند القص
    pasteCounter = 0;
  },
});
