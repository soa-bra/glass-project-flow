// Enhanced Canvas Types
// Phase 5: TypeScript Improvements

import { ReactNode } from 'react';
import type { CanvasElement } from './canvas.types';
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
  layers: EnhancedLayerInfo[];
  selectedLayerId: string | null;
}

export interface EnhancedLayerInfo {
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
export interface EnhancedStylePreset {
  id: string;
  name: string;
  category: string;
  style: Record<string, string | number>;
  usage?: number;
  createdAt: string;
  updatedAt: string;
}

export interface EnhancedTextStyle {
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

export interface EnhancedBorderStyle {
  style?: string;
  width?: number | string;
  color?: string;
  radius?: number | string;
  opacity?: number | string;
}

// Error Types
export interface CanvasError {
  code: string;
  message: string;
  context?: Record<string, unknown>;
}

// Enhanced Collaboration Types
export interface EnhancedCollaborationUser {
  id: string;
  name: string;
  color: string;
  isOnline: boolean;
  cursor?: { x: number; y: number };
}

// Enhanced Analysis Types
export interface EnhancedAnalysisResult {
  classification: Array<Record<string, unknown>>;
  sentiment: Array<Record<string, unknown>>;
  suggestions: Array<Record<string, unknown>>;
}

// Enhanced Smart Element Types
export interface EnhancedSmartElementConfig {
  type: string;
  template: string;
  style: Record<string, string | number>;
  content: string;
  size: { width: number; height: number };
  metadata: Record<string, unknown>;
}

// Enhanced Point Types
export interface EnhancedPoint {
  x: number;
  y: number;
}

export interface EnhancedSelectedElement {
  id: string;
  type: string;
  style: Record<string, string | number>;
  isLocked?: boolean;
  isVisible?: boolean;
  name?: string;
}
