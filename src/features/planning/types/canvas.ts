// ===============================
// Canvas Types - Planning Board
// أنواع بيانات الكانفاس للوحة التخطيط
// ===============================

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Transform {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Base element interface
export interface CanvasElement {
  id: string;
  type: ElementType;
  parentId?: string;
  frameId?: string;
  transform: Transform;
  style: ElementStyle;
  data: Record<string, any>;
  permissions: ElementPermissions;
  zIndex: number;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

// Element types
export type ElementType = 
  | 'shape'
  | 'text' 
  | 'sticky'
  | 'frame'
  | 'connector'
  | 'smart-element'
  | 'image'
  | 'widget';

// Element style properties
export interface ElementStyle {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  borderRadius?: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  backgroundColor?: string;
  shadow?: string;
}

// Element permissions
export interface ElementPermissions {
  lockedBy?: string | null;
  movable: boolean;
  resizable: boolean;
  editable: boolean;
  deletable: boolean;
}

// Frame specific interface
export interface Frame extends CanvasElement {
  type: 'frame';
  name: string;
  background?: string;
  children: string[]; // element IDs
}

// Connector interface  
export interface Connector extends CanvasElement {
  type: 'connector';
  sourceId: string;
  targetId: string;
  sourceAnchor: AnchorPoint;
  targetAnchor: AnchorPoint;
  route: Position[];
  label?: string;
}

export type AnchorPoint = 'top' | 'right' | 'bottom' | 'left' | 'center';

// Smart Elements
export interface SmartElement extends CanvasElement {
  type: 'smart-element';
  smartType: SmartElementType;
  config: Record<string, any>;
}

export type SmartElementType = 
  | 'thinking-board'
  | 'kanban-board' 
  | 'timeline'
  | 'gantt'
  | 'voting'
  | 'brainstorm'
  | 'mind-map'
  | 'decision-matrix'
  | 'interactive-sheet';

// Board interface
export interface Board {
  id: string;
  name: string;
  ownerId: string;
  elements: Record<string, CanvasElement>;
  frames: Record<string, Frame>;
  connectors: Record<string, Connector>;
  viewport: Viewport;
  grid: GridSettings;
  settings: BoardSettings;
  createdAt: number;
  updatedAt: number;
}

// Viewport (camera) settings
export interface Viewport {
  x: number;
  y: number;
  zoom: number;
  bounds?: Bounds;
}

// Grid settings
export interface GridSettings {
  enabled: boolean;
  size: number;
  type: GridType;
  color: string;
  opacity: number;
  snapEnabled: boolean;
}

export type GridType = 'dots' | 'lines' | 'isometric' | 'hex';

// Board settings
export interface BoardSettings {
  backgroundColor: string;
  showGrid: boolean;
  snapToGrid: boolean;
  snapToObjects: boolean;
  showGuides: boolean;
  showRulers: boolean;
  units: 'px' | 'mm' | 'cm' | 'in';
}

// Selection state
export interface SelectionState {
  selectedIds: string[];
  hoveredId: string | null;
  bounds?: Bounds;
  handles: SelectionHandle[];
}

export interface SelectionHandle {
  id: string;
  type: HandleType;
  position: Position;
  cursor: string;
}

export type HandleType = 
  | 'nw' | 'n' | 'ne'
  | 'w' | 'e' 
  | 'sw' | 's' | 'se'
  | 'rotate';

// Tool state
export interface ToolState {
  activeTool: ToolType;
  toolData: Record<string, any>;
  isDrawing: boolean;
  drawingPath?: Position[];
}

export type ToolType = 
  | 'select'
  | 'pan'
  | 'zoom'
  | 'text'
  | 'shapes'
  | 'smart-pen'
  | 'file-upload'
  | 'comment'
  | 'smart-element';

// History state
export interface HistoryState {
  past: HistoryEntry[];
  present: Board;
  future: HistoryEntry[];
  canUndo: boolean;
  canRedo: boolean;
}

export interface HistoryEntry {
  id: string;
  type: HistoryActionType;
  timestamp: number;
  description: string;
  boardState: Board;
}

export type HistoryActionType = 
  | 'create'
  | 'update' 
  | 'delete'
  | 'move'
  | 'resize'
  | 'style'
  | 'group'
  | 'ungroup';

// Events
export interface CanvasEvent {
  type: CanvasEventType;
  elementId?: string;
  position?: Position;
  data?: any;
  timestamp: number;
}

export type CanvasEventType = 
  | 'element-created'
  | 'element-updated'
  | 'element-deleted'
  | 'element-selected'
  | 'viewport-changed'
  | 'tool-changed';

// Export types
export interface ExportOptions {
  format: ExportFormat;
  quality?: number;
  background?: boolean;
  padding?: number;
  scale?: number;
  frames?: string[]; // specific frame IDs, or all if empty
}

export type ExportFormat = 'png' | 'jpg' | 'svg' | 'pdf' | 'json';

// Import types  
export interface ImportOptions {
  position?: Position;
  scale?: number;
  convertToNative?: boolean; // convert to canvas elements
}

// Search and filter
export interface SearchOptions {
  query: string;
  types?: ElementType[];
  tags?: string[];
  author?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// Layer management
export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  elementIds: string[];
  color?: string; // for visual organization
}

// Spatial indexing for performance
export interface SpatialIndex {
  bounds: Bounds;
  elements: string[];
  children?: SpatialIndex[];
}

// Performance metrics
export interface PerformanceMetrics {
  fps: number;
  renderTime: number;
  elementCount: number;
  memoryUsage: number;
  lastUpdate: number;
}