// Enhanced TypeScript Types for Canvas Components
import type { CanvasElement } from './canvas.types';

// Canvas Component Props
export interface CanvasProps {
  elements: CanvasElement[];
  selectedTool: string;
  selectedElementId: string | null;
  selectedElements: string[];
  zoom: number;
  canvasPosition: { x: number; y: number };
  showGrid: boolean;
  snapEnabled: boolean;
  onElementSelect: (elementId: string | null) => void;
  onElementUpdate: (elementId: string, updates: Partial<CanvasElement>) => void;
  onElementCreate: (element: Partial<CanvasElement>) => void;
  onElementDelete: (elementId: string) => void;
  onSelectionChange: (elementIds: string[]) => void;
  onCanvasPositionChange: (position: { x: number; y: number }) => void;
  onZoomChange: (zoom: number) => void;
}

// Canvas Element Component Props
export interface CanvasElementProps {
  element: CanvasElement;
  isSelected: boolean;
  isMultiSelected: boolean;
  zoom: number;
  onSelect: (elementId: string) => void;
  onUpdate: (elementId: string, updates: Partial<CanvasElement>) => void;
  onDelete: (elementId: string) => void;
  onDragStart: (elementId: string, startPosition: { x: number; y: number }) => void;
  onDrag: (elementId: string, newPosition: { x: number; y: number }) => void;
  onDragEnd: (elementId: string, finalPosition: { x: number; y: number }) => void;
}

// Element Resize Handles Props
export interface ElementResizeHandlesProps {
  element: CanvasElement;
  isVisible: boolean;
  onResize: (elementId: string, newSize: { width: number; height: number }) => void;
  onResizeStart: (elementId: string) => void;
  onResizeEnd: (elementId: string) => void;
}

// Selection Bounding Box Props
export interface SelectionBoundingBoxProps {
  selectedElements: CanvasElement[];
  zoom: number;
  onBulkMove: (offset: { x: number; y: number }) => void;
  onBulkResize: (scaleFactor: number) => void;
  onUpdateElement: (elementId: string, updates: Partial<CanvasElement>) => void;
}

// Canvas Drawing Preview Props
export interface CanvasDrawingPreviewProps {
  isDrawing: boolean;
  drawingPath: Array<{ x: number; y: number }>;
  drawingStyle: {
    strokeColor: string;
    strokeWidth: number;
    strokeStyle: string;
  };
  zoom: number;
}

// Canvas Grid Props
export interface CanvasGridProps {
  showGrid: boolean;
  gridSize: number;
  zoom: number;
  canvasPosition: { x: number; y: number };
  gridColor: string;
  gridOpacity: number;
}

// Tool Cursor Props
export interface ToolCursorProps {
  selectedTool: string;
  getCursorStyle: (tool: string) => string;
}

// Smart Pen Renderer Props
export interface SmartPenRendererProps {
  completedPaths: Array<{
    path: Array<{ x: number; y: number }>;
    style: {
      strokeColor: string;
      strokeWidth: number;
      strokeStyle: string;
    };
  }>;
  isVisible: boolean;
  zoom: number;
}

// Archive Component Props
export interface ArchiveSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  categories: Array<{
    id: string;
    name: string;
    icon: React.ComponentType;
    count: number;
  }>;
}

// Style Preset Manager Props
export interface StylePresetManagerProps {
  selectedElementId: string | null;
  selectedElements: string[];
  currentStyle: Record<string, string | number>;
  onStyleUpdate: (elementId: string, style: Record<string, string | number>) => void;
  onBulkStyleUpdate: (elementIds: string[], style: Record<string, string | number>) => void;
  presets: Array<{
    id: string;
    name: string;
    category: string;
    style: Record<string, string | number>;
    usage?: number;
    createdAt: string;
    updatedAt: string;
  }>;
  onPresetSave: (preset: {
    name: string;
    category: string;
    style: Record<string, string | number>;
  }) => void;
  onPresetDelete: (presetId: string) => void;
}

// Enhanced Selection Operations
export interface SelectionOperationsProps {
  selectedElementIds: string[];
  elements: CanvasElement[];
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onGroup: () => void;
  onUngroup: () => void;
  onLock: () => void;
  onUnlock: () => void;
  onAlignLeft: () => void;
  onAlignCenter: () => void;
  onAlignRight: () => void;
  onAlignTop: () => void;
  onAlignMiddle: () => void;
  onAlignBottom: () => void;
  onDistributeHorizontal: () => void;
  onDistributeVertical: () => void;
  onElementUpdate: (elementId: string, updates: Partial<CanvasElement>) => void;
}

// Canvas Event Handler Types
export interface ComponentCanvasEventHandlers {
  handleMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseUp: (event: React.MouseEvent<HTMLDivElement>) => void;
  handleWheel: (event: React.WheelEvent<HTMLDivElement>) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  handleKeyUp: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  handleDoubleClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  handleContextMenu: (event: React.MouseEvent<HTMLDivElement>) => void;
}
