// Core Canvas Types
export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Transform {
  position: Point;
  rotation: number;
  scale: { x: number; y: number };
}

export interface Style {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  opacity?: number;
}

export interface CanvasNode {
  id: string;
  type: string;
  transform: Transform;
  size: Size;
  style: Style;
  metadata?: Record<string, any>;
}

// Specialized Node Types
export interface TextNode extends CanvasNode {
  type: 'text';
  content: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
}

export interface StickyNode extends CanvasNode {
  type: 'sticky';
  content: string;
  color?: string;
}

export interface FrameNode extends CanvasNode {
  type: 'frame';
  title: string;
  children: string[]; // Node IDs
}

export interface ImageNode extends CanvasNode {
  type: 'image';
  src: string;
  alt?: string;
  preserveAspectRatio?: boolean;
}

export interface LineNode extends CanvasNode {
  type: 'line' | 'arrow';
  points: Point[];
  start?: Point;
  end?: Point;
}

// Canvas State
export interface Camera {
  position: Point;
  zoom: number;
  minZoom: number;
  maxZoom: number;
}

export interface Viewport {
  width: number;
  height: number;
}

export interface ViewportBounds extends Bounds {
  // Viewport-specific bounds
}

export interface SnapState {
  enabled: boolean;
  threshold: number;
  snapToGrid: boolean;
  snapToNodes: boolean;
  gridSize: number;
}

export interface CanvasState {
  tool: string;
  camera: Camera;
  snap: SnapState;
  selection: {
    selectedIds: string[];
    multiSelect: boolean;
    hoveredId: string | null;
  };
  nodes: CanvasNode[];
  viewport: Viewport;
  history: CanvasSnapshot[];
  historyIndex: number;
}

export interface CanvasSnapshot {
  nodes: CanvasNode[];
  camera: Camera;
  timestamp: number;
}

// Utility Functions
export function getViewportCenter(
  viewport: Viewport, 
  camera: { x: number; y: number; scale: number }
): Point {
  return {
    x: (viewport.width / 2 - camera.x) / camera.scale,
    y: (viewport.height / 2 - camera.y) / camera.scale
  };
}

export function pointInBounds(point: Point, bounds: Bounds): boolean {
  return (
    point.x >= bounds.x &&
    point.x <= bounds.x + bounds.width &&
    point.y >= bounds.y &&
    point.y <= bounds.y + bounds.height
  );
}

export function boundsIntersect(a: Bounds, b: Bounds): boolean {
  return !(
    a.x > b.x + b.width ||
    a.x + a.width < b.x ||
    a.y > b.y + b.height ||
    a.y + a.height < b.y
  );
}

export function calculateDistance(a: Point, b: Point): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function clampValue(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Export all node types as union
export type AnyCanvasNode = 
  | CanvasNode 
  | TextNode 
  | StickyNode 
  | FrameNode 
  | ImageNode 
  | LineNode;