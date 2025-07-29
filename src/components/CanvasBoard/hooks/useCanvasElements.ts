import { useState, useCallback } from 'react';
import { CanvasElement } from '@/types/canvas';
import { toast } from 'sonner';

export const useCanvasElements = (saveToHistory: (elements: CanvasElement[]) => void) => {
  const [elements, setElements] = useState<CanvasElement[]>([]);

  const addElement = useCallback((x: number, y: number, elementType: string, selectedSmartElement: string, width?: number, height?: number) => {
    // Skip non-creatable tools
    if (['select', 'hand', 'zoom', 'grid', 'layers'].includes(elementType)) {
      return;
    }

    // Determine the actual element type
    let actualType = elementType;
    
    // Handle smart element logic
    if (elementType === 'smart-element') {
      actualType = (selectedSmartElement && selectedSmartElement !== 'smart-element') 
        ? selectedSmartElement 
        : 'timeline';
    }
    
    // Handle text-box -> text conversion
    if (elementType === 'text-box') {
      actualType = 'text';
    }
    
    // Validate element type
    const validTypes = ['text', 'shape', 'sticky', 'comment', 'upload', 'timeline', 'mindmap', 'brainstorm', 'root', 'moodboard', 'line'];
    if (!validTypes.includes(actualType)) {
      toast.error(`نوع عنصر غير صحيح: ${actualType}`);
      return;
    }
    
    // Create element with optimized defaults
    const newElement: CanvasElement = {
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: actualType as any,
      position: { x: Math.round(x), y: Math.round(y) },
      size: { 
        width: width || getDefaultWidth(actualType), 
        height: height || getDefaultHeight(actualType)
      },
      content: getDefaultContent(actualType),
      style: getDefaultStyle(actualType)
    };

    setElements(prev => {
      const newElements = [...prev, newElement];
      saveToHistory(newElements);
      return newElements;
    });

    // Provide user feedback
    const elementName = getElementDisplayName(actualType);
    
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
const getDefaultWidth = (elementType: string): number => {
  switch (elementType) {
    case 'text': return 200;
    case 'sticky': return 160;
    case 'comment': return 140;
    case 'upload': return 120;
    case 'shape': return 120;
    case 'timeline': return 300;
    case 'mindmap': return 200;
    case 'brainstorm': return 180;
    case 'root': return 150;
    case 'moodboard': return 250;
    case 'line': return 100;
    default: return 120;
  }
};

const getDefaultHeight = (elementType: string): number => {
  switch (elementType) {
    case 'text': return 50;
    case 'sticky': return 120;
    case 'comment': return 80;
    case 'upload': return 80;
    case 'shape': return 80;
    case 'timeline': return 60;
    case 'mindmap': return 150;
    case 'brainstorm': return 120;
    case 'root': return 100;
    case 'moodboard': return 180;
    case 'line': return 2;
    default: return 80;
  }
};

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