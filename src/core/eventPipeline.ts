/**
 * Event Pipeline - خط أنابيب موحد للأحداث
 */

import { canvasKernel, type Point, type Camera } from './canvasKernel';

export type PointerEventType = 'down' | 'move' | 'up' | 'cancel';

export interface CanvasPointerEvent {
  type: PointerEventType;
  worldPoint: Point;
  screenPoint: Point;
  button: number;
  pressure: number;
  modifiers: {
    shift: boolean;
    ctrl: boolean;
    alt: boolean;
    meta: boolean;
  };
  nativeEvent: PointerEvent | MouseEvent | WheelEvent;
  target: EventTarget | null;
  preventDefault: () => void;
  stopPropagation: () => void;
}

export interface WheelCanvasEvent {
  worldPoint: Point;
  deltaX: number;
  deltaY: number;
  isZoom: boolean;
  modifiers: {
    shift: boolean;
    ctrl: boolean;
    alt: boolean;
    meta: boolean;
  };
  nativeEvent: WheelEvent;
  preventDefault: () => void;
}

export type ToolEventHandler = (event: CanvasPointerEvent) => void;
export type WheelEventHandler = (event: WheelCanvasEvent) => void;

class EventPipelineImpl {
  private _containerRect: DOMRect | null = null;
  private _camera: Camera = { zoom: 1, pan: { x: 0, y: 0 } };

  setContainerRect(rect: DOMRect | null): void {
    this._containerRect = rect;
  }

  setCamera(camera: Camera): void {
    this._camera = camera;
  }

  get camera(): Camera {
    return this._camera;
  }

  processPointerEvent(
    e: PointerEvent | MouseEvent,
    type: PointerEventType,
    containerRect?: DOMRect | null,
    camera?: Camera
  ): CanvasPointerEvent {
    const rect = containerRect ?? this._containerRect;
    const cam = camera ?? this._camera;

    const screenPoint: Point = { x: e.clientX, y: e.clientY };
    const worldPoint = canvasKernel.screenToWorld(e.clientX, e.clientY, cam, rect);

    return {
      type,
      worldPoint,
      screenPoint,
      button: e.button,
      pressure: 'pressure' in e ? (e as PointerEvent).pressure : 0.5,
      modifiers: {
        shift: e.shiftKey,
        ctrl: e.ctrlKey,
        alt: e.altKey,
        meta: e.metaKey
      },
      nativeEvent: e,
      target: e.target,
      preventDefault: () => e.preventDefault(),
      stopPropagation: () => e.stopPropagation()
    };
  }

  processWheelEvent(
    e: WheelEvent,
    containerRect?: DOMRect | null,
    camera?: Camera
  ): WheelCanvasEvent {
    const rect = containerRect ?? this._containerRect;
    const cam = camera ?? this._camera;
    const worldPoint = canvasKernel.screenToWorld(e.clientX, e.clientY, cam, rect);

    return {
      worldPoint,
      deltaX: e.deltaX,
      deltaY: e.deltaY,
      isZoom: e.ctrlKey || e.metaKey,
      modifiers: {
        shift: e.shiftKey,
        ctrl: e.ctrlKey,
        alt: e.altKey,
        meta: e.metaKey
      },
      nativeEvent: e,
      preventDefault: () => e.preventDefault()
    };
  }

  screenToWorld(
    screenX: number,
    screenY: number,
    containerRect?: DOMRect | null,
    camera?: Camera
  ): Point {
    const rect = containerRect ?? this._containerRect;
    const cam = camera ?? this._camera;
    return canvasKernel.screenToWorld(screenX, screenY, cam, rect);
  }

  screenDeltaToWorld(deltaX: number, deltaY: number, zoom?: number): Point {
    const z = zoom ?? this._camera.zoom;
    return canvasKernel.screenDeltaToWorld(deltaX, deltaY, z);
  }

  isCanvasElement(target: EventTarget | null): boolean {
    if (!target || !(target instanceof HTMLElement)) return false;
    return !!target.closest('[data-canvas-element="true"]');
  }

  isBoundingBox(target: EventTarget | null): boolean {
    if (!target || !(target instanceof HTMLElement)) return false;
    return !!target.closest('.bounding-box');
  }

  isPanel(target: EventTarget | null): boolean {
    if (!target || !(target instanceof HTMLElement)) return false;
    return !!target.closest('[data-panel="true"]') || !!target.closest('[data-text-panel="true"]');
  }

  isEmptyCanvasClick(target: EventTarget | null): boolean {
    return !this.isCanvasElement(target) && !this.isBoundingBox(target) && !this.isPanel(target);
  }
}

export const eventPipeline = new EventPipelineImpl();

export function createEventPipelineSync(
  containerRef: React.RefObject<HTMLElement>,
  camera: Camera
) {
  eventPipeline.setCamera(camera);
  
  const updateContainerRect = () => {
    eventPipeline.setContainerRect(containerRef.current?.getBoundingClientRect() ?? null);
  };

  return {
    pipeline: eventPipeline,
    updateContainerRect,
    processPointerEvent: (e: PointerEvent | MouseEvent, type: PointerEventType) => {
      updateContainerRect();
      return eventPipeline.processPointerEvent(e, type);
    },
    processWheelEvent: (e: WheelEvent) => {
      updateContainerRect();
      return eventPipeline.processWheelEvent(e);
    },
    screenToWorld: (screenX: number, screenY: number) => {
      updateContainerRect();
      return eventPipeline.screenToWorld(screenX, screenY);
    },
    screenDeltaToWorld: (deltaX: number, deltaY: number) => {
      return eventPipeline.screenDeltaToWorld(deltaX, deltaY);
    }
  };
}
