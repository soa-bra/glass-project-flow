/**
 * Frame Slice - إدارة الإطارات المتقدمة
 * يدعم: Hybrid Containment, إنشاء من التحديد, فصل يدوي
 */

import { StateCreator } from 'zustand';
import type { CanvasElement } from '@/types/canvas';
import { toast } from 'sonner';

// أنواع أوضاع الاحتواء
export type ContainmentMode = 'explicit' | 'spatial' | 'hybrid';

export interface FrameSlice {
  // Frame Management
  addChildToFrame: (frameId: string, childId: string) => void;
  removeChildFromFrame: (frameId: string, childId: string) => void;
  getFrameChildren: (frameId: string) => CanvasElement[];
  assignElementsToFrame: (frameId: string, mode?: ContainmentMode) => void;
  moveFrame: (frameId: string, dx: number, dy: number) => void;
  resizeFrame: (frameId: string, newBounds: { x: number; y: number; width: number; height: number }) => void;
  ungroupFrame: (frameId: string) => void;
  updateFrameTitle: (frameId: string, newTitle: string) => void;
  // ✅ دوال جديدة
  createFrameFromSelection: () => void;
  detachElementFromFrame: (elementId: string) => void;
  getElementParentFrame: (elementId: string) => CanvasElement | null;
}

export const createFrameSlice: StateCreator<
  any,
  [],
  [],
  FrameSlice
> = (set, get) => ({
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

  assignElementsToFrame: (frameId, mode: ContainmentMode = 'hybrid') => {
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
      // تجاهل الإطار نفسه والإطارات الأخرى
      if (el.id === frameId || el.type === 'frame') return;
      
      // حساب نسبة التداخل
      const overlapX = Math.max(0, 
        Math.min(el.position.x + el.size.width, frameRect.x + frameRect.width) - 
        Math.max(el.position.x, frameRect.x)
      );
      const overlapY = Math.max(0, 
        Math.min(el.position.y + el.size.height, frameRect.y + frameRect.height) - 
        Math.max(el.position.y, frameRect.y)
      );
      const overlapArea = overlapX * overlapY;
      const elementArea = el.size.width * el.size.height;
      const overlapPercentage = elementArea > 0 ? overlapArea / elementArea : 0;
      
      // مركز العنصر
      const centerX = el.position.x + el.size.width / 2;
      const centerY = el.position.y + el.size.height / 2;
      const isCenterInside = (
        centerX >= frameRect.x &&
        centerX <= frameRect.x + frameRect.width &&
        centerY >= frameRect.y &&
        centerY <= frameRect.y + frameRect.height
      );
      
      let shouldInclude = false;
      
      switch (mode) {
        case 'spatial':
          // Spatial: مركز العنصر داخل الإطار
          shouldInclude = isCenterInside;
          break;
        case 'hybrid':
          // Hybrid: 50%+ من العنصر داخل الإطار أو مركزه داخل
          shouldInclude = overlapPercentage >= 0.5 || isCenterInside;
          break;
        case 'explicit':
          // Explicit: فقط العناصر المضافة يدوياً (لا تضيف تلقائياً)
          shouldInclude = false;
          break;
      }
      
      if (shouldInclude) {
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
    
    const childIds = (frame as any).children || [];
    
    set((state: any) => ({
      elements: state.elements.map((el: CanvasElement) => {
        if (el.id === frameId || childIds.includes(el.id)) {
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

  resizeFrame: (frameId, newBounds) => {
    const state = get();
    const frame = state.elements.find((el: CanvasElement) => el.id === frameId);
    if (!frame || frame.type !== 'frame') return;
    
    const oldBounds = {
      x: frame.position.x,
      y: frame.position.y,
      width: frame.size.width,
      height: frame.size.height
    };
    
    const scaleX = newBounds.width / oldBounds.width;
    const scaleY = newBounds.height / oldBounds.height;
    
    const childIds = (frame as any).children || [];
    
    set((state: any) => ({
      elements: state.elements.map((el: CanvasElement) => {
        if (el.id === frameId) {
          return {
            ...el,
            position: { x: newBounds.x, y: newBounds.y },
            size: { width: newBounds.width, height: newBounds.height }
          };
        }
        
        if (childIds.includes(el.id)) {
          const relativeX = el.position.x - oldBounds.x;
          const relativeY = el.position.y - oldBounds.y;
          
          return {
            ...el,
            position: {
              x: newBounds.x + relativeX * scaleX,
              y: newBounds.y + relativeY * scaleY
            },
            size: {
              width: el.size.width * scaleX,
              height: el.size.height * scaleY
            }
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
  },

  // ✅ إنشاء إطار من العناصر المحددة
  createFrameFromSelection: () => {
    const state = get();
    const { selectedElementIds, elements, addElement, selectElements } = state;
    
    if (selectedElementIds.length < 1) {
      toast.error('يرجى تحديد عنصر واحد على الأقل');
      return;
    }
    
    const selectedElements = elements.filter((el: CanvasElement) => 
      selectedElementIds.includes(el.id) && el.type !== 'frame'
    );
    
    if (selectedElements.length === 0) {
      toast.error('لا يمكن إنشاء إطار من إطارات أخرى');
      return;
    }
    
    // حساب الحدود المجمّعة
    const bounds = {
      minX: Math.min(...selectedElements.map((el: CanvasElement) => el.position.x)),
      minY: Math.min(...selectedElements.map((el: CanvasElement) => el.position.y)),
      maxX: Math.max(...selectedElements.map((el: CanvasElement) => el.position.x + el.size.width)),
      maxY: Math.max(...selectedElements.map((el: CanvasElement) => el.position.y + el.size.height))
    };
    
    const padding = 24;
    
    // إنشاء الإطار الجديد
    const frameId = `frame_${Date.now()}`;
    addElement({
      id: frameId,
      type: 'frame',
      position: { x: bounds.minX - padding, y: bounds.minY - padding },
      size: { 
        width: bounds.maxX - bounds.minX + padding * 2, 
        height: bounds.maxY - bounds.minY + padding * 2 
      },
      title: 'إطار جديد',
      children: selectedElements.map((el: CanvasElement) => el.id),
      strokeWidth: 2,
      strokeColor: '#0B0F12',
      style: {}
    });
    
    // تحديد الإطار الجديد
    selectElements([frameId]);
    
    toast.success(`تم إنشاء إطار يحتوي على ${selectedElements.length} عنصر`);
    get().pushHistory();
  },

  // ✅ فصل عنصر عن الإطار بدون تحريكه
  detachElementFromFrame: (elementId: string) => {
    set((state: any) => ({
      elements: state.elements.map((el: CanvasElement) => {
        if (el.type === 'frame') {
          const children = (el as any).children || [];
          if (children.includes(elementId)) {
            return { ...el, children: children.filter((id: string) => id !== elementId) };
          }
        }
        return el;
      })
    }));
    toast.success('تم فصل العنصر عن الإطار');
    get().pushHistory();
  },

  // ✅ الحصول على الإطار الأب لعنصر
  getElementParentFrame: (elementId: string): CanvasElement | null => {
    const state = get();
    return state.elements.find((el: CanvasElement) => {
      if (el.type !== 'frame') return false;
      const children = (el as any).children || [];
      return children.includes(elementId);
    }) || null;
  }
});
