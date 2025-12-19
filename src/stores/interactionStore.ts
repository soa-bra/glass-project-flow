/**
 * Interaction Store - إدارة حالة التفاعل المركزية
 * 
 * يستخدم State Machine لإدارة جميع حالات التفاعل في الكانفاس:
 * - idle: لا يوجد تفاعل نشط
 * - panning: تحريك الكاميرا
 * - dragging: سحب عناصر
 * - boxSelect: تحديد منطقة
 * - typing: الكتابة في محرر نص
 * - drawing: الرسم بأداة القلم
 * - connecting: ربط عناصر بموصل
 * - resizing: تغيير حجم عناصر
 * - rotating: تدوير عناصر
 */

import { create } from 'zustand';
import type { Point } from '@/core/canvasKernel';
import {
  type InteractionMode,
  type PanningMode,
  type DraggingMode,
  type BoxSelectMode,
  type TypingMode,
  type DrawingMode,
  type ConnectingMode,
  type ResizingMode,
  type RotatingMode,
  createIdleMode,
  createPanningMode,
  createDraggingMode,
  createBoxSelectMode,
  createTypingMode,
  createDrawingMode,
  createConnectingMode,
  createResizingMode,
  createRotatingMode,
  canTransition,
  getCursorForMode,
  shouldBlockToolShortcuts,
  shouldBlockSelection,
  requiresPointerCapture
} from '@/core/interactionStateMachine';
import type { ToolId } from '@/stores/canvasStore';

interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface InteractionState {
  // الحالة الحالية
  mode: InteractionMode;
  
  // المؤشر المناسب للحالة
  cursor: string;
  
  // ============= Actions =============
  
  // تعيين الحالة مباشرة (للحالات البسيطة)
  setMode: (mode: InteractionMode) => void;
  
  // محاولة الانتقال لحالة جديدة (مع التحقق من صلاحية الانتقال)
  transitionTo: (mode: InteractionMode) => boolean;
  
  // العودة للحالة الخاملة
  resetToIdle: () => void;
  
  // ============= Mode Starters =============
  
  // بدء التحريك
  startPanning: (startScreen: Point, startPan: Point) => void;
  
  // بدء السحب
  startDragging: (
    nodeIds: string[], 
    startWorld: Point, 
    startPositions: Map<string, Point>
  ) => void;
  
  // تحديث حالة السحب (عند تجاوز threshold)
  updateDragging: (isDragStarted: boolean) => void;
  
  // بدء تحديد المنطقة
  startBoxSelect: (startWorld: Point, additive?: boolean) => void;
  
  // تحديث موقع تحديد المنطقة
  updateBoxSelect: (currentWorld: Point) => void;
  
  // بدء الكتابة
  startTyping: (nodeId: string, editorId?: string) => void;
  
  // بدء الرسم
  startDrawing: (tool: ToolId, startWorld: Point, strokeId?: string) => void;
  
  // بدء التوصيل
  startConnecting: (
    sourceNodeId: string, 
    sourceAnchor: string, 
    currentWorld: Point
  ) => void;
  
  // تحديث موقع التوصيل
  updateConnecting: (
    currentWorld: Point, 
    hoveredNodeId?: string, 
    hoveredAnchor?: string
  ) => void;
  
  // بدء تغيير الحجم
  startResizing: (
    nodeIds: string[],
    handle: ResizingMode['handle'],
    startWorld: Point,
    startBounds: Map<string, Bounds>,
    aspectLocked?: boolean,
    fromCenter?: boolean
  ) => void;
  
  // بدء التدوير
  startRotating: (
    nodeIds: string[],
    centerWorld: Point,
    startAngle: number,
    startRotations: Map<string, number>
  ) => void;
  
  // ============= Helpers =============
  
  // هل يجب حظر اختصارات الأدوات؟
  shouldBlockShortcuts: () => boolean;
  
  // هل يجب حظر التحديد؟
  shouldBlockSelection: () => boolean;
  
  // هل الحالة تتطلب pointer capture؟
  requiresCapture: () => boolean;
  
  // الحصول على نوع الحالة الحالية
  getModeKind: () => InteractionMode['kind'];
  
  // هل نحن في حالة معينة؟
  isMode: (kind: InteractionMode['kind']) => boolean;
}

export const useInteractionStore = create<InteractionState>((set, get) => ({
  // الحالة الابتدائية
  mode: createIdleMode(),
  cursor: 'default',
  
  // ============= Actions Implementation =============
  
  setMode: (mode) => {
    set({ 
      mode, 
      cursor: getCursorForMode(mode) 
    });
  },
  
  transitionTo: (mode) => {
    const current = get().mode;
    
    if (canTransition(current, mode.kind)) {
      set({ 
        mode, 
        cursor: getCursorForMode(mode) 
      });
      return true;
    }
    
    console.warn(
      `[InteractionStore] Transition blocked: ${current.kind} -> ${mode.kind}`
    );
    return false;
  },
  
  resetToIdle: () => {
    set({ 
      mode: createIdleMode(), 
      cursor: 'default' 
    });
  },
  
  // ============= Mode Starters Implementation =============
  
  startPanning: (startScreen, startPan) => {
    const mode = createPanningMode(startScreen, startPan);
    get().transitionTo(mode);
  },
  
  startDragging: (nodeIds, startWorld, startPositions) => {
    const mode = createDraggingMode(nodeIds, startWorld, startPositions);
    get().transitionTo(mode);
  },
  
  updateDragging: (isDragStarted) => {
    const current = get().mode;
    if (current.kind !== 'dragging') return;
    
    set({
      mode: { ...current, isDragStarted } as DraggingMode
    });
  },
  
  startBoxSelect: (startWorld, additive = false) => {
    const mode = createBoxSelectMode(startWorld, additive);
    get().transitionTo(mode);
  },
  
  updateBoxSelect: (currentWorld) => {
    const current = get().mode;
    if (current.kind !== 'boxSelect') return;
    
    set({
      mode: { ...current, currentWorld } as BoxSelectMode
    });
  },
  
  startTyping: (nodeId, editorId) => {
    const mode = createTypingMode(nodeId, editorId);
    get().transitionTo(mode);
  },
  
  startDrawing: (tool, startWorld, strokeId) => {
    const mode = createDrawingMode(tool, startWorld, strokeId);
    get().transitionTo(mode);
  },
  
  startConnecting: (sourceNodeId, sourceAnchor, currentWorld) => {
    const mode = createConnectingMode(sourceNodeId, sourceAnchor, currentWorld);
    get().transitionTo(mode);
  },
  
  updateConnecting: (currentWorld, hoveredNodeId, hoveredAnchor) => {
    const current = get().mode;
    if (current.kind !== 'connecting') return;
    
    set({
      mode: { 
        ...current, 
        currentWorld, 
        hoveredNodeId, 
        hoveredAnchor 
      } as ConnectingMode
    });
  },
  
  startResizing: (nodeIds, handle, startWorld, startBounds, aspectLocked = false, fromCenter = false) => {
    const mode = createResizingMode(
      nodeIds, 
      handle, 
      startWorld, 
      startBounds, 
      aspectLocked, 
      fromCenter
    );
    get().transitionTo(mode);
  },
  
  startRotating: (nodeIds, centerWorld, startAngle, startRotations) => {
    const mode = createRotatingMode(
      nodeIds, 
      centerWorld, 
      startAngle, 
      startRotations
    );
    get().transitionTo(mode);
  },
  
  // ============= Helpers Implementation =============
  
  shouldBlockShortcuts: () => {
    return shouldBlockToolShortcuts(get().mode);
  },
  
  shouldBlockSelection: () => {
    return shouldBlockSelection(get().mode);
  },
  
  requiresCapture: () => {
    return requiresPointerCapture(get().mode);
  },
  
  getModeKind: () => {
    return get().mode.kind;
  },
  
  isMode: (kind) => {
    return get().mode.kind === kind;
  }
}));

// ============= Selector Helpers =============

/**
 * Selector للحصول على بيانات حالة Panning
 */
export const selectPanningData = (state: InteractionState): PanningMode | null => {
  return state.mode.kind === 'panning' ? state.mode : null;
};

/**
 * Selector للحصول على بيانات حالة BoxSelect
 */
export const selectBoxSelectData = (state: InteractionState): BoxSelectMode | null => {
  return state.mode.kind === 'boxSelect' ? state.mode : null;
};

/**
 * Selector للحصول على بيانات حالة Dragging
 */
export const selectDraggingData = (state: InteractionState): DraggingMode | null => {
  return state.mode.kind === 'dragging' ? state.mode : null;
};

/**
 * Selector للحصول على بيانات حالة Connecting
 */
export const selectConnectingData = (state: InteractionState): ConnectingMode | null => {
  return state.mode.kind === 'connecting' ? state.mode : null;
};
