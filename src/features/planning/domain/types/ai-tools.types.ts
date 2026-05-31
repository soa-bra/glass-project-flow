// Complete Canvas Types Replacement
import { CanvasElement } from './canvas.types';

// Replace all any types in Canvas AI tools
export interface AIAnalysisProps {
  elements: CanvasElement[];
  selectedElementIds: string[];
  onAnalysisComplete: (results: AIToolsAnalysisResult) => void;
  onSmartSuggestion: (suggestion: AIToolsSmartSuggestion) => void;
}

export interface AIToolsAnalysisResult {
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
  suggestions: Array<AIToolsSmartSuggestion>;
}

export interface AIToolsSmartSuggestion {
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
    canvasState: AIToolsCanvasState;
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
  layers: AIToolsLayerInfo[];
  onProjectGenerate: () => void;
  onGenerated: (preview: GeneratedProjectPreview) => void;
}

export interface GeneratedProjectPreview {
  id: string;
  name: string;
  description: string;
  elements: CanvasElement[];
  layers: AIToolsLayerInfo[];
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
  onGenerated: (mindMap: AIToolsMindMapData) => void;
  onConnectionCreate: (fromId: string, toId: string, type: AIToolsConnectionType) => void;
}

export interface AIToolsMindMapData {
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
    type: AIToolsConnectionType;
    style: AIToolsConnectionStyle;
  }>;
}

export type AIToolsConnectionType = 'parent-child' | 'sibling' | 'reference' | 'flow';

export interface AIToolsConnectionStyle {
  strokeColor: string;
  strokeWidth: number;
  strokeStyle: 'solid' | 'dashed' | 'dotted';
  arrowType: 'none' | 'arrow' | 'circle' | 'diamond';
}

// Smart Connections Panel Types
export interface SmartConnectionsPanelProps {
  elements: CanvasElement[];
  selectedElementIds: string[];
  onCreateConnections: (connections: AIToolsSmartConnection[]) => void;
  onAnalysisUpdate: (analysis: ConnectionAnalysis) => void;
}

export interface AIToolsSmartConnection {
  id: string;
  fromElementId: string;
  toElementId: string;
  type: AIToolsConnectionType;
  confidence: number;
  reasoning: string;
  suggestedStyle: AIToolsConnectionStyle;
}

export interface ConnectionAnalysis {
  suggestedConnections: AIToolsSmartConnection[];
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
  onConnectionCreate: (connections: AIToolsSmartConnection[]) => void;
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
export interface AIToolsCanvasState {
  elements: CanvasElement[];
  selectedElementIds: string[];
  zoom: number;
  panPosition: { x: number; y: number };
  tool: string;
  mode: 'design' | 'present' | 'collaborate';
  layers: AIToolsLayerInfo[];
  history: AIToolsHistoryEntry[];
  settings: AIToolsCanvasSettings;
}

export interface AIToolsCanvasSettings {
  gridEnabled: boolean;
  snapToGrid: boolean;
  gridSize: number;
  showRulers: boolean;
  theme: 'light' | 'dark' | 'auto';
  autoSave: boolean;
  collaborationEnabled: boolean;
}

export interface AIToolsLayerInfo {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  order: number;
  color?: string;
  elements: string[];
}

export interface AIToolsHistoryEntry {
  id: string;
  timestamp: number;
  action: string;
  description: string;
  elements: CanvasElement[];
  userId?: string;
}
