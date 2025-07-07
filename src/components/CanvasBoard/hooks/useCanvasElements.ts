import { useState, useCallback } from 'react';
import { CanvasElement } from '../types';
import { toast } from 'sonner';

export const useCanvasElements = (saveToHistory: (elements: CanvasElement[]) => void) => {
  const [elements, setElements] = useState<CanvasElement[]>([]);

  const addElement = useCallback((x: number, y: number, elementType: string, selectedSmartElement: string, width?: number, height?: number) => {
    console.log('Adding element:', { elementType, x, y, width, height });
    
    if (elementType === 'select' || elementType === 'hand' || elementType === 'zoom' || elementType === 'grid' || elementType === 'layers') return;

    const type = elementType === 'smart-element' ? selectedSmartElement : elementType;
    
    // Create element with appropriate defaults
    const newElement: CanvasElement = {
      id: `element-${Date.now()}`,
      type: type as any,
      position: { x, y },
      size: { 
        width: width || (elementType === 'text' ? 200 : elementType === 'sticky' ? 160 : 120), 
        height: height || (elementType === 'text' ? 50 : elementType === 'sticky' ? 120 : 80) 
      },
      content: getDefaultContent(elementType),
      style: getDefaultStyle(elementType)
    };

    console.log('Created element:', newElement);

    setElements(prev => {
      const newElements = [...prev, newElement];
      saveToHistory(newElements);
      return newElements;
    });

    // Provide user feedback
    const elementName = getElementDisplayName(elementType);
    toast.success(`تم إضافة ${elementName}`);
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

// Helper functions
const getDefaultContent = (elementType: string): string => {
  switch (elementType) {
    case 'text': return 'نص جديد';
    case 'sticky': return 'ملاحظة جديدة';
    case 'comment': return 'تعليق';
    case 'shape': return '';
    case 'smart-element': return '';
    default: return '';
  }
};

const getDefaultStyle = (elementType: string): Record<string, any> => {
  switch (elementType) {
    case 'text':
      return {
        fontSize: '16px',
        fontFamily: 'IBM Plex Sans Arabic',
        color: '#000000',
        textAlign: 'right'
      };
    case 'sticky':
      return {
        backgroundColor: '#FEF3C7',
        borderRadius: '8px',
        padding: '12px'
      };
    case 'shape':
      return {
        fill: '#3B82F6',
        stroke: '#1D4ED8',
        strokeWidth: 2
      };
    default:
      return {};
  }
};

const getElementDisplayName = (elementType: string): string => {
  switch (elementType) {
    case 'text': return 'النص';
    case 'sticky': return 'الملاحظة اللاصقة';
    case 'comment': return 'التعليق';
    case 'shape': return 'الشكل';
    case 'smart-element': return 'العنصر الذكي';
    case 'upload': return 'الملف';
    default: return 'العنصر';
  }
};