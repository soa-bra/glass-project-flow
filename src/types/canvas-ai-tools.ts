// Complete Canvas Types Replacement
import { CanvasElement } from '../types/enhanced-canvas';

// Replace all any types in Canvas AI tools
export interface AIAnalysisProps {
  elements: CanvasElement[];
  selectedElementIds: string[];
  onAnalysisComplete: (results: AIAnalysisResult) => void;
  onSmartSuggestion: (suggestion: SmartSuggestion) => void;
}

export interface AIAnalysisResult {
  classification: Array<{
    type: string;
    confidence: number;
    elements: string[];
    description: string;
  }>;
  sentiment: Array<{
    element: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    score: number;
    reasoning: string;
  }>;
  suggestions: Array<SmartSuggestion>;
}

export interface SmartSuggestion {
  id: string;
  type: 'layout' | 'content' | 'style' | 'connection';
  title: string;
  description: string;
  confidence: number;
  action: {
    type: string;
    parameters: Record<string, unknown>;
  };
  elementIds?: string[];
}

// AI Command Console Types
export interface AICommandConsoleProps {
  isVisible: boolean;
  onToggle: () => void;
  onCommand: (prompt: string, result: AICommandResult) => void;
  context: {
    selectedElements: CanvasElement[];
    canvasState: CanvasState;
  };
}

export interface AICommandResult {
  type: 'element_creation' | 'element_modification' | 'layout_suggestion' | 'analysis';
  data: Record<string, unknown>;
  elements?: CanvasElement[];
  message: string;
  confidence: number;
}

// Smart Project Generator Types
export interface SmartProjectGeneratorProps {
  elements: CanvasElement[];
  layers: LayerInfo[];
  onProjectGenerate: () => void;
  onGenerated: (preview: GeneratedProjectPreview) => void;
}

export interface GeneratedProjectPreview {
  id: string;
  name: string;
  description: string;
  elements: CanvasElement[];
  layers: LayerInfo[];
  metadata: {
    generatedAt: string;
    aiModel: string;
    prompt: string;
    confidence: number;
  };
}

// Mind Map Panel Types
export interface MindMapPanelProps {
  isVisible: boolean;
  centerElement: CanvasElement | null;
  connectedElements: CanvasElement[];
  onGenerated: (mindMap: MindMapData) => void;
  onConnectionCreate: (fromId: string, toId: string, type: ConnectionType) => void;
}

export interface MindMapData {
  centerNode: {
    id: string;
    content: string;
    position: { x: number; y: number };
  };
  branches: Array<{
    id: string;
    content: string;
    position: { x: number; y: number };
    connections: string[];
    level: number;
  }>;
  connections: Array<{
    from: string;
    to: string;
    type: ConnectionType;
    style: ConnectionStyle;
  }>;
}

export type ConnectionType = 'parent-child' | 'sibling' | 'reference' | 'flow';

export interface ConnectionStyle {
  strokeColor: string;
  strokeWidth: number;
  strokeStyle: 'solid' | 'dashed' | 'dotted';
  arrowType: 'none' | 'arrow' | 'circle' | 'diamond';
}

// Smart Connections Panel Types
export interface SmartConnectionsPanelProps {
  elements: CanvasElement[];
  selectedElementIds: string[];
  onCreateConnections: (connections: SmartConnection[]) => void;
  onAnalysisUpdate: (analysis: ConnectionAnalysis) => void;
}

export interface SmartConnection {
  id: string;
  fromElementId: string;
  toElementId: string;
  type: ConnectionType;
  confidence: number;
  reasoning: string;
  suggestedStyle: ConnectionStyle;
}

export interface ConnectionAnalysis {
  suggestedConnections: SmartConnection[];
  clusterAnalysis: Array<{
    clusterId: string;
    elementIds: string[];
    type: 'semantic' | 'visual' | 'spatial';
    confidence: number;
  }>;
  layoutSuggestions: Array<{
    type: 'grid' | 'tree' | 'radial' | 'force-directed';
    confidence: number;
    parameters: Record<string, unknown>;
  }>;
}

// Smart Root Connector Types
export interface SmartRootConnectorProps {
  rootElement: CanvasElement | null;
  connectedElements: CanvasElement[];
  generatedNodes: GeneratedNode[];
  onNodeGenerate: (prompt: string, parentId: string) => void;
  onConnectionCreate: (connections: SmartConnection[]) => void;
}

export interface GeneratedNode {
  id: string;
  content: string;
  type: 'idea' | 'task' | 'note' | 'reference';
  parentId: string;
  confidence: number;
  metadata: {
    generatedAt: string;
    prompt: string;
    aiModel: string;
  };
}

// Canvas State Interface
export interface CanvasState {
  elements: CanvasElement[];
  selectedElementIds: string[];
  zoom: number;
  panPosition: { x: number; y: number };
  tool: string;
  mode: 'design' | 'present' | 'collaborate';
  layers: LayerInfo[];
  history: HistoryEntry[];
  settings: CanvasSettings;
}

export interface CanvasSettings {
  gridEnabled: boolean;
  snapToGrid: boolean;
  gridSize: number;
  showRulers: boolean;
  theme: 'light' | 'dark' | 'auto';
  autoSave: boolean;
  collaborationEnabled: boolean;
}

export interface LayerInfo {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  order: number;
  color?: string;
  elements: string[];
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  action: string;
  description: string;
  elements: CanvasElement[];
  userId?: string;
}