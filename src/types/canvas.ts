// Canvas Types - Unified from canvas.ts and panels.ts

// ============= Tool & Panel Types =============
export type ToolId =
  | "selection_tool"
  | "smart_pen"
  | "frame_tool"
  | "file_uploader"
  | "text_tool"
  | "shapes_tool"
  | "smart_element_tool";

export type GridType = "dots" | "grid" | "isometric" | "hex";

export interface GridSettings {
  visible: boolean;
  snap: boolean;
  size: 4 | 8 | 16 | 32 | 64;
  type: GridType;
}

export interface ChatMessage {
  id: string;
  userId: number;
  name: string;
  text: string;
  ts: number; // epoch ms
}

export interface AssistCommandPayload {
  type: "smart_finish" | "smart_review" | "smart_cleanup" | "chat";
  message?: string;
}

export interface LayerExtra {
  hidden?: boolean;
  locked?: boolean;
  opacity?: number;
  stroke?: { color: { r: number; g: number; b: number }; width: number; style: "solid" | "dashed" | "dotted" };
  lockedBy?: number | null;
  link?: string | null;
  folderId?: string | null;
}

// ============= Canvas Element Types =============
export interface CanvasElement {
  id: string;
  type: string; // More flexible type system
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: Record<string, any>; // Maximum flexibility for styling
  content?: string;
  locked?: boolean;
  visible?: boolean;
  layer?: number;
  metadata?: Record<string, any>;
  data?: Record<string, any>;
  rotation?: number | string;
  parentId?: string;
  layerId?: string;
  [key: string]: any; // Allow any additional properties
}

export interface ElementStyle {
  [key: string]: any; // Maximum flexibility
}

export interface BorderStyle {
  style?: string;
  width?: number | string;
  color?: string;
  radius?: number | string;
  opacity?: number | string;
  [key: string]: any;
}

export interface TextStyle {
  [key: string]: any; // Maximum flexibility for text styling
}

export interface ShapeStyle {
  [key: string]: any; // Maximum flexibility for shape styling
}

export interface CanvasSettings {
  zoom: number;
  pan: { x: number; y: number };
  gridEnabled: boolean;
  snapToGrid: boolean;
  gridSize: number;
  background: string;
  theme: 'light' | 'dark';
  [key: string]: any;
}

export interface CanvasHistory {
  id: string;
  timestamp: number;
  action: string;
  elements: CanvasElement[];
  description: string;
  [key: string]: any;
}

export interface LayerInfo {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  color?: string;
  elements: string[];
  [key: string]: any;
}

// Event Types
export interface CanvasEventData {
  elementId?: string;
  action: string;
  data: Record<string, any>;
  timestamp: number;
  [key: string]: any;
}

// Collaboration Types
export interface CollaborationUser {
  id: string;
  name: string;
  color: string;
  isOnline: boolean;
  cursor?: { x: number; y: number };
  [key: string]: any;
}

// Analysis Types
export interface AnalysisResult {
  classification: Array<Record<string, any>>;
  sentiment: Array<Record<string, any>>;
  suggestions: Array<Record<string, any>>;
  [key: string]: any;
}

// Preset Types
export interface StylePreset {
  id: string;
  name: string;
  category: string;
  style: Record<string, any>;
  usage?: number;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

// Color Types
export interface ColorConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  [key: string]: any;
}

// Smart Element Config
export interface SmartElementConfig {
  type: string;
  template: string;
  style: Record<string, any>;
  content: string;
  size: { width: number; height: number };
  metadata: Record<string, any>;
  [key: string]: any;
}

// Component Props Types
export interface ElementUpdateCallbacks {
  onStyleUpdate?: (elementId: string, style: Record<string, any>) => void;
  onBulkStyleUpdate?: (elementIds: string[], style: Record<string, any>) => void;
  onUpdateElement?: (elementId: string, updates: Partial<CanvasElement>) => void;
  [key: string]: any;
}

export interface Point {
  x: number;
  y: number;
}

export interface SelectedElement {
  id: string;
  type: string;
  style: Record<string, any>;
  isLocked?: boolean;
  isVisible?: boolean;
  name?: string;
  [key: string]: any;
}