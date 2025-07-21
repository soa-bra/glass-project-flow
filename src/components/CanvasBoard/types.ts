// Re-export CanvasElement from the main types to ensure consistency
export type { CanvasElement, ElementStyle } from '../../types/canvas';
import type { CanvasElement } from '../../types/canvas';

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