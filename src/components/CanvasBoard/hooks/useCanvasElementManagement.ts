
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CanvasElement } from '../types';

const defaultElement = {
  id: uuidv4(),
  type: 'shape' as const,
  position: { x: 50, y: 50 },
  size: { width: 100, height: 100 },
  fill: 'red',
  stroke: 'black',
  strokeWidth: 2,
  rotation: 0,
  opacity: 1,
  zIndex: 1,
  locked: false,
  content: '',
  style: {}
};

export const useCanvasElementManagement = (saveToHistory: (elements: CanvasElement[]) => void) => {
  const [elements, setElements] = useState<CanvasElement[]>([]);

  const addElement = useCallback((type: string, x: number, y: number, width?: number, height?: number, text?: string) => {
    const newElement: CanvasElement = {
      ...defaultElement,
      id: uuidv4(),
      type: type as any,
      position: { x: x || 50, y: y || 50 },
      size: { width: width || 100, height: height || 100 },
      content: text || 'نص تجريبي'
    };
    setElements(prevElements => {
      const newElements = [...prevElements, newElement];
      saveToHistory(newElements);
      return newElements;
    });
  }, [saveToHistory]);

  const updateElement = useCallback((elementId: string, updates: Partial<CanvasElement>) => {
    setElements(prevElements => {
      const newElements = prevElements.map(element =>
        element.id === elementId ? { ...element, ...updates } : element
      );
      saveToHistory(newElements);
      return newElements;
    });
  }, [saveToHistory]);

  const deleteElement = useCallback((elementId: string) => {
    setElements(prevElements => {
      const newElements = prevElements.filter(element => element.id !== elementId);
      saveToHistory(newElements);
      return newElements;
    });
  }, [saveToHistory]);

  return {
    elements,
    setElements,
    addElement,
    updateElement,
    deleteElement
  };
};
