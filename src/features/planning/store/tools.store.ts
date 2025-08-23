// ===============================
// Tools Store - Planning Board
// متجر أدوات لوحة التخطيط
// ===============================

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { ToolType, BaseTool, SelectionToolState, PanToolState, ZoomToolState, TextToolState, ShapesToolState, SmartPenToolState } from '../types/tools';

interface ToolsStore {
  // Current active tool
  activeTool: ToolType;
  
  // Tool states
  selectionTool: SelectionToolState;
  panTool: PanToolState;
  zoomTool: ZoomToolState;
  textTool: TextToolState;
  shapesTool: ShapesToolState;
  smartPenTool: SmartPenToolState;
  
  // Tool definitions
  tools: Record<ToolType, BaseTool>;
  
  // Tool history and metrics
  toolHistory: ToolType[];
  toolUsage: Record<ToolType, number>;
  
  // Actions - Tool management
  setActiveTool: (tool: ToolType) => void;
  getPreviousTool: () => ToolType;
  resetToolToDefault: () => void;
  
  // Actions - Selection Tool
  setSelectionMode: (mode: 'select' | 'move' | 'resize' | 'rotate') => void;
  setMultiSelect: (enabled: boolean) => void;
  startDragging: (position: { x: number; y: number }) => void;
  stopDragging: () => void;
  updateSelectionBox: (start: { x: number; y: number }, end: { x: number; y: number }) => void;
  
  // Actions - Pan Tool
  startPanning: (position: { x: number; y: number }) => void;
  updatePanPosition: (position: { x: number; y: number }) => void;
  stopPanning: () => void;
  
  // Actions - Zoom Tool
  setZoomMode: (mode: 'zoom-in' | 'zoom-out' | 'zoom-area') => void;
  startZooming: (position: { x: number; y: number }) => void;
  stopZooming: () => void;
  
  // Actions - Text Tool
  setTextMode: (mode: 'free-text' | 'text-box' | 'text-on-path') => void;
  startTextEditing: (elementId: string) => void;
  stopTextEditing: () => void;
  updateTextStyle: (style: Partial<TextToolState>) => void;
  
  // Actions - Shapes Tool
  setSelectedShape: (shape: string) => void;
  startDrawingShape: (position: { x: number; y: number }) => void;
  updateShapeDrawing: (position: { x: number; y: number }) => void;
  stopDrawingShape: () => void;
  
  // Actions - Smart Pen Tool
  setSmartPenMode: (mode: 'draw' | 'erase' | 'smart-convert' | 'connect' | 'annotate') => void;
  startDrawingStroke: (position: { x: number; y: number }) => void;
  addStrokePoint: (position: { x: number; y: number }) => void;
  finishStroke: () => void;
  clearStrokes: () => void;
  
  // Utilities
  getToolById: (toolId: ToolType) => BaseTool | null;
  isToolActive: (toolId: ToolType) => boolean;
  canActivateTool: (toolId: ToolType) => boolean;
}

export const useToolsStore = create<ToolsStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    activeTool: 'select',
    
    selectionTool: {
      mode: 'select',
      multiSelect: false,
      isDragging: false,
    },
    
    panTool: {
      isPanning: false,
    },
    
    zoomTool: {
      isZooming: false,
      zoomMode: 'zoom-in',
    },
    
    textTool: {
      isEditing: false,
      textMode: 'free-text',
      fontSize: 16,
      fontFamily: 'IBM Plex Sans Arabic',
      fontWeight: 'normal',
      textAlign: 'right',
      color: '#000000',
    },
    
    shapesTool: {
      selectedShape: 'rectangle',
      isDrawing: false,
      style: {
        fill: '#ffffff',
        stroke: '#000000',
        strokeWidth: 2,
        opacity: 1,
        borderRadius: 0,
      },
    },
    
    smartPenTool: {
      mode: 'draw',
      isDrawing: false,
      strokeHistory: [],
      recognitionEnabled: true,
      smoothingLevel: 0.5,
      pressureSensitive: false,
      style: {
        strokeWidth: 3,
        strokeColor: '#000000',
        opacity: 1,
        lineCap: 'round',
        lineJoin: 'round',
      },
    },
    
    tools: {
      select: {
        id: 'select',
        name: 'أداة التحديد',
        icon: 'cursor-arrow',
        shortcut: 'V',
        description: 'تحديد وتحريك العناصر',
        category: 'selection',
        enabled: true,
      },
      pan: {
        id: 'pan',
        name: 'أداة التحريك',
        icon: 'hand',
        shortcut: 'H',
        description: 'تحريك العرض',
        category: 'navigation',
        enabled: true,
      },
      zoom: {
        id: 'zoom',
        name: 'أداة التكبير',
        icon: 'magnifying-glass',
        shortcut: 'Z',
        description: 'تكبير وتصغير العرض',
        category: 'navigation',
        enabled: true,
      },
      text: {
        id: 'text',
        name: 'أداة النص',
        icon: 'type',
        shortcut: 'T',
        description: 'إضافة وتحرير النصوص',
        category: 'content',
        enabled: true,
      },
      shapes: {
        id: 'shapes',
        name: 'أداة الأشكال',
        icon: 'shapes',
        shortcut: 'R',
        description: 'رسم الأشكال الهندسية',
        category: 'drawing',
        enabled: true,
      },
      'smart-pen': {
        id: 'smart-pen',
        name: 'القلم الذكي',
        icon: 'pencil',
        shortcut: 'P',
        description: 'الرسم الحر والتحويل الذكي',
        category: 'drawing',
        enabled: true,
      },
      'file-upload': {
        id: 'file-upload',
        name: 'رفع الملفات',
        icon: 'upload',
        shortcut: 'U',
        description: 'رفع وإدراج الملفات',
        category: 'content',
        enabled: true,
      },
      comment: {
        id: 'comment',
        name: 'أداة التعليق',
        icon: 'message-circle',
        shortcut: 'C',
        description: 'إضافة التعليقات والملاحظات',
        category: 'content',
        enabled: true,
      },
      'smart-element': {
        id: 'smart-element',
        name: 'العناصر الذكية',
        icon: 'puzzle',
        shortcut: 'S',
        description: 'إدراج العناصر الذكية',
        category: 'smart',
        enabled: true,
      },
      frame: {
        id: 'frame',
        name: 'إطار',
        icon: 'frame',
        shortcut: 'F',
        description: 'إنشاء إطارات لتجميع العناصر',
        category: 'content',
        enabled: true,
      },
    },
    
    toolHistory: ['select'],
    toolUsage: {
      select: 0,
      pan: 0,
      zoom: 0,
      text: 0,
      shapes: 0,
      'smart-pen': 0,
      'file-upload': 0,
      comment: 0,
      'smart-element': 0,
      frame: 0,
    },
    
    // Tool management
    setActiveTool: (tool: ToolType) => {
      const { activeTool, toolHistory, toolUsage } = get();
      
      if (activeTool === tool) return;
      
      set({
        activeTool: tool,
        toolHistory: [tool, ...toolHistory.slice(0, 9)], // Keep last 10 tools
        toolUsage: {
          ...toolUsage,
          [tool]: (toolUsage[tool] || 0) + 1,
        },
      });
    },
    
    getPreviousTool: () => {
      const { toolHistory } = get();
      return toolHistory[1] || 'select';
    },
    
    resetToolToDefault: () => {
      set({ activeTool: 'select' });
    },
    
    // Selection Tool
    setSelectionMode: (mode) => {
      set({
        selectionTool: {
          ...get().selectionTool,
          mode,
        },
      });
    },
    
    setMultiSelect: (enabled) => {
      set({
        selectionTool: {
          ...get().selectionTool,
          multiSelect: enabled,
        },
      });
    },
    
    startDragging: (position) => {
      set({
        selectionTool: {
          ...get().selectionTool,
          isDragging: true,
          dragStartPos: position,
        },
      });
    },
    
    stopDragging: () => {
      set({
        selectionTool: {
          ...get().selectionTool,
          isDragging: false,
          dragStartPos: undefined,
          selectionBox: undefined,
        },
      });
    },
    
    updateSelectionBox: (start, end) => {
      set({
        selectionTool: {
          ...get().selectionTool,
          selectionBox: { start, end },
        },
      });
    },
    
    // Pan Tool
    startPanning: (position) => {
      set({
        panTool: {
          isPanning: true,
          startPosition: position,
          lastPosition: position,
        },
      });
    },
    
    updatePanPosition: (position) => {
      set({
        panTool: {
          ...get().panTool,
          lastPosition: position,
        },
      });
    },
    
    stopPanning: () => {
      set({
        panTool: {
          isPanning: false,
          startPosition: undefined,
          lastPosition: undefined,
        },
      });
    },
    
    // Zoom Tool
    setZoomMode: (mode) => {
      set({
        zoomTool: {
          ...get().zoomTool,
          zoomMode: mode,
        },
      });
    },
    
    startZooming: (position) => {
      set({
        zoomTool: {
          ...get().zoomTool,
          isZooming: true,
          startPosition: position,
        },
      });
    },
    
    stopZooming: () => {
      set({
        zoomTool: {
          ...get().zoomTool,
          isZooming: false,
          startPosition: undefined,
        },
      });
    },
    
    // Text Tool
    setTextMode: (mode) => {
      set({
        textTool: {
          ...get().textTool,
          textMode: mode,
        },
      });
    },
    
    startTextEditing: (elementId) => {
      set({
        textTool: {
          ...get().textTool,
          isEditing: true,
          editingElementId: elementId,
        },
      });
    },
    
    stopTextEditing: () => {
      set({
        textTool: {
          ...get().textTool,
          isEditing: false,
          editingElementId: undefined,
        },
      });
    },
    
    updateTextStyle: (style) => {
      set({
        textTool: {
          ...get().textTool,
          ...style,
        },
      });
    },
    
    // Shapes Tool
    setSelectedShape: (shape) => {
      set({
        shapesTool: {
          ...get().shapesTool,
          selectedShape: shape as any,
        },
      });
    },
    
    startDrawingShape: (position) => {
      set({
        shapesTool: {
          ...get().shapesTool,
          isDrawing: true,
          startPosition: position,
          currentPosition: position,
        },
      });
    },
    
    updateShapeDrawing: (position) => {
      set({
        shapesTool: {
          ...get().shapesTool,
          currentPosition: position,
        },
      });
    },
    
    stopDrawingShape: () => {
      set({
        shapesTool: {
          ...get().shapesTool,
          isDrawing: false,
          startPosition: undefined,
          currentPosition: undefined,
        },
      });
    },
    
    // Smart Pen Tool
    setSmartPenMode: (mode) => {
      set({
        smartPenTool: {
          ...get().smartPenTool,
          mode,
        },
      });
    },
    
    startDrawingStroke: (position) => {
      set({
        smartPenTool: {
          ...get().smartPenTool,
          isDrawing: true,
          currentStroke: [position],
        },
      });
    },
    
    addStrokePoint: (position) => {
      const { smartPenTool } = get();
      if (!smartPenTool.currentStroke) return;
      
      set({
        smartPenTool: {
          ...smartPenTool,
          currentStroke: [...smartPenTool.currentStroke, position],
        },
      });
    },
    
    finishStroke: () => {
      const { smartPenTool } = get();
      if (!smartPenTool.currentStroke) return;
      
      set({
        smartPenTool: {
          ...smartPenTool,
          isDrawing: false,
          strokeHistory: [...smartPenTool.strokeHistory, smartPenTool.currentStroke],
          currentStroke: undefined,
        },
      });
    },
    
    clearStrokes: () => {
      set({
        smartPenTool: {
          ...get().smartPenTool,
          strokeHistory: [],
          currentStroke: undefined,
        },
      });
    },
    
    // Utilities
    getToolById: (toolId) => {
      return get().tools[toolId] || null;
    },
    
    isToolActive: (toolId) => {
      return get().activeTool === toolId;
    },
    
    canActivateTool: (toolId) => {
      const tool = get().getToolById(toolId);
      return tool ? tool.enabled : false;
    },
  }))
);