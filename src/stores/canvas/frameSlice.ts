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
  }
});
