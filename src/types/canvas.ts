// Canvas Types - التعريفات الموحدة للـ Canvas System
export interface CanvasElement {
  id: string;
  type: 'text' | 'shape' | 'sticky' | 'image' | 'annotation' | 'flowchart' | 'comment' | 'upload' | 'line' | 'smart-element' | 'timeline' | 'mindmap' | 'brainstorm' | 'root' | 'moodboard' | 'group';
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: ElementStyle;
  content?: string;
  locked?: boolean;
  visible?: boolean;
  layer?: number;
  metadata?: Record<string, unknown>;
  data?: {
    path?: Array<{ x: number; y: number }>;
    content?: React.ReactNode;
    [key: string]: unknown;
  };
  rotation?: number;
  parentId?: string;
  layerId?: string;
}

export interface ElementStyle {
  backgroundColor?: string;
  color?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  fontFamily?: string;
  textAlign?: 'left' | 'center' | 'right';
  textDecoration?: 'none' | 'line-through' | 'overline' | 'underline' | string;
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase' | 'full-width' | 'full-size-kana';
  stroke?: string;
  strokeWidth?: number;
  strokeDashArray?: string;
  fill?: string;
  borderRadius?: number;
  opacity?: number;
  transform?: string;
  zIndex?: number;
  lineHeight?: number;
  letterSpacing?: number;
  wordSpacing?: number;
  whiteSpace?: string;
  overflow?: string;
  padding?: string | number;
  [key: string]: unknown;
}

export interface BorderStyle {
  style: 'solid' | 'dashed' | 'dotted' | 'none' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset';
  width: number;
  color: string;
  radius?: number;
  opacity?: number;
}

export interface TextStyle extends ElementStyle {
  lineHeight?: number;
  letterSpacing?: number;
  wordSpacing?: number;
}

export interface ShapeStyle extends ElementStyle {
  shapeType?: 'rectangle' | 'circle' | 'triangle' | 'arrow';
  strokeDashArray?: 'none' | 'dashed' | 'dotted';
}

export interface CanvasSettings {
  zoom: number;
  pan: { x: number; y: number };
  gridEnabled: boolean;
  snapToGrid: boolean;
  gridSize: number;
  background: string;
  theme: 'light' | 'dark';
}

export interface CanvasHistory {
  id: string;
  timestamp: number;
  action: string;
  elements: CanvasElement[];
  description: string;
}

export interface LayerInfo {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  color?: string;
  elements: string[];
}

// Event Types
export interface CanvasEventData {
  elementId?: string;
  action: string;
  data: Record<string, unknown>;
  timestamp: number;
}

// Collaboration Types
export interface CollaborationUser {
  id: string;
  name: string;
  color: string;
  isOnline: boolean;
  cursor?: { x: number; y: number };
}

// Analysis Types
export interface AnalysisResult {
  classification: Array<{ type: string; confidence: number; label: string }>;
  sentiment: Array<{ type: string; score: number; label: string }>;
  suggestions: Array<{ type: string; description: string; action: string }>;
}

// Preset Types
export interface StylePreset {
  id: string;
  name: string;
  category: 'card' | 'gradient' | 'neon' | 'glass' | 'minimal' | 'text' | 'shapes' | 'effects' | 'layouts' | 'custom';
  style: ElementStyle;
  usage?: number;
  createdAt: string;
  updatedAt: string;
}

// Color Types
export interface ColorConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

// Smart Element Config
export interface SmartElementConfig {
  type: string;
  template: string;
  style: ElementStyle;
  content: string;
  size: { width: number; height: number };
  metadata: Record<string, unknown>;
}

// Component Props Types
export interface ElementUpdateCallbacks {
  onStyleUpdate?: (elementId: string, style: ElementStyle) => void;
  onBulkStyleUpdate?: (elementIds: string[], style: ElementStyle) => void;
  onUpdateElement?: (elementId: string, updates: Partial<CanvasElement>) => void;
}

export interface Point {
  x: number;
  y: number;
}

export interface SelectedElement {
  id: string;
  type: string;
  style: ElementStyle;
  isLocked?: boolean;
  isVisible?: boolean;
  name?: string;
}