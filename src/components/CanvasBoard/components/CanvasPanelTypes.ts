
import { CanvasElement } from '../types';

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  elements: string[];
}

export interface CanvasPanelLayoutProps {
  selectedTool: string;
  selectedElementId: string | null;
  selectedElements: string[];
  zoom: number;
  canvasPosition: { x: number; y: number };
  panSpeed: number;
  lineWidth: number;
  lineStyle: string;
  selectedPenMode: string;
  showGrid: boolean;
  snapEnabled: boolean;
  gridSize: number;
  gridShape: string;
  layers: Layer[];
  selectedLayerId: string | null;
  elements: CanvasElement[];
  
  // Handlers
  setSelectedTool: (tool: string) => void;
  setZoom: (zoom: number) => void;
  setShowGrid: (show: boolean) => void;
  setSnapEnabled: (enabled: boolean) => void;
  handleSmartElementSelect: (elementId: string) => void;
  handleGridSizeChange: (size: number) => void;
  handleGridShapeChange: (shape: string) => void;
  handleAlignToGrid: () => void;
  handleLayerUpdate: (layers: Layer[]) => void;
  handleLayerSelect: (layerId: string) => void;
  handleCopy: () => void;
  handleCut: () => void;
  handlePaste: () => void;
  handleDeleteSelected: () => void;
  handleGroup: () => void;
  handleUngroup: () => void;
  handleLock: () => void;
  handleUnlock: () => void;
  updateElement: (elementId: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (elementId: string) => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  onFitToScreen: () => void;
  onResetView: () => void;
  onPanSpeedChange: (speed: number) => void;
  onLineWidthChange: (width: number) => void;
  onLineStyleChange: (style: string) => void;
  onPenModeSelect: (mode: string) => void;
  onFileUpload: (files: File[]) => void;
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
  onExport: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onSettings: () => void;
  onSmartProjectGenerate: () => void;
  historyIndex: number;
  history: any[];
  selectedSmartElement: string | null;
}
