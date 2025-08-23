// ===============================
// Tools Types - Planning Board  
// أنواع بيانات الأدوات للوحة التخطيط
// ===============================

import { Position, Size, ElementStyle } from './canvas';

// Base tool interface
export interface BaseTool {
  id: ToolType;
  name: string;
  icon: string;
  shortcut: string;
  description: string;
  category: ToolCategory;
  enabled: boolean;
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
  | 'smart-element'
  | 'frame';

export type ToolCategory = 
  | 'selection'
  | 'navigation' 
  | 'drawing'
  | 'content'
  | 'smart';

// Selection Tool
export interface SelectionToolState {
  mode: SelectionMode;
  multiSelect: boolean;
  dragStartPos?: Position;
  isDragging: boolean;
  selectionBox?: {
    start: Position;
    end: Position;
  };
}

export type SelectionMode = 'select' | 'move' | 'resize' | 'rotate';

// Pan Tool
export interface PanToolState {
  isPanning: boolean;
  startPosition?: Position;
  lastPosition?: Position;
}

// Zoom Tool  
export interface ZoomToolState {
  isZooming: boolean;
  zoomMode: ZoomMode;
  startPosition?: Position;
}

export type ZoomMode = 'zoom-in' | 'zoom-out' | 'zoom-area';

// Text Tool
export interface TextToolState {
  isEditing: boolean;
  editingElementId?: string;
  textMode: TextMode;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  textAlign: 'left' | 'center' | 'right';
  color: string;
}

export type TextMode = 'free-text' | 'text-box' | 'text-on-path';

// Shapes Tool
export interface ShapesToolState {
  selectedShape: ShapeType;
  isDrawing: boolean;
  startPosition?: Position;
  currentPosition?: Position;
  style: ShapeStyle;
}

export type ShapeType = 
  | 'rectangle'
  | 'circle' 
  | 'triangle'
  | 'diamond'
  | 'arrow'
  | 'line'
  | 'star'
  | 'polygon'
  | 'sticky-note';

export interface ShapeStyle extends ElementStyle {
  cornerRadius?: number;
  arrowHead?: boolean;
  sides?: number; // for polygon/star
}

// Smart Pen Tool
export interface SmartPenToolState {
  mode: SmartPenMode;
  isDrawing: boolean;
  currentStroke?: Position[];
  strokeHistory: Position[][];
  recognitionEnabled: boolean;
  smoothingLevel: number;
  pressureSensitive: boolean;
  style: PenStyle;
}

export type SmartPenMode = 
  | 'draw'
  | 'erase' 
  | 'smart-convert'
  | 'connect'
  | 'annotate';

export interface PenStyle {
  strokeWidth: number;
  strokeColor: string;
  opacity: number;
  lineCap: 'butt' | 'round' | 'square';
  lineJoin: 'miter' | 'round' | 'bevel';
  dashPattern?: number[];
}

// File Upload Tool
export interface FileUploadToolState {
  isDragging: boolean;
  dragPosition?: Position;
  uploadQueue: FileUploadItem[];
  insertMode: FileInsertMode;
}

export interface FileUploadItem {
  id: string;
  file: File;
  preview?: string;
  status: UploadStatus;
  progress: number;
  error?: string;
}

export type UploadStatus = 'pending' | 'uploading' | 'completed' | 'error';
export type FileInsertMode = 'direct' | 'smart-convert' | 'ask-user';

// Comment Tool
export interface CommentToolState {
  mode: CommentMode;
  isCreating: boolean;
  activeCommentId?: string;
  position?: Position;
}

export type CommentMode = 'text-comment' | 'drawing-comment' | 'voice-comment';

// Smart Element Tool
export interface SmartElementToolState {
  selectedElement: SmartElementType;
  isPlacing: boolean;
  placementPosition?: Position;
  placementSize?: Size;
  config: SmartElementConfig;
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
  | 'interactive-sheet'
  | 'project-cards'
  | 'finance-widget'
  | 'crm-widget'
  | 'csr-widget';

export interface SmartElementConfig {
  [key: string]: any;
}

// Frame Tool
export interface FrameToolState {
  isCreating: boolean;
  startPosition?: Position;
  currentPosition?: Position;
  frameStyle: FrameStyle;
}

export interface FrameStyle {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  padding: number;
}

// Tool options and preferences
export interface ToolOptions {
  snapToGrid: boolean;
  snapToObjects: boolean;
  showGuides: boolean;
  magnetism: number; // snap distance in pixels
  smoothDrawing: boolean;
  pressureSensitive: boolean;
}

// Keyboard shortcuts
export interface KeyboardShortcut {
  key: string;
  modifiers?: KeyModifier[];
  action: string;
  description: string;
}

export type KeyModifier = 'ctrl' | 'shift' | 'alt' | 'meta';

// Tool events
export interface ToolEvent {
  type: ToolEventType;
  tool: ToolType;
  data?: any;
  position?: Position;
  timestamp: number;
}

export type ToolEventType = 
  | 'tool-activated'
  | 'tool-deactivated'
  | 'drawing-started'
  | 'drawing-ended'
  | 'element-created'
  | 'element-modified';

// Tool validation
export interface ToolValidation {
  canActivate: boolean;
  canDeactivate: boolean;
  canUse: boolean;
  reason?: string;
}

// Tool performance metrics
export interface ToolMetrics {
  activationCount: number;
  usageTime: number; // milliseconds
  elementsCreated: number;
  lastUsed: number;
  errors: number;
}