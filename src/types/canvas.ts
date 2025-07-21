/**
 * @fileoverview Canvas board type definitions for SoaBra management system
 * @author AI Assistant
 * @version 1.0.0
 */

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  elements: string[];
  parentId?: string;
  children?: Layer[];
  isFolder?: boolean;
  isOpen?: boolean;
}

export interface LayerFolder {
  id: string;
  name: string;
  isOpen: boolean;
  layers: Layer[];
  subFolders: LayerFolder[];
}

export interface CanvasElement {
  id: string;
  type: 'text' | 'shape' | 'image' | 'smart-element' | 'sticky' | 'comment' | 'upload' | 'timeline' | 'mindmap' | 'brainstorm' | 'root' | 'moodboard' | 'line';
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation?: number;
  layerId?: string;
  style?: ElementStyle;
  locked?: boolean;
  visible?: boolean;
  content?: string;
  data?: any;
}

export interface ElementStyle {
  fillColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  opacity?: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: 'normal' | 'bold';
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  backgroundColor?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  borderRadius?: string;
  padding?: string;
  rotation?: number;
  [key: string]: any;
}

export interface Participant {
  id: string;
  name: string;
  role: 'host' | 'user' | 'guest';
  avatar?: string;
  isOnline: boolean;
  isSpeaking?: boolean;
  cursor?: { x: number; y: number };
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'emoji' | 'file';
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  position: { x: number; y: number };
  content: string;
  timestamp: Date;
  elementId?: string;
  replies: Comment[];
  status: 'active' | 'resolved';
}

export interface SmartElement {
  id: string;
  type: 'brainstorming' | 'kanban' | 'timeline' | 'mindmap' | 'flowchart' | 'gantt' | 'spreadsheet' | 'decision-matrix' | 'voting' | 'think-board';
  config: any;
  position: { x: number; y: number };
  size: { width: number; height: number };
  data: any;
}

export interface Tool {
  id: string;
  name: string;
  icon: string;
  shortcut: string;
  cursor?: string;
  active: boolean;
}

export interface CanvasState {
  elements: CanvasElement[];
  layers: Layer[];
  selectedElementIds: string[];
  selectedLayerId: string | null;
  activeTool: string;
  zoom: number;
  pan: { x: number; y: number };
  gridVisible: boolean;
  snapToGrid: boolean;
  participants: Participant[];
  comments: Comment[];
  chatMessages: ChatMessage[];
  history?: CanvasElement[][];
  historyIndex?: number;
}

export interface AIAnalysisResult {
  suggestions: string[];
  improvements: string[];
  detectedPatterns: string[];
  generatedElements?: CanvasElement[];
}

export type PanelType = 
  | 'layers'
  | 'appearance' 
  | 'collaboration'
  | 'smart-assistant'
  | 'tool-customization';

export type SmartElementType = 
  | 'think_board'
  | 'kanban_board'
  | 'voting_tool'
  | 'brainstorm_engine'
  | 'timeline'
  | 'decision_matrix'
  | 'root_link'
  | 'smart_flowchart'
  | 'gantt_chart'
  | 'interactive_data_sheet'
  | 'ai_mind_map';