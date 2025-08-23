// Canvas Types for Planning Board - Enhanced from existing types/canvas.ts
export interface CanvasElement {
  id: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: Record<string, any>;
  data?: Record<string, any>;
  locked?: boolean;
  visible?: boolean;
  layerId?: string;
  createdBy?: string;
  updatedAt?: number;
  rotation?: number;
  parentId?: string;
  metadata?: Record<string, any>;
}

export interface CanvasState {
  elements: CanvasElement[];
  selectedElementIds: string[];
  zoom: number;
  pan: { x: number; y: number };
  showGrid: boolean;
  snapEnabled: boolean;
  layers: LayerInfo[];
  selectedLayerId: string | null;
  gridSize: number;
  gridType: 'dots' | 'grid' | 'isometric' | 'hex';
}

export interface LayerInfo {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  color?: string;
  elements: string[];
  opacity?: number;
}

export interface Frame {
  id: string;
  name: string;
  bounds: { x: number; y: number; width: number; height: number };
  locked: boolean;
  background: string;
  elements: string[];
}

export interface Transform {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface SelectionState {
  selectedIds: string[];
  boundingBox: BoundingBox | null;
  isTransforming: boolean;
  transformMode: 'move' | 'resize' | 'rotate' | null;
}

export interface ViewportState {
  zoom: number;
  pan: Point;
  bounds: BoundingBox;
}

export interface GridSettings {
  enabled: boolean;
  size: number;
  type: 'dots' | 'grid' | 'isometric' | 'hex';
  color: string;
  opacity: number;
}

export interface SnapSettings {
  enabled: boolean;
  tolerance: number;
  snapToGrid: boolean;
  snapToElements: boolean;
  snapToGuides: boolean;
}