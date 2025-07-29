import { useMemo } from 'react';
import { CursorType } from './useSelectionCursor';

export interface ToolCursorController {
  getCursorForTool: (toolName: string) => CursorType;
  getCursorStyle: (toolName: string) => string;
}

export const useToolCursor = (): ToolCursorController => {
  const toolCursorMap = useMemo<Record<string, CursorType>>(() => ({
    'select': 'default',
    'text': 'text',
    'shape': 'crosshair',
    'sticky': 'crosshair',
    'smart-element': 'crosshair',
    'hand': 'grab',
    'zoom': 'zoom-in',
    'smart-pen': 'crosshair',
    'upload': 'pointer',
    'comment': 'pointer'
  }), []);

  const getCursorForTool = (toolName: string): CursorType => {
    return toolCursorMap[toolName] || 'default';
  };

  const getCursorStyle = (toolName: string): string => {
    const cursor = getCursorForTool(toolName);
    
    // Handle special cursors
    if (cursor === 'zoom-in') {
      return 'zoom-in';
    }
    
    return cursor;
  };

  return {
    getCursorForTool,
    getCursorStyle
  };
};