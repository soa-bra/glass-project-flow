// Enhanced Canvas Types with proper typing
import { CanvasElement } from '../../../types/enhanced-canvas';
import { ElementUpdateData, LayerData, HistoryEntry } from '../../../types/canvas-events';

export interface EnhancedCanvasBoardProps {
  projectId?: string;
  userId?: string;
  boardId?: string;
}

export interface EnhancedCanvasState {
  selectedTool: string;
  selectedElementId: string | null;
  selectedElements: string[];
  showGrid: boolean;
  snapEnabled: boolean;
  elements: CanvasElement[];
  showDefaultView: boolean;
  searchQuery: string;
  zoom: number;
  canvasPosition: { x: number; y: number };
  layers: LayerData[];
  selectedLayerId: string | null;
  history: HistoryEntry[];
  historyIndex: number;
}

export interface ToolDefinition {
  id: string;
  label: string;
  icon: React.ComponentType;
  category: 'basic' | 'smart' | 'file' | 'project' | 'navigation' | 'collaboration' | 'content';
  shortcut?: string;
  description?: string;
}

export interface PlanningModeDefinition {
  id: string;
  label: string;
  icon: React.ComponentType;
}

export interface ElementCreationHandler {
  (element: Partial<CanvasElement>): void;
}

export interface ElementUpdateHandler {
  (elementId: string, updates: ElementUpdateData): void;
}

export interface LayerUpdateHandler {
  (layers: LayerData[]): void;
}

export interface SmartElementHandler {
  (type: string, config: Record<string, unknown>): void;
}

export interface CanvasOperationHandlers {
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onDeleteSelected: () => void;
  onGroup: () => void;
  onUngroup: () => void;
  onLock: () => void;
  onUnlock: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onExport: () => void;
}