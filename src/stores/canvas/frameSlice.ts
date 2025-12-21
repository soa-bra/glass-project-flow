/**
 * Frame Slice - إدارة الإطارات
 */

import { StateCreator } from 'zustand';
import type { CanvasElement } from '@/types/canvas';

export interface FrameSlice {
  // Frame Management
  addChildToFrame: (frameId: string, childId: string) => void;
  removeChildFromFrame: (frameId: string, childId: string) => void;
  getFrameChildren: (frameId: string) => CanvasElement[];
  assignElementsToFrame: (frameId: string) => void;
  moveFrame: (frameId: string, dx: number, dy: number) => void;
  resizeFrame: (frameId: string, newBounds: { x: number; y: number; width: number; height: number }) => void;
  ungroupFrame: (frameId: string) => void;
  updateFrameTitle: (frameId: string, newTitle: string) => void;
  
  // Drag & Drop Tracking
  hoveredFrameId: string | null;
  draggedElementIds: string[];
  setHoveredFrame: (id: string | null) => void;
  setDraggedElements: (ids: string[]) => void;
  findFrameAtPoint: (x: number, y: number, excludeIds?: string[]) => CanvasElement | null;
}

export const createFrameSlice: StateCreator<
  any,
  [],
  [],
  FrameSlice
> = (set, get) => ({
  // Drag & Drop Tracking State
  hoveredFrameId: null,
  draggedElementIds: [],
  
  setHoveredFrame: (id) => {
    set({ hoveredFrameId: id });
  },
  
  setDraggedElements: (ids) => {
    set({ draggedElementIds: ids });
  },
  
  findFrameAtPoint: (x, y, excludeIds = []) => {
    const state = get();
    const frames = state.elements.filter(
      (el: CanvasElement) => el.type === 'frame' && !excludeIds.includes(el.id)
    );
    
    // البحث من الأعلى للأسفل (العنصر الأعلى z-index أولاً)
    for (let i = frames.length - 1; i >= 0; i--) {
      const frame = frames[i];
      const isInside = (
        x >= frame.position.x &&
        x <= frame.position.x + frame.size.width &&
        y >= frame.position.y &&
        y <= frame.position.y + frame.size.height
      );
      
      if (isInside) {
        return frame;
      }
    }
    
    return null;
  },

  addChildToFrame: (frameId, childId) => {
    set((state: any) => ({
      elements: state.elements.map((el: CanvasElement) => {
        if (el.id === frameId && el.type === 'frame') {
          const children = (el as any).children || [];
          if (!children.includes(childId)) {
            return { ...el, children: [...children, childId] };
          }
        }
        return el;
      })
    }));
  },

  removeChildFromFrame: (frameId, childId) => {
    set((state: any) => ({
      elements: state.elements.map((el: CanvasElement) => {
        if (el.id === frameId && el.type === 'frame') {
          const children = (el as any).children || [];
          return { ...el, children: children.filter((id: string) => id !== childId) };
        }
        return el;
      })
    }));
  },

  getFrameChildren: (frameId) => {
    const state = get();
    const frame = state.elements.find((el: CanvasElement) => el.id === frameId && el.type === 'frame');
    if (!frame) return [];
    const childIds = (frame as any).children || [];
    return state.elements.filter((el: CanvasElement) => childIds.includes(el.id));
  },

  assignElementsToFrame: (frameId) => {
    const state = get();
    const frame = state.elements.find((el: CanvasElement) => el.id === frameId && el.type === 'frame');
    if (!frame) return;
    
    const frameRect = {
      x: frame.position.x,
      y: frame.position.y,
      width: frame.size.width,
      height: frame.size.height
    };
    
    const childrenIds: string[] = [];
    
    state.elements.forEach((el: CanvasElement) => {
      if (el.id === frameId) return;
      
      const isFullyInside = (
        el.position.x >= frameRect.x &&
        el.position.y >= frameRect.y &&
        el.position.x + el.size.width <= frameRect.x + frameRect.width &&
        el.position.y + el.size.height <= frameRect.y + frameRect.height
      );
      
      if (isFullyInside) {
        childrenIds.push(el.id);
      }
    });
    
    set((state: any) => ({
      elements: state.elements.map((el: CanvasElement) =>
        el.id === frameId ? { ...el, children: childrenIds } : el
      )
    }));
  },

  moveFrame: (frameId, dx, dy) => {
    const state = get();
    const frame = state.elements.find((el: CanvasElement) => el.id === frameId);
    if (!frame || frame.type !== 'frame') return;
    
    // ✅ أولاً: مزامنة الأطفال قبل التحريك (تحديث children بناءً على الموقع الحالي)
    const frameRect = {
      x: frame.position.x,
      y: frame.position.y,
      width: frame.size.width,
      height: frame.size.height
    };
    
    const updatedChildIds: string[] = [];
    state.elements.forEach((el: CanvasElement) => {
      if (el.id === frameId || el.type === 'frame') return;
      
      const isFullyInside = (
        el.position.x >= frameRect.x &&
        el.position.y >= frameRect.y &&
        el.position.x + el.size.width <= frameRect.x + frameRect.width &&
        el.position.y + el.size.height <= frameRect.y + frameRect.height
      );
      
      if (isFullyInside) {
        updatedChildIds.push(el.id);
      }
    });
    
    // ✅ ثانياً: تحريك الإطار والأطفال المحدثين معاً
    set((state: any) => ({
      elements: state.elements.map((el: CanvasElement) => {
        // تحديث children للإطار
        if (el.id === frameId) {
          return {
            ...el,
            children: updatedChildIds,
            position: {
              x: el.position.x + dx,
              y: el.position.y + dy
            }
          };
        }
        // تحريك الأطفال
        if (updatedChildIds.includes(el.id)) {
          return {
            ...el,
            position: {
              x: el.position.x + dx,
              y: el.position.y + dy
            }
          };
        }
        return el;
      })
    }));
    
    get().pushHistory();
  },

  // ✅ تغيير حجم الإطار فقط بدون تغيير حجم أو موقع الأطفال
  resizeFrame: (frameId, newBounds) => {
    const state = get();
    const frame = state.elements.find((el: CanvasElement) => el.id === frameId);
    if (!frame || frame.type !== 'frame') return;
    
    // ✅ تغيير حجم الإطار فقط - الأطفال يبقون كما هم
    set((state: any) => ({
      elements: state.elements.map((el: CanvasElement) => {
        if (el.id === frameId) {
          return {
            ...el,
            position: { x: newBounds.x, y: newBounds.y },
            size: { width: newBounds.width, height: newBounds.height }
          };
        }
        return el;
      })
    }));
    
    get().pushHistory();
  },

  ungroupFrame: (frameId) => {
    set((state: any) => ({
      elements: state.elements.map((el: CanvasElement) =>
        el.id === frameId ? { ...el, children: [] } : el
      )
    }));
    get().pushHistory();
  },

  updateFrameTitle: (frameId, newTitle) => {
    set((state: any) => ({
      elements: state.elements.map((el: CanvasElement) =>
        el.id === frameId && el.type === 'frame'
          ? { ...el, title: newTitle }
          : el
      )
    }));
    get().pushHistory();
  }
});
