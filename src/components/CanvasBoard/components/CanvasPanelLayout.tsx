import React from 'react';
import { CleanCanvasPanelLayout } from './CleanCanvasPanelLayout';
import { CanvasElement, CanvasLayer } from '../types';

interface CanvasPanelLayoutProps {
  // History props
  historyIndex: number;
  history: any[];
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onExport: () => void;
  onSettings: () => void;
  
  // Tool props
  selectedTool: string;
  selectedElementId: string | null;
  selectedElements: string[];
  zoom: number;
  selectedSmartElement: string;
  showGrid: boolean;
  snapEnabled: boolean;
  gridSize: number;
  gridShape: string;
  layers: CanvasLayer[];
  selectedLayerId: string | null;
  elements: CanvasElement[];
  canvasPosition: { x: number; y: number };
  panSpeed: number;
  lineWidth: number;
  lineStyle: string;
  selectedPenMode: string;
  
  // Handlers
  setSelectedTool: (tool: string) => void;
  setZoom: (zoom: number) => void;
  setShowGrid: (show: boolean) => void;
  setSnapEnabled: (enabled: boolean) => void;
  handleSmartElementSelect: (elementId: string) => void;
  handleGridSizeChange: (size: number) => void;
  handleGridShapeChange: (shape: string) => void;
  handleAlignToGrid: () => void;
  handleLayerUpdate: (layerId: string, updates: Partial<CanvasLayer>) => void;
  handleLayerSelect: (layerId: string) => void;
  handleCopy: () => void;
  handleCut: () => void;
  handlePaste: () => void;
  handleDeleteSelected: () => void;
  handleGroup: () => void;
  handleUngroup: () => void;
  handleLock: () => void;
  handleUnlock: () => void;
  updateElement: (elementId: string, updates: any) => void;
  deleteElement: (elementId: string) => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  onFitToScreen: () => void;
  onResetView: () => void;
  onPanSpeedChange: (speed: number) => void;
  onLineWidthChange: (width: number) => void;
  onLineStyleChange: (style: string) => void;
  onPenModeSelect: (mode: string) => void;
  onFileUpload: (files: FileList) => void;
  onNew: () => void;
  onOpen: () => void;
  onSmartProjectGenerate: () => void;
}

export const CanvasPanelLayout: React.FC<CanvasPanelLayoutProps> = (props) => {
  return <CleanCanvasPanelLayout {...props} />;
};