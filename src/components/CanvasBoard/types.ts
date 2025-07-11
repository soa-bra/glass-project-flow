
export interface CanvasElement {
  id: string;
  type: 'text' | 'shape' | 'smart-element' | 'drawing' | 'sticky' | 'image' | 'line' | 'comment' | 'upload' | 'timeline' | 'mindmap' | 'brainstorm' | 'root' | 'moodboard';
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  content?: string;
  style?: {
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    color?: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    textAlign?: string;
    borderWidth?: number;
    borderRadius?: number;
    opacity?: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    padding?: string;
    rotation?: string;
    transform?: string;
  };
  // Drawing-specific properties
  path?: { x: number; y: number }[];
  lineWidth?: number;
  color?: string;
  // General properties
  zIndex?: number;
  locked?: boolean;
  visible?: boolean;
  rotation?: number;
  metadata?: any;
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
}

export interface PlanningMode {
  id: string;
  label: string;
  icon: any;
}
