// Enhanced Canvas Types
// Phase 5: TypeScript Improvements

import { ReactNode } from 'react';
import type { CanvasElement } from './canvas';
export type { CanvasElement };

// Tool Types
export interface ToolConfig {
  id: string;
  label: string;
  icon: ReactNode;
  category: 'basic' | 'smart' | 'file' | 'project' | 'navigation' | 'collaboration' | 'content';
  shortcut?: string;
  description?: string;
}

// Element Management Types
export interface ElementUpdateCallbacks {
  onStyleUpdate?: (elementId: string, style: Record<string, string | number>) => void;
  onBulkStyleUpdate?: (elementIds: string[], style: Record<string, string | number>) => void;
  onUpdateElement?: (elementId: string, updates: Partial<CanvasElement>) => void;
}

// Canvas State Types
export interface CanvasState {
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
  layers: LayerInfo[];
  selectedLayerId: string | null;
}

export interface LayerInfo {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  color?: string;
  elements: string[];
}

// Hook Return Types
export interface CanvasElementActions {
  updateElement: (elementId: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (elementId: string) => void;
  duplicateElement: (elementId: string) => void;
  selectElement: (elementId: string) => void;
  clearSelection: () => void;
}

export interface CanvasHelpers {
  getElementPosition: (elementId: string) => { x: number; y: number } | null;
  getElementSize: (elementId: string) => { width: number; height: number } | null;
  isElementVisible: (elementId: string) => boolean;
  getSelectedElements: () => CanvasElement[];
}

// Panel Types
export interface ToolPanelProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
  elements: CanvasElement[];
  selectedElementId: string | null;
  onElementUpdate: (elementId: string, updates: Partial<CanvasElement>) => void;
}

export interface AppearancePanelProps {
  selectedElementId: string | null;
  selectedElements: string[];
  elements: CanvasElement[];
  onStyleUpdate?: (elementId: string, style: Record<string, string | number>) => void;
  onBulkStyleUpdate?: (elementIds: string[], style: Record<string, string | number>) => void;
  onUpdateElement?: (elementId: string, updates: Partial<CanvasElement>) => void;
}

// Style Types
export interface StylePreset {
  id: string;
  name: string;
  category: string;
  style: Record<string, string | number>;
  usage?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TextStyle {
  fontFamily?: string;
  fontSize?: number | string;
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'line-through' | 'overline' | 'underline';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  color?: string;
  lineHeight?: number | string;
  letterSpacing?: number | string;
}

export interface BorderStyle {
  style?: string;
  width?: number | string;
  color?: string;
  radius?: number | string;
  opacity?: number | string;
}

// Event Types
export interface CanvasEventData {
  elementId?: string;
  action: string;
  data: Record<string, unknown>;
  timestamp: number;
}

// Error Types
export interface CanvasError {
  code: string;
  message: string;
  context?: Record<string, unknown>;
}

// Collaboration Types
export interface CollaborationUser {
  id: string;
  name: string;
  color: string;
  isOnline: boolean;
  cursor?: { x: number; y: number };
}

// Analysis Types
export interface AnalysisResult {
  classification: Array<Record<string, unknown>>;
  sentiment: Array<Record<string, unknown>>;
  suggestions: Array<Record<string, unknown>>;
}

// Smart Element Types
export interface SmartElementConfig {
  type: string;
  template: string;
  style: Record<string, string | number>;
  content: string;
  size: { width: number; height: number };
  metadata: Record<string, unknown>;
}

// Point and Selection Types
export interface Point {
  x: number;
  y: number;
}

export interface SelectedElement {
  id: string;
  type: string;
  style: Record<string, string | number>;
  isLocked?: boolean;
  isVisible?: boolean;
  name?: string;
}