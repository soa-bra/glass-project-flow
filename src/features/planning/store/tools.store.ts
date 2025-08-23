import { create } from 'zustand';
import { ToolState, ToolType, Tool, SmartPenOptions, TextOptions, ShapeOptions, FileUploadOptions, CommentOptions, SelectionOptions, ZoomOptions, PanOptions } from '../types/tools.types';

interface ToolsStore extends ToolState {
  // Tool Actions
  setActiveTool: (tool: ToolType) => void;
  updateToolOptions: <T extends ToolType>(tool: T, options: Partial<any>) => void;
  resetToolOptions: (tool: ToolType) => void;
  
  // Specific Tool Getters
  getSmartPenOptions: () => SmartPenOptions;
  getTextOptions: () => TextOptions;
  getShapeOptions: () => ShapeOptions;
  getFileUploadOptions: () => FileUploadOptions;
  getCommentOptions: () => CommentOptions;
  getSelectionOptions: () => SelectionOptions;
  getZoomOptions: () => ZoomOptions;
  getPanOptions: () => PanOptions;
}

const defaultTools: Record<ToolType, Tool> = {
  selection: {
    id: 'selection',
    name: 'تحديد',
    icon: 'pointer',
    shortcut: 'V',
    panel: 'selection_panel',
    cursor: 'default'
  },
  smart_pen: {
    id: 'smart_pen',
    name: 'القلم الذكي',
    icon: 'pen-tool',
    shortcut: 'P',
    panel: 'smart_pen_panel',
    cursor: 'crosshair'
  },
  zoom: {
    id: 'zoom',
    name: 'تكبير/تصغير',
    icon: 'zoom-in',
    shortcut: 'Z',
    panel: 'zoom_panel',
    cursor: 'zoom-in'
  },
  pan: {
    id: 'pan',
    name: 'تحريك العرض',
    icon: 'hand',
    shortcut: 'H',
    panel: 'pan_panel',
    cursor: 'grab'
  },
  file_uploader: {
    id: 'file_uploader',
    name: 'رفع الملفات',
    icon: 'upload',
    shortcut: 'U',
    panel: 'file_upload_panel',
    cursor: 'copy'
  },
  comment: {
    id: 'comment',
    name: 'تعليق',
    icon: 'message-circle',
    shortcut: 'C',
    panel: 'comment_panel',
    cursor: 'text'
  },
  text: {
    id: 'text',
    name: 'نص',
    icon: 'type',
    shortcut: 'T',
    panel: 'text_panel',
    cursor: 'text'
  },
  shapes: {
    id: 'shapes',
    name: 'أشكال',
    icon: 'square',
    shortcut: 'R',
    panel: 'shapes_panel',
    cursor: 'crosshair'
  },
  smart_element: {
    id: 'smart_element',
    name: 'عناصر ذكية',
    icon: 'grid-3x3',
    shortcut: 'S',
    panel: 'smart_elements_panel',
    cursor: 'crosshair'
  },
  frame: {
    id: 'frame',
    name: 'إطار',
    icon: 'frame',
    shortcut: 'F',
    panel: 'frame_panel',
    cursor: 'crosshair'
  }
};

const defaultToolOptions: Record<ToolType, any> = {
  smart_pen: {
    strokeWidth: 2,
    color: 'hsl(var(--foreground))',
    style: 'solid',
    smartConversion: true,
    conversionSensitivity: 80,
    mode: 'draw'
  } as SmartPenOptions,
  
  text: {
    fontFamily: 'IBM Plex Sans Arabic',
    fontSize: 14,
    fontWeight: '400',
    color: 'hsl(var(--foreground))',
    alignment: 'right',
    italic: false,
    underline: false,
    rtl: true,
    type: 'free'
  } as TextOptions,
  
  shapes: {
    fill: 'hsl(var(--background))',
    stroke: 'hsl(var(--border))',
    strokeWidth: 1,
    opacity: 1,
    cornerRadius: 0,
    category: 'basic',
    selectedShape: 'rectangle'
  } as ShapeOptions,
  
  file_uploader: {
    acceptedTypes: ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.pdf'],
    maxSize: 10 * 1024 * 1024, // 10MB
    smartInsert: true,
    autoConvert: true
  } as FileUploadOptions,
  
  comment: {
    type: 'text',
    bubbleType: 'note',
    visibility: 'all',
    mentions: []
  } as CommentOptions,
  
  selection: {
    multiSelect: true,
    selectionMode: 'single',
    transformHandles: true
  } as SelectionOptions,
  
  zoom: {
    level: 1,
    min: 0.1,
    max: 5,
    step: 0.1,
    fitOptions: 'screen'
  } as ZoomOptions,
  
  pan: {
    momentum: true,
    boundaries: false,
    speed: 1
  } as PanOptions,

  smart_element: {
    selectedElement: 'thinking_board',
    category: 'collaboration',
    smartGeneration: true
  },

  frame: {
    background: 'transparent',
    border: true,
    borderColor: 'hsl(var(--border))',
    borderWidth: 1
  }
};

export const useToolsStore = create<ToolsStore>((set, get) => ({
  // Initial State
  activeTool: 'selection',
  tools: defaultTools,
  toolOptions: defaultToolOptions,

  // Tool Actions
  setActiveTool: (tool) => set((state) => ({
    activeTool: tool,
    tools: Object.fromEntries(
      Object.entries(state.tools).map(([key, toolData]) => [
        key,
        { ...toolData, isActive: key === tool }
      ])
    ) as Record<ToolType, Tool>
  })),

  updateToolOptions: (tool, options) => set((state) => ({
    toolOptions: {
      ...state.toolOptions,
      [tool]: {
        ...state.toolOptions[tool],
        ...options
      }
    }
  })),

  resetToolOptions: (tool) => set((state) => ({
    toolOptions: {
      ...state.toolOptions,
      [tool]: defaultToolOptions[tool]
    }
  })),

  // Specific Tool Getters
  getSmartPenOptions: () => get().toolOptions.smart_pen as SmartPenOptions,
  getTextOptions: () => get().toolOptions.text as TextOptions,
  getShapeOptions: () => get().toolOptions.shapes as ShapeOptions,
  getFileUploadOptions: () => get().toolOptions.file_uploader as FileUploadOptions,
  getCommentOptions: () => get().toolOptions.comment as CommentOptions,
  getSelectionOptions: () => get().toolOptions.selection as SelectionOptions,
  getZoomOptions: () => get().toolOptions.zoom as ZoomOptions,
  getPanOptions: () => get().toolOptions.pan as PanOptions
}));