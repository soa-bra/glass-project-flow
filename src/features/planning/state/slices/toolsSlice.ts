/**
 * Tools Slice - إدارة الأدوات وإعداداتها
 */

import { StateCreator } from 'zustand';
import { nanoid } from 'nanoid';
import type { CanvasElement } from '@/types/canvas';
import { ToolId, ToolSettings, TextElement, DEFAULT_TOOL_SETTINGS } from '../types';

export interface ToolsSlice {
  activeTool: ToolId;
  toolSettings: ToolSettings;
  isDrawing: boolean;
  drawStartPoint: { x: number; y: number } | null;
  tempElement: CanvasElement | null;
  selectedSmartElement: string | null;
  
  // Text Management
  editingTextId: string | null;
  typingMode: boolean;
  
  // ✅ آخر عقدة خريطة ذهنية محددة بأداة العناصر الذكية
  lastSmartSelectedMindMapNode: string | null;
  
  // Tool Actions
  setActiveTool: (tool: ToolId) => void;
  updateToolSettings: (tool: keyof ToolSettings, settings: Partial<ToolSettings[keyof ToolSettings]>) => void;
  setIsDrawing: (drawing: boolean) => void;
  setDrawStartPoint: (point: { x: number; y: number } | null) => void;
  setTempElement: (element: CanvasElement | null) => void;
  setSelectedSmartElement: (elementType: string | null) => void;
  setLastSmartSelectedMindMapNode: (nodeId: string | null) => void;
  
  // Text Actions
  addText: (textData: Partial<TextElement>) => string;
  updateTextContent: (elementId: string, content: string) => void;
  updateTextStyle: (elementId: string, style: Partial<Record<string, any>>) => void;
  startEditingText: (elementId: string) => void;
  stopEditingText: (elementId?: string) => void;
  startTyping: () => void;
  stopTyping: () => void;
}

export const createToolsSlice: StateCreator<
  any,
  [],
  [],
  ToolsSlice
> = (set, get) => ({
  activeTool: 'selection_tool',
  toolSettings: DEFAULT_TOOL_SETTINGS,
  isDrawing: false,
  drawStartPoint: null,
  tempElement: null,
  selectedSmartElement: null,
  editingTextId: null,
  typingMode: false,
  lastSmartSelectedMindMapNode: null,
  
  setActiveTool: (tool) => {
    set({ activeTool: tool, isDrawing: false, drawStartPoint: null, tempElement: null });
  },
  
  updateToolSettings: (tool, settings) => {
    set((state: any) => ({
      toolSettings: {
        ...state.toolSettings,
        [tool]: { ...state.toolSettings[tool], ...settings }
      }
    }));
  },
  
  setIsDrawing: (drawing) => set({ isDrawing: drawing }),
  setDrawStartPoint: (point) => set({ drawStartPoint: point }),
  setTempElement: (element) => set({ tempElement: element }),
  setSelectedSmartElement: (elementType) => set({ selectedSmartElement: elementType }),
  setLastSmartSelectedMindMapNode: (nodeId) => set({ lastSmartSelectedMindMapNode: nodeId }),
  
  addText: (textData) => {
    const id = textData.id || nanoid();
    const textSettings = get().toolSettings.text;
    
    const element: TextElement = {
      id,
      type: 'text',
      position: textData.position || { x: 100, y: 100 },
      size: textData.size || { width: 200, height: 40 },
      content: textData.content || '',
      fontFamily: textData.fontFamily || textSettings.fontFamily,
      fontSize: textData.fontSize || textSettings.fontSize,
      fontWeight: textData.fontWeight || textSettings.fontWeight,
      color: textData.color || textSettings.color,
      alignment: textData.alignment || textSettings.alignment,
      direction: textData.direction || textSettings.direction,
      verticalAlign: textData.verticalAlign || textSettings.verticalAlign,
      textType: textData.textType || 'line',
      visible: true,
      locked: false,
      style: {},
      layerId: get().activeLayerId || 'default',
      // ✅ إضافة textType في data أيضاً للتوافق مع TextEditor و CanvasElement
      data: {
        textType: textData.textType || 'line',
        ...textData.data
      },
      ...textData
    };
    
    get().addElement(element);
    return id;
  },
  
  updateTextContent: (elementId, content) => {
    get().updateElement(elementId, { content });
  },
  
  updateTextStyle: (elementId, style) => {
    get().updateElement(elementId, style);
  },
  
  startEditingText: (elementId) => {
    set({ editingTextId: elementId, typingMode: true });
  },
  
  stopEditingText: (elementId) => {
    set((state: any) => {
      if (elementId && state.editingTextId !== elementId) return state;
      return { editingTextId: null, typingMode: false };
    });
  },
  
  startTyping: () => set({ typingMode: true }),
  stopTyping: () => set({ typingMode: false, editingTextId: null })
});
