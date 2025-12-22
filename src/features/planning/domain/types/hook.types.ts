// Canvas Hook Types - Fixing all any types
import type { CanvasElement } from './canvas.types';

// Hook Props Types
export interface UseCanvasStateProps {
  projectId: string;
  userId: string;
  initialElements?: CanvasElement[];
}

export interface UseCanvasToolsProps {
  selectedTool: string;
  elements: CanvasElement[];
  onElementCreate: (element: Partial<CanvasElement>) => void;
  onElementUpdate: (elementId: string, updates: Partial<CanvasElement>) => void;
}

export interface UseCanvasInteractionProps {
  canvasRef: React.RefObject<HTMLDivElement>;
  selectedTool: string;
  zoom: number;
  elements: CanvasElement[];
  onElementSelect: (elementId: string | null) => void;
  onElementUpdate: (elementId: string, updates: Partial<CanvasElement>) => void;
  onCanvasPositionChange: (position: { x: number; y: number }) => void;
}

// Tool Panel Types
export interface ToolPanelManagerProps {
  selectedTool: string;
  selectedElementId: string | null;
  selectedElements: string[];
  elements: CanvasElement[];
  onToolChange: (tool: string) => void;
  onElementUpdate: (elementId: string, updates: Partial<CanvasElement>) => void;
  onBulkElementUpdate: (elementIds: string[], updates: Partial<CanvasElement>) => void;
}

export interface AppearancePanelManagerProps {
  selectedElementId: string | null;
  selectedElements: string[];
  elements: CanvasElement[];
  onStyleUpdate: (elementId: string, style: Record<string, string | number>) => void;
  onBulkStyleUpdate: (elementIds: string[], style: Record<string, string | number>) => void;
  onElementUpdate: (elementId: string, updates: Partial<CanvasElement>) => void;
}

// AI Tools Types
export interface HookAIAnalysisProps {
  elements: CanvasElement[];
  selectedElementIds: string[];
  onAnalysisComplete: (results: HookAnalysisResult) => void;
  onSmartSuggestion: (suggestion: HookSmartSuggestion) => void;
}

export interface HookAnalysisResult {
  classification: Array<{
    type: string;
    confidence: number;
    elements: string[];
  }>;
  sentiment: Array<{
    element: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    score: number;
  }>;
  suggestions: Array<HookSmartSuggestion>;
}

export interface HookSmartSuggestion {
  id: string;
  type: 'layout' | 'content' | 'style' | 'connection';
  title: string;
  description: string;
  confidence: number;
  action: {
    type: string;
    parameters: Record<string, unknown>;
  };
}

// Layer Management Types
export interface LayerManagerProps {
  layers: HookLayerInfo[];
  selectedLayerId: string | null;
  elements: CanvasElement[];
  onLayerSelect: (layerId: string | null) => void;
  onLayerCreate: (name: string) => void;
  onLayerUpdate: (layerId: string, updates: Partial<HookLayerInfo>) => void;
  onLayerDelete: (layerId: string) => void;
  onElementMoveToLayer: (elementId: string, layerId: string) => void;
}

export interface HookLayerInfo {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  color?: string;
  elements: string[];
  order: number;
}

// Canvas History Types
export interface HistoryManagerProps {
  history: HookHistoryEntry[];
  historyIndex: number;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onExport: () => void;
  onHistoryClear: () => void;
}

export interface HookHistoryEntry {
  id: string;
  timestamp: number;
  action: string;
  elements: CanvasElement[];
  description: string;
  userId?: string;
}

// File Upload Types
export interface FileUploadManagerProps {
  onFileUpload: (files: File[]) => void;
  onFileInsert: (file: File, position: { x: number; y: number }) => void;
  onSmartFileInsert: (file: File, analysis: FileAnalysisResult) => void;
  acceptedFileTypes: string[];
  maxFileSize: number;
}

export interface FileAnalysisResult {
  type: 'image' | 'document' | 'video' | 'audio' | 'other';
  dimensions?: { width: number; height: number };
  suggestedPosition: { x: number; y: number };
  suggestedSize: { width: number; height: number };
  extractedText?: string;
  metadata: Record<string, unknown>;
}

// Collaboration Types
export interface CollaborationManagerProps {
  users: HookCollaborationUser[];
  currentUserId: string;
  onUserCursorUpdate: (userId: string, position: { x: number; y: number }) => void;
  onUserAction: (userId: string, action: CollaborationAction) => void;
  onCommentAdd: (comment: CanvasComment) => void;
  onCommentReply: (commentId: string, reply: string) => void;
}

export interface HookCollaborationUser {
  id: string;
  name: string;
  color: string;
  isOnline: boolean;
  cursor?: { x: number; y: number };
  lastAction?: CollaborationAction;
}

export interface CollaborationAction {
  type: 'element_create' | 'element_update' | 'element_delete' | 'selection_change';
  elementId?: string;
  data: Record<string, unknown>;
  timestamp: number;
}

export interface CanvasComment {
  id: string;
  userId: string;
  position: { x: number; y: number };
  content: string;
  timestamp: number;
  replies: Array<{
    id: string;
    userId: string;
    content: string;
    timestamp: number;
  }>;
  resolved: boolean;
}
