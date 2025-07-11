
import { useState, useCallback } from 'react';
import { CanvasElement } from '../types';

export const useCanvasElementManagement = (saveToHistory: () => void) => {
  const [elements, setElements] = useState<CanvasElement[]>([]);

  const addElement = useCallback((type: string, x: number, y: number, width?: number, height?: number) => {
    const newElement: CanvasElement = {
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: type as CanvasElement['type'],
      position: { x, y },
      size: {
        width: width || 120,
        height: height || 60
      },
      content: type === 'text' ? 'نص جديد' : (type === 'sticky' ? 'ملاحظة' : undefined),
      zIndex: 1
    };

    setElements(prev => [...prev, newElement]);
    saveToHistory();
  }, [saveToHistory]);

  const addDrawingElement = useCallback((type: string, path: { x: number; y: number }[], lineWidth: number, color: string) => {
    const newElement: CanvasElement = {
      id: `drawing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'drawing',
      position: { x: 0, y: 0 }, // Will be calculated from path bounds
      size: { width: 0, height: 0 }, // Will be calculated from path bounds
      path,
      lineWidth,
      color,
      zIndex: 1
    };

    setElements(prev => [...prev, newElement]);
    saveToHistory();
  }, [saveToHistory]);

  const updateElement = useCallback((elementId: string, updates: Partial<CanvasElement>) => {
    setElements(prev => 
      prev.map(element => 
        element.id === elementId 
          ? { ...element, ...updates }
          : element
      )
    );
    saveToHistory();
  }, [saveToHistory]);

  const deleteElement = useCallback((elementId: string) => {
    setElements(prev => prev.filter(element => element.id !== elementId));
    saveToHistory();
  }, [saveToHistory]);

  return {
    elements,
    setElements,
    addElement,
    addDrawingElement,
    updateElement,
    deleteElement
  };
};
