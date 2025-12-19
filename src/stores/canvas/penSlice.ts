/**
 * Pen Slice - إدارة أداة القلم والمسارات
 */

import { StateCreator } from 'zustand';
import { nanoid } from 'nanoid';
import { PenStroke, PenSettings, PenPoint } from './types';

export interface PenSlice {
  strokes: Record<string, PenStroke>;
  currentStrokeId?: string;
  
  // Pen Actions
  setPenSettings: (partial: Partial<PenSettings>) => void;
  toggleSmartMode: () => void;
  beginStroke: (x: number, y: number, pressure?: number) => string;
  appendPoint: (x: number, y: number, pressure?: number) => void;
  endStroke: () => void;
  clearPendingStroke: () => void;
  clearAllStrokes: () => void;
  removeStroke: (strokeId: string) => void;
  eraseStrokeAtPoint: (x: number, y: number, radius?: number) => boolean;
}

export const createPenSlice: StateCreator<
  any,
  [],
  [],
  PenSlice
> = (set, get) => ({
  strokes: {},
  currentStrokeId: undefined,
  
  setPenSettings: (partial) => {
    set((state: any) => ({
      toolSettings: {
        ...state.toolSettings,
        pen: { ...state.toolSettings.pen, ...partial }
      }
    }));
  },
  
  toggleSmartMode: () => {
    set((state: any) => ({
      toolSettings: {
        ...state.toolSettings,
        pen: { ...state.toolSettings.pen, smartMode: !state.toolSettings.pen.smartMode }
      }
    }));
  },
  
  beginStroke: (x, y, pressure = 0.5) => {
    const id = nanoid();
    const { toolSettings } = get();
    const now = performance.now();
    
    const newStroke: PenStroke = {
      id,
      points: [{ x, y, pressure, t: now }],
      color: toolSettings.pen.color,
      width: toolSettings.pen.strokeWidth,
      style: toolSettings.pen.style
    };
    
    set((state: any) => ({
      strokes: { ...state.strokes, [id]: newStroke },
      currentStrokeId: id
    }));
    
    return id;
  },
  
  appendPoint: (x, y, pressure = 0.5) => {
    const { currentStrokeId, strokes } = get();
    if (!currentStrokeId) return;
    
    const stroke = strokes[currentStrokeId];
    if (!stroke) return;
    
    const now = performance.now();
    
    set((state: any) => ({
      strokes: {
        ...state.strokes,
        [currentStrokeId]: {
          ...stroke,
          points: [...stroke.points, { x, y, pressure, t: now }]
        }
      }
    }));
  },
  
  endStroke: () => {
    const { currentStrokeId, strokes } = get();
    if (!currentStrokeId) return;
    
    const stroke = strokes[currentStrokeId];
    if (stroke && stroke.points.length >= 2) {
      const xs = stroke.points.map((p: PenPoint) => p.x);
      const ys = stroke.points.map((p: PenPoint) => p.y);
      const bbox = {
        x: Math.min(...xs),
        y: Math.min(...ys),
        w: Math.max(...xs) - Math.min(...xs),
        h: Math.max(...ys) - Math.min(...ys)
      };
      
      set((state: any) => ({
        strokes: {
          ...state.strokes,
          [currentStrokeId]: { ...stroke, bbox }
        },
        currentStrokeId: undefined
      }));
    } else {
      set((state: any) => {
        const { [currentStrokeId]: _, ...remainingStrokes } = state.strokes;
        return {
          strokes: remainingStrokes,
          currentStrokeId: undefined
        };
      });
    }
  },
  
  clearPendingStroke: () => {
    const { currentStrokeId } = get();
    if (!currentStrokeId) return;
    
    set((state: any) => {
      const { [currentStrokeId]: _, ...remainingStrokes } = state.strokes;
      return {
        strokes: remainingStrokes,
        currentStrokeId: undefined
      };
    });
  },
  
  clearAllStrokes: () => {
    set({ strokes: {}, currentStrokeId: undefined });
  },
  
  removeStroke: (strokeId) => {
    set((state: any) => {
      const { [strokeId]: _, ...remainingStrokes } = state.strokes;
      return { strokes: remainingStrokes };
    });
  },
  
  eraseStrokeAtPoint: (x, y, radius = 10) => {
    const { strokes } = get();
    
    for (const [strokeId, stroke] of Object.entries(strokes)) {
      for (const point of (stroke as PenStroke).points) {
        const distance = Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2));
        if (distance <= radius + (stroke as PenStroke).width / 2) {
          get().removeStroke(strokeId);
          return true;
        }
      }
    }
    return false;
  }
});
