// Panel Types for Canvas Board
export interface PanelProps {
  isVisible: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  onPositionChange?: (position: { x: number; y: number }) => void;
  onSizeChange?: (size: { width: number; height: number }) => void;
  onClose?: () => void;
}

export interface ToolPanelProps extends PanelProps {
  selectedTool: string;
  onToolChange: (tool: string) => void;
  toolOptions: Record<string, unknown>;
  onOptionsChange: (options: Record<string, unknown>) => void;
}

export interface ElementPanelProps extends PanelProps {
  selectedElementId: string | null;
  selectedElements: string[];
  onElementUpdate: (elementId: string, updates: Record<string, unknown>) => void;
  onElementDelete: (elementId: string) => void;
}

export interface LayerPanelProps extends PanelProps {
  layers: Array<{
    id: string;
    name: string;
    visible: boolean;
    locked: boolean;
    elements: string[];
  }>;
  selectedLayerId: string | null;
  onLayerSelect: (layerId: string) => void;
  onLayerUpdate: (layers: Array<{
    id: string;
    name: string;
    visible: boolean;
    locked: boolean;
    elements: string[];
  }>) => void;
}

export interface SmartPanelProps extends PanelProps {
  aiAnalysisResults: Array<Record<string, unknown>>;
  onGenerateSmartElement: (type: string, config: Record<string, unknown>) => void;
  onSmartConnection: (connections: Array<Record<string, unknown>>) => void;
}