import { useState, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CanvasElement } from '../types';

interface UseUnifiedCanvasStateProps {
  initialElements?: CanvasElement[];
  saveToHistory?: (elements: CanvasElement[]) => void;
}

export const useUnifiedCanvasState = ({
  initialElements = [],
  saveToHistory = () => {}
}: UseUnifiedCanvasStateProps = {}) => {
  // Core state
  const [elements, setElements] = useState<CanvasElement[]>(initialElements);
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  const [activeTool, setActiveTool] = useState<string>('select');
  const [clipboard, setClipboard] = useState<CanvasElement[]>([]);

  // Computed values
  const selectedElements = useMemo(() => 
    elements.filter(el => selectedElementIds.includes(el.id)),
    [elements, selectedElementIds]
  );

  // Element management
  const addElement = useCallback((
    type: string, 
    x: number, 
    y: number, 
    width = 100, 
    height = 100,
    content = ''
  ) => {
    const newElement: CanvasElement = {
      id: uuidv4(),
      type: type as any,
      position: { x, y },
      size: { width, height },
      rotation: 0,
      locked: false,
      visible: true,
      content,
      style: getDefaultStyle(type)
    };

    setElements(prev => {
      const newElements = [...prev, newElement];
      saveToHistory(newElements);
      return newElements;
    });
  }, [saveToHistory]);

  const updateElement = useCallback((elementId: string, updates: Partial<CanvasElement>) => {
    setElements(prev => {
      const newElements = prev.map(element =>
        element.id === elementId ? { ...element, ...updates } : element
      );
      saveToHistory(newElements);
      return newElements;
    });
  }, [saveToHistory]);

  const deleteElement = useCallback((elementId: string) => {
    setElements(prev => {
      const newElements = prev.filter(element => element.id !== elementId);
      saveToHistory(newElements);
      return newElements;
    });
  }, [saveToHistory]);

  const deleteElements = useCallback((elementIds: string[]) => {
    setElements(prev => {
      const newElements = prev.filter(element => !elementIds.includes(element.id));
      saveToHistory(newElements);
      return newElements;
    });
  }, [saveToHistory]);

  // Selection management
  const selectElement = useCallback((elementId: string | null) => {
    setSelectedElementIds(elementId ? [elementId] : []);
  }, []);

  const selectElements = useCallback((elementIds: string[]) => {
    setSelectedElementIds(elementIds);
  }, []);

  const toggleElementSelection = useCallback((elementId: string) => {
    setSelectedElementIds(prev => 
      prev.includes(elementId) 
        ? prev.filter(id => id !== elementId)
        : [...prev, elementId]
    );
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedElementIds([]);
  }, []);

  // Unified clipboard operations
  const copyElements = useCallback(() => {
    if (selectedElements.length === 0) return;
    setClipboard([...selectedElements]);
  }, [selectedElements]);

  const cutElements = useCallback(() => {
    if (selectedElements.length === 0) return;
    setClipboard([...selectedElements]);
    deleteElements(selectedElementIds);
    setSelectedElementIds([]);
  }, [selectedElements, selectedElementIds, deleteElements]);

  const pasteElements = useCallback(() => {
    if (clipboard.length === 0) return;

    const newElements = clipboard.map((element, index) => ({
      ...element,
      id: uuidv4(),
      position: {
        x: element.position.x + 20 + (index * 10),
        y: element.position.y + 20 + (index * 10)
      },
      parentId: undefined // Reset parent when pasting
    }));

    setElements(prev => {
      const updated = [...prev, ...newElements];
      saveToHistory(updated);
      return updated;
    });

    // Select the newly pasted elements
    setSelectedElementIds(newElements.map(el => el.id));
  }, [clipboard, saveToHistory]);

  const duplicateElements = useCallback(() => {
    if (selectedElements.length === 0) return;

    const duplicatedElements = selectedElements.map((element, index) => ({
      ...element,
      id: uuidv4(),
      position: {
        x: element.position.x + 20,
        y: element.position.y + 20
      },
      parentId: undefined
    }));

    setElements(prev => {
      const updated = [...prev, ...duplicatedElements];
      saveToHistory(updated);
      return updated;
    });

    setSelectedElementIds(duplicatedElements.map(el => el.id));
  }, [selectedElements, saveToHistory]);

  // Tool management
  const changeTool = useCallback((tool: string) => {
    setActiveTool(tool);
    if (tool !== 'select') {
      clearSelection();
    }
  }, [clearSelection]);

  return {
    // State
    elements,
    selectedElementIds,
    selectedElements,
    activeTool,
    clipboard,
    
    // Element operations
    addElement,
    updateElement,
    deleteElement,
    deleteElements,
    setElements,
    
    // Selection operations
    selectElement,
    selectElements,
    toggleElementSelection,
    clearSelection,
    
    // Clipboard operations
    copyElements,
    cutElements,
    pasteElements,
    duplicateElements,
    
    // Tool operations
    changeTool,
    setActiveTool
  };
};

// Helper function for default styles
function getDefaultStyle(type: string): Record<string, any> {
  const baseStyle = {
    fill: '#ffffff',
    stroke: '#000000',
    strokeWidth: 2,
    opacity: 1
  };

  switch (type) {
    case 'text':
      return {
        ...baseStyle,
        fontSize: 16,
        fontFamily: 'Arial, sans-serif',
        color: '#000000',
        textAlign: 'left'
      };
    case 'sticky':
      return {
        ...baseStyle,
        fill: '#ffeb3b',
        borderRadius: '8px',
        padding: '8px'
      };
    case 'shape':
      return {
        ...baseStyle,
        fill: '#2196f3'
      };
    case 'group':
      return {
        ...baseStyle,
        fill: 'transparent',
        stroke: '#9e9e9e',
        strokeWidth: 1,
        strokeDasharray: '5,5'
      };
    default:
      return baseStyle;
  }
}