// Enhanced Canvas Event Types
import { CanvasElement } from './canvas.types';

export interface EventCanvasEventData {
  elementId?: string;
  action: string;
  data: Record<string, unknown>;
  timestamp: number;
  [key: string]: unknown;
}

export interface ElementUpdateData {
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  style?: Record<string, unknown>;
  content?: string;
  rotation?: number;
  layer?: number;
  [key: string]: unknown;
}

export interface ElementCreationData {
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: Record<string, unknown>;
  content?: string;
  [key: string]: unknown;
}

export interface PathData {
  path: { x: number; y: number }[];
  style: Record<string, unknown>;
}

export interface LayerData {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  elements: string[];
  [key: string]: unknown;
}

export interface EventCanvasSettings {
  zoom: number;
  pan: { x: number; y: number };
  gridEnabled: boolean;
  snapToGrid: boolean;
  gridSize: number;
  background: string;
  theme: 'light' | 'dark';
  [key: string]: unknown;
}

export interface EventHistoryEntry {
  id: string;
  timestamp: number;
  action: string;
  elements: CanvasElement[];
  description: string;
  [key: string]: unknown;
}

export interface WebWorkerTask {
  id: string;
  type: string;
  data: unknown;
  resolve: (value: unknown) => void;
  reject: (error: Error) => void;
}

export interface FileProcessorData {
  action: string;
  data?: unknown;
}

export interface EventEmitterPayload {
  [key: string]: unknown;
}

export interface EventAIAnalysisResult {
  classification: Array<Record<string, unknown>>;
  sentiment: Array<Record<string, unknown>>;
  suggestions: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

export interface EventSmartElementConfig {
  type: string;
  template: string;
  style: Record<string, unknown>;
  content: string;
  size: { width: number; height: number };
  metadata: Record<string, unknown>;
  [key: string]: unknown;
}
