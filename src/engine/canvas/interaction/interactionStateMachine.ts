/**
 * Interaction State Machine - آلة الحالة للتفاعلات
 * 
 * تدير جميع حالات التفاعل في الكانفاس:
 * - idle: لا يوجد تفاعل نشط
 * - panning: تحريك الكاميرا
 * - dragging: سحب عناصر
 * - boxSelect: تحديد منطقة
 * - typing: الكتابة في محرر نص
 * - drawing: الرسم بأداة القلم
 * - connecting: ربط عناصر بموصل
 * - resizing: تغيير حجم عناصر
 * - rotating: تدوير عناصر
 * 
 * ⚠️ قاعدة صارمة: جميع التفاعلات يجب أن تمر من خلال هذه الآلة
 */

import type { Point } from '../kernel/canvasKernel';
import type { ToolId } from '@/stores/canvasStore';

// =============================================================================
// Interaction Mode Types
// =============================================================================

export interface IdleMode {
  kind: 'idle';
}

export interface PanningMode {
  kind: 'panning';
  startScreen: Point;
  startPan: Point;
}

export interface DraggingMode {
  kind: 'dragging';
  nodeIds: string[];
  startWorld: Point;
  startPositions: Map<string, Point>;
  /** هل بدأ السحب الفعلي (تجاوز threshold)? */
  isDragStarted: boolean;
}

export interface BoxSelectMode {
  kind: 'boxSelect';
  startWorld: Point;
  currentWorld: Point;
  /** هل الإضافة للتحديد الحالي (Shift)? */
  additive: boolean;
}

export interface TypingMode {
  kind: 'typing';
  nodeId: string;
  /** معرف عنصر contentEditable */
  editorId?: string;
}

export interface DrawingMode {
  kind: 'drawing';
  tool: ToolId;
  strokeId?: string;
  startWorld: Point;
}

export interface ConnectingMode {
  kind: 'connecting';
  sourceNodeId: string;
  sourceAnchor: string;
  currentWorld: Point;
  /** معرف العنصر الهدف المحتمل */
  hoveredNodeId?: string;
  hoveredAnchor?: string;
}

export interface ResizingMode {
  kind: 'resizing';
  nodeIds: string[];
  handle: 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';
  startWorld: Point;
  startBounds: Map<string, { x: number; y: number; width: number; height: number }>;
  /** الحفاظ على النسبة (Shift)? */
  aspectLocked: boolean;
  /** من المركز (Alt)? */
  fromCenter: boolean;
}

export interface RotatingMode {
  kind: 'rotating';
  nodeIds: string[];
  centerWorld: Point;
  startAngle: number;
  startRotations: Map<string, number>;
}

/**
 * حالة السحب الداخلي - لسحب نقاط تحكم السهم أو عناصر داخلية
 */
export interface InternalDragMode {
  kind: 'internalDrag';
  /** نوع السحب الداخلي */
  dragType: 'arrow-control' | 'connector-anchor' | 'custom';
  /** معرف العنصر المرتبط */
  elementId: string;
  /** بيانات إضافية */
  data?: Record<string, unknown>;
}

export type InteractionMode =
  | IdleMode
  | PanningMode
  | DraggingMode
  | BoxSelectMode
  | TypingMode
  | DrawingMode
  | ConnectingMode
  | ResizingMode
  | RotatingMode
  | InternalDragMode;

// =============================================================================
// State Machine Transitions
// =============================================================================

export interface InteractionTransition {
  from: InteractionMode['kind'] | '*';
  to: InteractionMode['kind'];
  /** شروط الانتقال */
  guard?: (current: InteractionMode, payload: any) => boolean;
}

/**
 * الانتقالات المسموحة بين الحالات
 */
export const ALLOWED_TRANSITIONS: InteractionTransition[] = [
  // من idle إلى أي حالة
  { from: 'idle', to: 'panning' },
  { from: 'idle', to: 'dragging' },
  { from: 'idle', to: 'boxSelect' },
  { from: 'idle', to: 'typing' },
  { from: 'idle', to: 'drawing' },
  { from: 'idle', to: 'connecting' },
  { from: 'idle', to: 'resizing' },
  { from: 'idle', to: 'rotating' },
  { from: 'idle', to: 'internalDrag' },
  
  // العودة إلى idle
  { from: 'panning', to: 'idle' },
  { from: 'dragging', to: 'idle' },
  { from: 'boxSelect', to: 'idle' },
  { from: 'typing', to: 'idle' },
  { from: 'drawing', to: 'idle' },
  { from: 'connecting', to: 'idle' },
  { from: 'resizing', to: 'idle' },
  { from: 'rotating', to: 'idle' },
  { from: 'internalDrag', to: 'idle' },
  
  // انتقالات خاصة
  { from: 'typing', to: 'typing' }, // الانتقال بين حقول نص مختلفة
  { from: 'connecting', to: 'connecting' }, // تغيير الهدف
];

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * التحقق من صلاحية الانتقال
 */
export function canTransition(
  current: InteractionMode,
  to: InteractionMode['kind']
): boolean {
  // من نفس النوع إلى نفسه (تحديث الحالة)
  if (current.kind === to) return true;
  
  return ALLOWED_TRANSITIONS.some(
    t => (t.from === '*' || t.from === current.kind) && t.to === to
  );
}

/**
 * هل الحالة تمنع اختصارات الأدوات؟
 */
export function shouldBlockToolShortcuts(mode: InteractionMode): boolean {
  return mode.kind === 'typing';
}

/**
 * هل الحالة تمنع تحديد العناصر؟
 */
export function shouldBlockSelection(mode: InteractionMode): boolean {
  return mode.kind === 'typing' || mode.kind === 'drawing' || mode.kind === 'connecting';
}

/**
 * هل الحالة تتطلب pointer capture؟
 */
export function requiresPointerCapture(mode: InteractionMode): boolean {
  return (
    mode.kind === 'panning' ||
    mode.kind === 'dragging' ||
    mode.kind === 'boxSelect' ||
    mode.kind === 'resizing' ||
    mode.kind === 'rotating' ||
    mode.kind === 'connecting' ||
    mode.kind === 'internalDrag'
  );
}

/**
 * الحصول على cursor المناسب للحالة
 */
export function getCursorForMode(mode: InteractionMode): string {
  switch (mode.kind) {
    case 'idle':
      return 'default';
    case 'panning':
      return 'grabbing';
    case 'dragging':
      return 'move';
    case 'boxSelect':
      return 'crosshair';
    case 'typing':
      return 'text';
    case 'drawing':
      return 'crosshair';
    case 'connecting':
      return 'crosshair';
    case 'resizing':
      return getResizeCursor(mode.handle);
    case 'rotating':
      return 'grab';
    case 'internalDrag':
      return 'grabbing';
    default:
      return 'default';
  }
}

function getResizeCursor(handle: ResizingMode['handle']): string {
  switch (handle) {
    case 'n':
    case 's':
      return 'ns-resize';
    case 'e':
    case 'w':
      return 'ew-resize';
    case 'ne':
    case 'sw':
      return 'nesw-resize';
    case 'nw':
    case 'se':
      return 'nwse-resize';
    default:
      return 'default';
  }
}

// =============================================================================
// Interaction Mode Creators
// =============================================================================

export const createIdleMode = (): IdleMode => ({ kind: 'idle' });

export const createPanningMode = (
  startScreen: Point,
  startPan: Point
): PanningMode => ({
  kind: 'panning',
  startScreen,
  startPan
});

export const createDraggingMode = (
  nodeIds: string[],
  startWorld: Point,
  startPositions: Map<string, Point>
): DraggingMode => ({
  kind: 'dragging',
  nodeIds,
  startWorld,
  startPositions,
  isDragStarted: false
});

export const createBoxSelectMode = (
  startWorld: Point,
  additive: boolean = false
): BoxSelectMode => ({
  kind: 'boxSelect',
  startWorld,
  currentWorld: startWorld,
  additive
});

export const createTypingMode = (
  nodeId: string,
  editorId?: string
): TypingMode => ({
  kind: 'typing',
  nodeId,
  editorId
});

export const createDrawingMode = (
  tool: ToolId,
  startWorld: Point,
  strokeId?: string
): DrawingMode => ({
  kind: 'drawing',
  tool,
  startWorld,
  strokeId
});

export const createConnectingMode = (
  sourceNodeId: string,
  sourceAnchor: string,
  currentWorld: Point
): ConnectingMode => ({
  kind: 'connecting',
  sourceNodeId,
  sourceAnchor,
  currentWorld
});

export const createResizingMode = (
  nodeIds: string[],
  handle: ResizingMode['handle'],
  startWorld: Point,
  startBounds: Map<string, { x: number; y: number; width: number; height: number }>,
  aspectLocked: boolean = false,
  fromCenter: boolean = false
): ResizingMode => ({
  kind: 'resizing',
  nodeIds,
  handle,
  startWorld,
  startBounds,
  aspectLocked,
  fromCenter
});

export const createRotatingMode = (
  nodeIds: string[],
  centerWorld: Point,
  startAngle: number,
  startRotations: Map<string, number>
): RotatingMode => ({
  kind: 'rotating',
  nodeIds,
  centerWorld,
  startAngle,
  startRotations
});

export const createInternalDragMode = (
  dragType: InternalDragMode['dragType'],
  elementId: string,
  data?: Record<string, unknown>
): InternalDragMode => ({
  kind: 'internalDrag',
  dragType,
  elementId,
  data
});

// =============================================================================
// Event Types
// =============================================================================

export type InteractionEventType =
  | 'pointerdown'
  | 'pointermove'
  | 'pointerup'
  | 'pointercancel'
  | 'keydown'
  | 'keyup'
  | 'wheel'
  | 'focus'
  | 'blur'
  | 'escape'
  | 'enter';

export interface InteractionEvent {
  type: InteractionEventType;
  screenPoint?: Point;
  worldPoint?: Point;
  button?: number;
  modifiers: {
    shift: boolean;
    ctrl: boolean;
    alt: boolean;
    meta: boolean;
  };
  key?: string;
  targetNodeId?: string;
  targetAnchor?: string;
  /** للـ wheel events */
  deltaY?: number;
}

/**
 * إنشاء InteractionEvent من PointerEvent
 */
export function createInteractionEvent(
  type: InteractionEventType,
  e: PointerEvent | MouseEvent | KeyboardEvent | WheelEvent,
  screenPoint?: Point,
  worldPoint?: Point,
  targetNodeId?: string,
  targetAnchor?: string
): InteractionEvent {
  return {
    type,
    screenPoint,
    worldPoint,
    button: 'button' in e ? e.button : undefined,
    modifiers: {
      shift: e.shiftKey,
      ctrl: e.ctrlKey,
      alt: e.altKey,
      meta: e.metaKey
    },
    key: 'key' in e ? e.key : undefined,
    targetNodeId,
    targetAnchor,
    deltaY: 'deltaY' in e ? e.deltaY : undefined
  };
}
