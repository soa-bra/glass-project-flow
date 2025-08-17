// Hook Types for Canvas Board
import { CanvasElement } from '../../../types/enhanced-canvas';

export interface UseCanvasStateReturn {
  elements: CanvasElement[];
  selectedElementId: string | null;
  selectedElements: string[];
  zoom: number;
  canvasPosition: { x: number; y: number };
  history: Array<{
    id: string;
    timestamp: number;
    action: string;
    elements: CanvasElement[];
    description: string;
  }>;
  historyIndex: number;
  addElement: (element: Partial<CanvasElement>) => void;
  updateElement: (elementId: string, updates: Record<string, unknown>) => void;
  deleteElement: (elementId: string) => void;
  selectElement: (elementId: string | null) => void;
  selectMultipleElements: (elementIds: string[]) => void;
  setZoom: (zoom: number) => void;
  setCanvasPosition: (position: { x: number; y: number }) => void;
  undo: () => void;
  redo: () => void;
}

export interface UseCanvasToolsReturn {
  selectedTool: string;
  toolOptions: Record<string, unknown>;
  setSelectedTool: (tool: string) => void;
  setToolOptions: (options: Record<string, unknown>) => void;
  isDrawing: boolean;
  startDrawing: (position: { x: number; y: number }) => void;
  updateDrawing: (position: { x: number; y: number }) => void;
  finishDrawing: () => void;
  cancelDrawing: () => void;
}

export interface UseCanvasInteractionReturn {
  isDragging: boolean;
  dragStartPosition: { x: number; y: number } | null;
  handleMouseDown: (event: React.MouseEvent) => void;
  handleMouseMove: (event: React.MouseEvent) => void;
  handleMouseUp: (event: React.MouseEvent) => void;
  handleWheel: (event: React.WheelEvent) => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
}

export interface UseCanvasSelectionReturn {
  selectionBox: {
    start: { x: number; y: number };
    end: { x: number; y: number };
    isVisible: boolean;
  } | null;
  startSelection: (position: { x: number; y: number }) => void;
  updateSelection: (position: { x: number; y: number }) => void;
  finishSelection: () => void;
  cancelSelection: () => void;
}

export interface UseCanvasLayersReturn {
  layers: Array<{
    id: string;
    name: string;
    visible: boolean;
    locked: boolean;
    elements: string[];
  }>;
  selectedLayerId: string | null;
  addLayer: (name: string) => void;
  deleteLayer: (layerId: string) => void;
  updateLayer: (layerId: string, updates: Record<string, unknown>) => void;
  selectLayer: (layerId: string) => void;
  moveElementToLayer: (elementId: string, layerId: string) => void;
}

export interface UseSmartFeaturesReturn {
  isAnalyzing: boolean;
  analysisResults: Array<Record<string, unknown>>;
  generateSmartElement: (type: string, prompt: string) => Promise<CanvasElement | null>;
  analyzeElements: (elementIds: string[]) => Promise<Array<Record<string, unknown>>>;
  suggestConnections: (elementIds: string[]) => Promise<Array<Record<string, unknown>>>;
  optimizeLayout: (elementIds: string[]) => Promise<void>;
}