/**
 * Canvas Store Types - جميع الأنواع المشتركة بين الـ slices
 */

import type { CanvasElement, LayerInfo, CanvasSettings } from '@/types/canvas';
import type { ArrowConnection } from '@/types/arrow-connections';

// Re-export for convenience
export type { CanvasElement, LayerInfo, CanvasSettings };

// Tool Types
export type ToolId =
  | "selection_tool"
  | "smart_pen"
  | "sticky_tool"
  | "text_tool"
  | "file_uploader"
  | "shapes_tool"
  | "mindmap_tool"
  | "smart_element_tool"
  | "research_tool"
  | "frame_tool"
  | "smart_doc_tool";

export type ShapeType = 
  | 'rectangle' | 'circle' | 'triangle' | 'line' | 'star' | 'hexagon'
  | 'pentagon' | 'octagon' | 'diamond'
  | 'arrow_right' | 'arrow_left' | 'arrow_up' | 'arrow_down'
  | 'arrow_up_right' | 'arrow_down_right' | 'arrow_up_left' | 'arrow_down_left'
  | 'icon' | 'sticky';

// Pen Tool Types
export type LineStyle = 'solid' | 'dashed' | 'dotted' | 'double';

export interface PenPoint {
  x: number;
  y: number;
  pressure?: number;
  t: number;
}

export interface PenStroke {
  id: string;
  points: PenPoint[];
  color: string;
  width: number;
  style: LineStyle;
  isClosed?: boolean;
  simplified?: boolean;
  bbox?: { x: number; y: number; w: number; h: number };
}

export interface PenSettings {
  strokeWidth: number;
  color: string;
  style: LineStyle;
  smartMode: boolean;
  eraserMode: boolean;
}

// Frame Element Type
export interface FrameElement extends CanvasElement {
  type: 'frame';
  children: string[];
  title?: string;
  frameStyle?: 'rectangle' | 'rounded' | 'circle';
}

// Text Element Type
export interface TextElement extends CanvasElement {
  type: 'text';
  textType?: 'line' | 'box' | 'attached';
  content?: string;
  fontFamily?: string;
  fontWeight?: string;
  fontSize?: number;
  color?: string;
  alignment?: 'left' | 'center' | 'right';
  direction?: 'rtl' | 'ltr';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline';
  attachedTo?: string;
  relativePosition?: { x: number; y: number };
}

// Tool Settings
export interface ToolSettings {
  shapes: {
    fillColor: string;
    strokeColor: string;
    strokeWidth: number;
    opacity: number;
    shapeType: ShapeType;
    iconName?: string;
    stickyText?: string;
  };
  text: {
    fontSize: number;
    fontFamily: string;
    color: string;
    alignment: 'left' | 'center' | 'right';
    fontWeight: string;
    direction: 'rtl' | 'ltr';
    verticalAlign: 'top' | 'middle' | 'bottom';
  };
  pen: PenSettings;
  frame: {
    strokeWidth: number;
    strokeColor: string;
    title: string;
  };
}

// Viewport State
export interface ViewportState {
  zoom: number;
  pan: { x: number; y: number };
}

// History State
export interface HistoryState {
  past: CanvasElement[][];
  future: CanvasElement[][];
}

// Default Tool Settings
export const DEFAULT_TOOL_SETTINGS: ToolSettings = {
  shapes: {
    fillColor: '#f28e2a',
    strokeColor: 'transparent',
    strokeWidth: 1,
    opacity: 1,
    shapeType: 'rectangle'
  },
  text: {
    fontSize: 16,
    fontFamily: 'IBM Plex Sans Arabic',
    color: '#111827',
    alignment: 'right',
    fontWeight: 'normal',
    direction: 'rtl',
    verticalAlign: 'top'
  },
  pen: {
    strokeWidth: 2,
    color: '#111111',
    style: 'solid',
    smartMode: false,
    eraserMode: false
  },
  frame: {
    strokeWidth: 2,
    strokeColor: '#0B0F12',
    title: ''
  }
};

// Default Settings
export const DEFAULT_CANVAS_SETTINGS: CanvasSettings = {
  zoom: 1,
  pan: { x: 0, y: 0 },
  gridEnabled: true,
  snapToGrid: false,
  gridSize: 20,
  gridType: 'grid' as 'dots' | 'grid' | 'isometric' | 'hex',
  snapToEdges: true,
  snapToCenter: true,
  snapToDistribution: false,
  background: '#FFFFFF',
  theme: 'light'
};

// Default Layer
export const DEFAULT_LAYER: LayerInfo = {
  id: 'default',
  name: 'الطبقة الافتراضية',
  visible: true,
  locked: false,
  elements: []
};
