// Core Canvas Types
export interface Point {
  x: number;
  y: number;
}

export interface Position {
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
  scale: Point;
}

// Canvas Node Types
export type NodeType = 
  | 'rect' 
  | 'ellipse' 
  | 'line' 
  | 'arrow' 
  | 'text' 
  | 'sticky' 
  | 'frame' 
  | 'image';

export interface BaseNodeData {
  id: string;
  type: NodeType;
  transform: Transform;
  size: Size;
  style: NodeStyle;
  metadata?: Record<string, any>;
  locked?: boolean;
  visible?: boolean;
}

export interface NodeStyle {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  shadow?: {
    color: string;
    blur: number;
    offset: Point;
  };
}

// Specific Node Types
export interface RectNode extends BaseNodeData {
  type: 'rect';
  radius?: number;
}

export interface EllipseNode extends BaseNodeData {
  type: 'ellipse';
}

export interface LineNode extends BaseNodeData {
  type: 'line';
  points: Point[];
}

export interface ArrowNode extends BaseNodeData {
  type: 'arrow';
  start: Point;
  end: Point;
  arrowStyle?: 'simple' | 'filled' | 'diamond';
}

export interface TextNode extends BaseNodeData {
  type: 'text';
  content: string;
  fontSize: number;
  fontFamily: string;
  fontWeight?: 'normal' | 'bold';
  textAlign?: 'left' | 'center' | 'right';
  color: string;
}

export interface StickyNode extends BaseNodeData {
  type: 'sticky';
  content: string;
  color: string;
}

export interface FrameNode extends BaseNodeData {
  type: 'frame';
  title?: string;
  children: string[]; // IDs of child nodes
}

export interface ImageNode extends BaseNodeData {
  type: 'image';
  src: string;
  preserveAspectRatio?: boolean;
}

export type CanvasNode = 
  | RectNode 
  | EllipseNode 
  | LineNode 
  | ArrowNode 
  | TextNode 
  | StickyNode 
  | FrameNode 
  | ImageNode;

// Camera & Viewport
export interface Camera {
  position: Point;
  zoom: number;
  minZoom: number;
  maxZoom: number;
}

export interface Viewport {
  size: Size;
  bounds: Bounds;
}

// Selection
export interface SelectionState {
  selectedIds: string[];
  hoveredId?: string;
  isMultiSelect: boolean;
}

// Snap
export interface SnapState {
  enabled: boolean;
  threshold: number;
  snapToGrid: boolean;
  snapToNodes: boolean;
  gridSize: number;
}

// Canvas State
export interface CanvasState {
  nodes: Map<string, CanvasNode>;
  camera: Camera;
  selection: SelectionState;
  snap: SnapState;
  viewport: Viewport;
  tool: string;
  history: HistoryEntry[];
  historyIndex: number;
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  action: 'add' | 'update' | 'delete' | 'batch';
  data: any;
}

// Events
export interface CanvasEvent {
  type: string;
  point: Point;
  screenPoint: Point;
  modifiers: {
    shift: boolean;
    ctrl: boolean;
    alt: boolean;
  };
}

export interface NodeEvent extends CanvasEvent {
  nodeId: string;
  node: CanvasNode;
}

// API
export interface CanvasAPI {
  addNode: (node: Partial<CanvasNode>) => string;
  updateNode: (id: string, patch: Partial<CanvasNode>) => void;
  removeNode: (id: string) => void;
  getNode: (id: string) => CanvasNode | undefined;
  getNodes: () => CanvasNode[];
  selectNode: (id: string, multiSelect?: boolean) => void;
  clearSelection: () => void;
  zoomToFit: () => void;
  zoomToNodes: (nodeIds: string[]) => void;
  toSnapshot: () => CanvasSnapshot;
  fromSnapshot: (snapshot: CanvasSnapshot) => void;
}

export interface CanvasSnapshot {
  version: string;
  timestamp: number;
  nodes: CanvasNode[];
  camera: Camera;
  metadata?: Record<string, any>;
}