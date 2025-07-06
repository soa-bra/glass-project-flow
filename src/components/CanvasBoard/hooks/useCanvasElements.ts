import { useState, useCallback } from 'react';
import { CanvasElement } from '../types';
import { toast } from 'sonner';

export const useCanvasElements = (saveToHistory: (elements: CanvasElement[]) => void) => {
  const [elements, setElements] = useState<CanvasElement[]>([]);

  const addElement = useCallback((x: number, y: number, elementType: string, selectedSmartElement: string, width?: number, height?: number) => {
    if (elementType === 'select' || elementType === 'hand' || elementType === 'zoom') return;

    const type = elementType === 'smart-element' ? selectedSmartElement : elementType;
    const newElement: CanvasElement = {
      id: `element-${Date.now()}`,
      type: type as any,
      position: { x, y },
      size: { width: width || 120, height: height || 80 },
      content: elementType === 'text' ? 'نص جديد' : elementType === 'sticky' ? 'ملاحظة' : undefined
    };

    setElements(prev => {
      const newElements = [...prev, newElement];
      saveToHistory(newElements);
      return newElements;
    });
  }, [saveToHistory]);

  const updateElement = useCallback((elementId: string, updates: Partial<CanvasElement>) => {
    setElements(prev => {
      const newElements = prev.map(el => 
        el.id === elementId ? { ...el, ...updates } : el
      );
      saveToHistory(newElements);
      return newElements;
    });
  }, [saveToHistory]);

  const deleteElement = useCallback((elementId: string) => {
    setElements(prev => {
      const newElements = prev.filter(el => el.id !== elementId);
      saveToHistory(newElements);
      return newElements;
    });
    toast.success('تم حذف العنصر');
  }, [saveToHistory]);

  return {
    elements,
    setElements,
    addElement,
    updateElement,
    deleteElement
  };
};