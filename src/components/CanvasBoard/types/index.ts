// Core Canvas Board Types
export interface CanvasElement {
  id: string;
  type: 'text' | 'shape' | 'sticky' | 'comment' | 'upload' | 'timeline' | 'mindmap' | 'smart' | 'brainstorm' | 'root' | 'moodboard' | 'line' | 'image' | 'file' | 'connector';
  position: { x: number; y: number };
  size: { width: number; height: number };
  content?: string;
  style?: Record<string, any>;
  locked?: boolean;
  layerId?: string;
  zIndex?: number;
  opacity?: number;
  rotation?: number;
  connections?: string[];
  metadata?: Record<string, any>;
}

export interface CanvasLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  elements: string[];
  order: number;
}

export interface CanvasPanel {
  id: string;
  type: 'smart-assistant' | 'layers' | 'appearance' | 'collaboration' | 'tools' | 'properties';
  title: string;
  isVisible: boolean;
  isCollapsed: boolean;
  position: 'left' | 'right' | 'bottom';
  width?: number;
  height?: number;
  resizable: boolean;
  order: number;
}

export interface SmartAssistant {
  id: string;
  type: 'ai-suggestions' | 'auto-layout' | 'content-generation' | 'style-sync' | 'smart-templates';
  status: 'idle' | 'thinking' | 'ready' | 'error';
  suggestions: SmartSuggestion[];
  history: AssistantAction[];
}

export interface SmartSuggestion {
  id: string;
  type: 'layout' | 'content' | 'style' | 'workflow' | 'template';
  title: string;
  description: string;
  confidence: number;
  preview?: string;
  action: () => void;
}

export interface AssistantAction {
  id: string;
  type: string;
  description: string;
  timestamp: Date;
  success: boolean;
}

export interface Tool {
  id: string;
  label: string;
  icon: any;
  category: 'basic' | 'smart' | 'file' | 'project' | 'navigation' | 'collaboration' | 'content' | 'ai';
  shortcut?: string;
  description?: string;
  isActive?: boolean;
  subTools?: Tool[];
}

export interface CanvasTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      small: string;
      medium: string;
      large: string;
    };
  };
  spacing: {
    small: number;
    medium: number;
    large: number;
  };
}

export interface CollaborationUser {
  id: string;
  name: string;
  avatar?: string;
  cursor?: { x: number; y: number };
  selectedElement?: string;
  isOnline: boolean;
  role: 'viewer' | 'editor' | 'admin';
}

export interface CanvasComment {
  id: string;
  content: string;
  author: CollaborationUser;
  position: { x: number; y: number };
  elementId?: string;
  timestamp: Date;
  resolved: boolean;
  replies?: CanvasComment[];
}

export interface CanvasVersion {
  id: string;
  name: string;
  description?: string;
  timestamp: Date;
  author: CollaborationUser;
  thumbnail?: string;
  changes: VersionChange[];
}

export interface VersionChange {
  type: 'added' | 'modified' | 'deleted';
  elementId: string;
  description: string;
}

export interface CanvasState {
  selectedTool: string;
  selectedElementIds: string[];
  showGrid: boolean;
  snapEnabled: boolean;
  elements: CanvasElement[];
  layers: CanvasLayer[];
  activeLayerId: string;
  showDefaultView: boolean;
  searchQuery: string;
  zoom: number;
  canvasPosition: { x: number; y: number };
  theme: CanvasTheme;
  panels: CanvasPanel[];
  smartAssistant: SmartAssistant;
  collaborationUsers: CollaborationUser[];
  comments: CanvasComment[];
  versions: CanvasVersion[];
  isCollaborationMode: boolean;
  isDarkMode: boolean;
}

// Legacy types for backward compatibility
export interface CanvasItem {
  id: string;
  type: 'sticky-note' | 'task' | 'idea' | 'goal' | 'timeline' | 'team';
  title: string;
  content: string;
  position: { x: number; y: number };
  color: string;
  tags: string[];
  assignee?: string;
  dueDate?: string;
  priority?: 'high' | 'medium' | 'low';
  status?: 'pending' | 'in-progress' | 'completed';
}

export interface FloatingPanel {
  id: string;
  title: string;
  isVisible: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface PlanningMode {
  id: string;
  label: string;
  icon: any;
}

export interface CanvasBoardContentsProps {
  projectId?: string;
  userId?: string;
}