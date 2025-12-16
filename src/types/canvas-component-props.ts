import type { CanvasElementModel, ElementId } from "./canvas-elements";

export type Camera = {
  x: number;
  y: number;
  zoom: number;
};

export type CanvasViewportRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type CanvasSelection = {
  ids: ElementId[];
  primaryId?: ElementId;
};

export type CanvasElementRenderProps = {
  element: CanvasElementModel;
  isSelected: boolean;
  isPrimary: boolean;
  // camera is optional for future (hit testing overlays, etc.)
  camera?: Camera;
  onPointerDown?: (id: ElementId, e: React.PointerEvent) => void;
};

export type CanvasElementsLayerProps = {
  elements: CanvasElementModel[];
  selection: CanvasSelection;
  camera: Camera;
  onElementPointerDown?: (id: ElementId, e: React.PointerEvent) => void;
};
