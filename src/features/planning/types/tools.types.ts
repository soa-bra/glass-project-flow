// Tool Types for Planning Board
export type ToolType = 
  | 'selection'
  | 'smart_pen' 
  | 'zoom'
  | 'pan'
  | 'file_uploader'
  | 'comment'
  | 'text'
  | 'shapes'
  | 'smart_element'
  | 'frame';

export interface Tool {
  id: ToolType;
  name: string;
  icon: string;
  shortcut: string;
  panel?: string;
  cursor?: string;
  isActive?: boolean;
}

export interface ToolState {
  activeTool: ToolType;
  tools: Record<ToolType, Tool>;
  toolOptions: Record<ToolType, any>;
}

export interface SmartPenOptions {
  strokeWidth: number;
  color: string;
  style: 'solid' | 'dashed' | 'dotted' | 'double';
  smartConversion: boolean;
  conversionSensitivity: number; // 0-100%
  mode: 'draw' | 'connect' | 'group' | 'erase' | 'normal';
}

export interface TextOptions {
  fontFamily: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  color: string;
  alignment: 'left' | 'center' | 'right' | 'justify';
  italic: boolean;
  underline: boolean;
  rtl: boolean;
  type: 'free' | 'box' | 'component';
}

export interface ShapeOptions {
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  cornerRadius: number;
  category: 'basic' | 'artistic' | 'icons' | 'sticky';
  selectedShape: string;
}

export interface FileUploadOptions {
  acceptedTypes: string[];
  maxSize: number;
  smartInsert: boolean;
  autoConvert: boolean;
}

export interface CommentOptions {
  type: 'text' | 'graphic';
  bubbleType: 'note' | 'suggestion' | 'alert';
  visibility: 'all' | 'role-based';
  mentions: string[];
}

export interface SelectionOptions {
  multiSelect: boolean;
  selectionMode: 'single' | 'multi' | 'lasso';
  transformHandles: boolean;
}

export interface ZoomOptions {
  level: number;
  min: number;
  max: number;
  step: number;
  fitOptions: 'screen' | 'frame' | 'selection';
}

export interface PanOptions {
  momentum: boolean;
  boundaries: boolean;
  speed: number;
}