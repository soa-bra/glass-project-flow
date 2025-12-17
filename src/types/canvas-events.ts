// Enhanced Canvas Event Types
import { CanvasElement } from "./enhanced-canvas";

export interface CanvasEventData {
  elementId?: string;
  action: string;
  data: Record<string, unknown>;
  timestamp: number;
  [key: string]: unknown;
}

/**
 * ✅ Pointer Events payload (موحد) — يساعدنا نوثق كل تفاعلات Miro-style
 */
export interface CanvasPointerEventPayload {
  pointerId: number;
  pointerType: "mouse" | "pen" | "touch";
  buttons: number;
  button: number;
  clientX: number;
  clientY: number;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
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

export interface CanvasSettings {
  zoom: number;
  pan: { x: number; y: number };
  gridEnabled: boolean;
  snapToGrid: boolean;
  gridSize: number;
  background: string;
  theme: "light" | "dark";
  [key: string]: unknown;
}

export interface HistoryEntry {
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

export interface AIAnalysisResult {
  classification: Array<Record<string, unknown>>;
  sentiment: Array<Record<string, unknown>>;
  suggestions: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

export interface SmartElementConfig {
  type: string;
  template: string;
  style: Record<string, unknown>;
  content: string;
  size: { width: number; height: number };
  metadata: Record<string, unknown>;
  [key: string]: unknown;
}
