import { useState, useCallback } from 'react';

export type CursorType = 
  | 'default'
  | 'pointer' 
  | 'grab'
  | 'grabbing'
  | 'move'
  | 'crosshair'
  | 'text'
  | 'zoom-in'
  | 'nw-resize'
  | 'ne-resize'
  | 'sw-resize'
  | 'se-resize'
  | 'n-resize'
  | 's-resize'
  | 'e-resize'
  | 'w-resize';

export interface SelectionCursorController {
  cursorType: CursorType;
  setCursorType: (type: CursorType) => void;
  getCursorStyle: () => string;
  handleElementHover: () => void;
  handleElementLeave: () => void;
  handleDragStart: () => void;
  handleDragEnd: () => void;
  handleResizeHandleHover: (handle: string) => void;
  handleResizeHandleLeave: () => void;
}

export const useSelectionCursor = (): SelectionCursorController => {
  const [cursorType, setCursorType] = useState<CursorType>('default');

  const getCursorStyle = useCallback((): string => {
    const cursorMap: Record<CursorType, string> = {
      'default': 'default',
      'pointer': 'pointer',
      'grab': 'grab',
      'grabbing': 'grabbing',
      'move': 'move',
      'crosshair': 'crosshair',
      'text': 'text',
      'zoom-in': 'zoom-in',
      'nw-resize': 'nw-resize',
      'ne-resize': 'ne-resize',
      'sw-resize': 'sw-resize',
      'se-resize': 'se-resize',
      'n-resize': 'n-resize',
      's-resize': 's-resize',
      'e-resize': 'e-resize',
      'w-resize': 'w-resize'
    };

    return cursorMap[cursorType] || 'default';
  }, [cursorType]);

  const handleElementHover = useCallback(() => {
    setCursorType('grab');
  }, []);

  const handleElementLeave = useCallback(() => {
    setCursorType('default');
  }, []);

  const handleDragStart = useCallback(() => {
    setCursorType('grabbing');
  }, []);

  const handleDragEnd = useCallback(() => {
    setCursorType('default');
  }, []);

  const handleResizeHandleHover = useCallback((handle: string) => {
    const resizeCursors: Record<string, CursorType> = {
      'top-left': 'nw-resize',
      'top-right': 'ne-resize',
      'bottom-left': 'sw-resize',
      'bottom-right': 'se-resize',
      'top': 'n-resize',
      'bottom': 's-resize',
      'left': 'w-resize',
      'right': 'e-resize'
    };

    setCursorType(resizeCursors[handle] || 'default');
  }, []);

  const handleResizeHandleLeave = useCallback(() => {
    setCursorType('default');
  }, []);

  return {
    cursorType,
    setCursorType,
    getCursorStyle,
    handleElementHover,
    handleElementLeave,
    handleDragStart,
    handleDragEnd,
    handleResizeHandleHover,
    handleResizeHandleLeave
  };
};