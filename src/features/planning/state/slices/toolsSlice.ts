import { StateCreator } from 'zustand';
import { nanoid } from 'nanoid';
import type { CanvasElement } from '@/types/canvas';
import { ToolId, ToolSettings, TextElement, DEFAULT_TOOL_SETTINGS } from '../types';
import { isTextEmpty } from '@/utils/textDirection';
import { DEFAULT_TEXT_DATA, DEFAULT_TEXT_SIZE } from '@/features/planning/elements/text/types';

export interface ToolsSlice {
  activeTool: ToolId;
  toolSettings: ToolSettings;
  isDrawing: boolean;
  drawStartPoint: { x: number; y: number } | null;
  tempElement: CanvasElement | null;
  selectedSmartElement: string | null;
  selectedSmartDoc: string | null;
  editingTextId: string | null;
  typingMode: boolean;
  lastSmartSelectedMindMapNode: string | null;
  setActiveTool: (tool: ToolId) => void;
  updateToolSettings: (tool: keyof ToolSettings, settings: Partial<ToolSettings[keyof ToolSettings]>) => void;
  setIsDrawing: (drawing: boolean) => void;
  setDrawStartPoint: (point: { x: number; y: number } | null) => void;
  setTempElement: (element: CanvasElement | null) => void;
  setSelectedSmartElement: (elementType: string | null) => void;
  setSelectedSmartDoc: (docType: string | null) => void;
  setLastSmartSelectedMindMapNode: (nodeId: string | null) => void;
  addText: (textData: Partial<TextElement>) => string;
  updateTextContent: (elementId: string, content: string) => void;
  updateTextStyle: (elementId: string, style: Partial<Record<string, any>>) => void;
  startEditingText: (elementId: string) => void;
  stopEditingText: (elementId?: string) => void;
  startTyping: () => void;
  stopTyping: () => void;
}

const normalizeVerticalAlign = (value?: string): 'flex-start' | 'center' | 'flex-end' => {
  if (value === 'middle' || value === 'center') return 'center';
  if (value === 'bottom' || value === 'flex-end') return 'flex-end';
  return 'flex-start';
};

export const createToolsSlice: StateCreator<any, [], [], ToolsSlice> = (set, get) => ({
  activeTool: 'selection_tool',
  toolSettings: DEFAULT_TOOL_SETTINGS,
  isDrawing: false,
  drawStartPoint: null,
  tempElement: null,
  selectedSmartElement: null,
  selectedSmartDoc: null,
  editingTextId: null,
  typingMode: false,
  lastSmartSelectedMindMapNode: null,
  setActiveTool: (tool) => {
    set((state: any) => ({
      activeTool: tool,
      isDrawing: false,
      drawStartPoint: null,
      tempElement: null,
      selectedSmartElement: tool !== 'smart_element_tool' ? null : state.selectedSmartElement,
      selectedSmartDoc: tool !== 'smart_doc_tool' ? null : state.selectedSmartDoc,
    }));
  },
  updateToolSettings: (tool, settings) => {
    set((state: any) => ({
      toolSettings: {
        ...state.toolSettings,
        [tool]: { ...state.toolSettings[tool], ...settings },
      },
    }));
  },
  setIsDrawing: (drawing) => set({ isDrawing: drawing }),
  setDrawStartPoint: (point) => set({ drawStartPoint: point }),
  setTempElement: (element) => set({ tempElement: element }),
  setSelectedSmartElement: (elementType) => set({ selectedSmartElement: elementType }),
  setSelectedSmartDoc: (docType) => set({ selectedSmartDoc: docType }),
  setLastSmartSelectedMindMapNode: (nodeId) => set({ lastSmartSelectedMindMapNode: nodeId }),
  addText: (textData) => {
    const id = textData.id || nanoid();
    const textSettings = get().toolSettings.text;
    const requestedTextType = textData.data?.textType || textData.textType || 'line';
    const normalizedData = {
      ...DEFAULT_TEXT_DATA,
      ...(textData.data || {}),
      textType: requestedTextType,
    };
    const normalizedStyle = {
      ...(textData.style || {}),
      fontFamily: textData.style?.fontFamily || textData.fontFamily || textSettings.fontFamily,
      fontSize: textData.style?.fontSize || textData.fontSize || textSettings.fontSize,
      fontWeight: textData.style?.fontWeight || textData.fontWeight || textSettings.fontWeight,
      color: textData.style?.color || textData.color || textSettings.color,
      textAlign: textData.style?.textAlign || (textData as any).alignment || textSettings.alignment,
      direction: textData.style?.direction || textData.direction || textSettings.direction,
      alignItems: normalizeVerticalAlign(textData.style?.alignItems || (textData as any).verticalAlign || textSettings.verticalAlign),
      fontStyle: textData.style?.fontStyle || textData.fontStyle || 'normal',
      textDecoration: textData.style?.textDecoration || textData.textDecoration || 'none',
      backgroundColor: textData.style?.backgroundColor || 'transparent',
    };
    const defaultSize = requestedTextType === 'box'
      ? { width: 220, height: 48 }
      : {
          width: normalizedData.minWidth || DEFAULT_TEXT_SIZE.width,
          height: normalizedData.minHeight || DEFAULT_TEXT_SIZE.height,
        };
    const element: TextElement = {
      ...textData,
      id,
      type: 'text',
      position: textData.position || { x: 100, y: 100 },
      size: textData.size || defaultSize,
      content: textData.content || '',
      visible: textData.visible ?? true,
      locked: textData.locked ?? false,
      style: normalizedStyle,
      layerId: textData.layerId || get().activeLayerId || 'default',
      data: normalizedData,
    };
    get().addElement(element);
    return id;
  },
  updateTextContent: (elementId, content) => {
    get().updateElement(elementId, { content });
  },
  updateTextStyle: (elementId, style) => {
    const element = get().elements?.find((el: CanvasElement) => el.id === elementId);
    if (!element) return;
    get().updateElement(elementId, {
      style: {
        ...(element.style || {}),
        ...style,
      },
    });
  },
  startEditingText: (elementId) => {
    set({ editingTextId: elementId, typingMode: true });
  },
  stopEditingText: (elementId) => {
    const state = get();
    const targetId = elementId || state.editingTextId;
    if (targetId) {
      const element = state.elements?.find((el: any) => el.id === targetId);
      if (element && element.type === 'text') {
        const content = element.content || '';
        if (isTextEmpty(content)) {
          state.deleteElement?.(targetId);
        }
      }
    }
    set((currentState: any) => {
      if (targetId && currentState.editingTextId !== targetId) return currentState;
      return { editingTextId: null, typingMode: false };
    });
  },
  startTyping: () => set({ typingMode: true }),
  stopTyping: () => set({ typingMode: false, editingTextId: null }),
});
