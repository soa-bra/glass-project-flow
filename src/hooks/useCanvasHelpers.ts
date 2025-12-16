import type { CanvasElementModel, ElementId } from "./canvas-elements";
import type { Point } from "./canvasCoordinates";

export type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export function pointInRect(p: Point, el: CanvasElementModel) {
  return p.x >= el.x && p.x <= el.x + el.w && p.y >= el.y && p.y <= el.y + el.h;
}

export function hitTest(elements: CanvasElementModel[], p: Point): ElementId | null {
  // topmost hit = last element (render order)
  for (let i = elements.length - 1; i >= 0; i--) {
    if (pointInRect(p, elements[i])) return elements[i].id;
  }
  return null;
}

export function uniqIds(ids: ElementId[]) {
  return Array.from(new Set(ids));
}

export function normalizeRect(a: Point, b: Point): Rect {
  const x1 = Math.min(a.x, b.x);
  const y1 = Math.min(a.y, b.y);
  const x2 = Math.max(a.x, b.x);
  const y2 = Math.max(a.y, b.y);
  return { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
}

export function rectsIntersect(a: Rect, b: Rect) {
  return !(a.x + a.w < b.x || a.x > b.x + b.w || a.y + a.h < b.y || a.y > b.y + b.h);
}

export function elementRect(el: CanvasElementModel): Rect {
  return { x: el.x, y: el.y, w: el.w, h: el.h };
}

export function elementsInRect(elements: CanvasElementModel[], rect: Rect): ElementId[] {
  const hits: ElementId[] = [];
  for (const el of elements) {
    if (el.hidden) continue;
    if (rectsIntersect(rect, elementRect(el))) hits.push(el.id);
  }
  return hits;
}
