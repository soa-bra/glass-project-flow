export interface CanvasElement {
  id: string;
  type: 'text' | 'shape' | 'sticky' | 'comment' | 'upload' | 'timeline' | 'mindmap' | 'smart' | 'brainstorm' | 'root' | 'moodboard' | 'line';
  position: { x: number; y: number };
  size: { width: number; height: number };
  content?: string;
  style?: Record<string, any>;
  locked?: boolean;
}

export interface CanvasBoardContentsProps {
  projectId?: string;
  userId?: string;
}

export interface CanvasState {
  selectedTool: string;
  selectedElementId: string | null;
  showGrid: boolean;
  snapEnabled: boolean;
  elements: CanvasElement[];
  showDefaultView: boolean;
  searchQuery: string;
  zoom: number;
  canvasPosition: { x: number; y: number };
}

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

export interface Tool {
  id: string;
  label: string;
  icon: any;
  category: 'basic' | 'smart' | 'file' | 'project' | 'navigation' | 'collaboration' | 'content';
  shortcut?: string;
  description?: string;
}

export interface PlanningMode {
  id: string;
  label: string;
  icon: any;
}