import type { Point } from "./canvasCoordinates";

export type PointerButton = 0 | 1 | 2;

export type NormalizedPointerEvent = {
  pointerId: number;
  buttons: number;
  button: PointerButton;
  clientX: number;
  clientY: number;
  shiftKey: boolean;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  target: EventTarget | null;
  preventDefault: () => void;
  stopPropagation: () => void;
};

export type CanvasPointerContext = {
  viewportRect: { left: number; top: number; width: number; height: number };
  screenPoint: Point; // relative to viewport
};

export type CanvasKeyEvent = {
  key: string;
  code: string;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  preventDefault: () => void;
  stopPropagation: () => void;
};

export type CanvasAction =
  | { type: "pan_start"; screen: Point }
  | { type: "pan_move"; screen: Point }
  | { type: "pan_end" }
  | { type: "zoom_at"; screen: Point; deltaY: number }
  | { type: "select_one"; id: string; additive?: boolean }
  | { type: "clear_selection" }
  | { type: "delete_selection" };

export function getViewportRect(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  return { left: r.left, top: r.top, width: r.width, height: r.height };
}

export function toViewportPoint(client: { x: number; y: number }, viewportRect: { left: number; top: number }): Point {
  return { x: client.x - viewportRect.left, y: client.y - viewportRect.top };
}

export function isWheelZoomIntent(e: WheelEvent) {
  // We lock zoom to Ctrl/Meta for predictable UX
  return (e.ctrlKey || e.metaKey) && Math.abs(e.deltaY) > 0;
}

export function isPanIntentPointer(e: PointerEvent) {
  // Middle click always pans. Left click pans when Space or Shift is held (configurable in hook).
  return e.button === 1;
}
