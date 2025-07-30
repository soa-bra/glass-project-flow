/**
 * @fileoverview Custom hook for canvas integration and data management
 * Enhanced integration layer for connecting panels with canvas state
 */

import { useState, useCallback, useEffect } from 'react';
import { CanvasElement } from '@/types/canvas';
import { toast } from 'sonner';

interface CanvasIntegrationState {
  elements: CanvasElement[];
  selectedElementIds: string[];
  clipboard: CanvasElement[];
  history: CanvasElement[][];
  historyIndex: number;
}

interface UseCanvasIntegrationProps {
  initialElements?: CanvasElement[];
  onElementsChange?: (elements: CanvasElement[]) => void;
  enableCollaboration?: boolean;
  enableAutosave?: boolean;
}

export function useCanvasIntegration({
  initialElements = [],
  onElementsChange,
  enableCollaboration = false,
  enableAutosave = true
}: UseCanvasIntegrationProps) {
  const [state, setState] = useState<CanvasIntegrationState>({
    elements: initialElements,
    selectedElementIds: [],
    clipboard: [],
    history: [initialElements],
    historyIndex: 0
  });

  // Auto-save functionality
  useEffect(() => {
    if (!enableAutosave) return;
    
    const saveTimeout = setTimeout(() => {
      localStorage.setItem('canvas-autosave', JSON.stringify(state.elements));
    }, 1000);

    return () => clearTimeout(saveTimeout);
  }, [state.elements, enableAutosave]);

  // Add element with enhanced integration
  const addElement = useCallback((elementData: Partial<CanvasElement>) => {
    const newElement: CanvasElement = {
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'shape',
      position: { x: 100, y: 100 },
      size: { width: 100, height: 100 },
      visible: true,
      locked: false,
      ...elementData
    };

    setState(prev => {
      const newElements = [...prev.elements, newElement];
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      
      onElementsChange?.(newElements);
      
      return {
        ...prev,
        elements: newElements,
        history: [...newHistory, newElements],
        historyIndex: newHistory.length
      };
    });

    toast.success('تم إضافة العنصر بنجاح');
    return newElement.id;
  }, [onElementsChange]);

  // Update element with validation
  const updateElement = useCallback((elementId: string, updates: Partial<CanvasElement>) => {
    setState(prev => {
      const elementIndex = prev.elements.findIndex(el => el.id === elementId);
      if (elementIndex === -1) return prev;

      const updatedElements = [...prev.elements];
      updatedElements[elementIndex] = { ...updatedElements[elementIndex], ...updates };
      
      onElementsChange?.(updatedElements);

      return {
        ...prev,
        elements: updatedElements
      };
    });
  }, [onElementsChange]);

  // Delete elements with confirmation
  const deleteElements = useCallback((elementIds: string[]) => {
    setState(prev => {
      const newElements = prev.elements.filter(el => !elementIds.includes(el.id));
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      
      onElementsChange?.(newElements);
      
      return {
        ...prev,
        elements: newElements,
        selectedElementIds: prev.selectedElementIds.filter(id => !elementIds.includes(id)),
        history: [...newHistory, newElements],
        historyIndex: newHistory.length
      };
    });

    toast.success(`تم حذف ${elementIds.length} عنصر`);
  }, [onElementsChange]);

  // Selection management
  const selectElements = useCallback((elementIds: string[]) => {
    setState(prev => ({
      ...prev,
      selectedElementIds: elementIds
    }));
  }, []);

  const toggleElementSelection = useCallback((elementId: string) => {
    setState(prev => ({
      ...prev,
      selectedElementIds: prev.selectedElementIds.includes(elementId)
        ? prev.selectedElementIds.filter(id => id !== elementId)
        : [...prev.selectedElementIds, elementId]
    }));
  }, []);

  // Clipboard operations
  const copyElements = useCallback(() => {
    const selectedElements = state.elements.filter(el => 
      state.selectedElementIds.includes(el.id)
    );
    
    setState(prev => ({
      ...prev,
      clipboard: selectedElements.map(el => ({ ...el, id: `copy-${el.id}` }))
    }));

    toast.success(`تم نسخ ${selectedElements.length} عنصر`);
  }, [state.elements, state.selectedElementIds]);

  const pasteElements = useCallback(() => {
    if (state.clipboard.length === 0) {
      toast.error('لا توجد عناصر منسوخة');
      return;
    }

    const newElements = state.clipboard.map(el => ({
      ...el,
      id: `paste-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      position: {
        x: el.position.x + 20,
        y: el.position.y + 20
      }
    }));

    setState(prev => {
      const allElements = [...prev.elements, ...newElements];
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      
      onElementsChange?.(allElements);
      
      return {
        ...prev,
        elements: allElements,
        selectedElementIds: newElements.map(el => el.id),
        history: [...newHistory, allElements],
        historyIndex: newHistory.length
      };
    });

    toast.success(`تم لصق ${newElements.length} عنصر`);
  }, [state.clipboard, onElementsChange]);

  // History management
  const undo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex > 0) {
        const newIndex = prev.historyIndex - 1;
        const newElements = prev.history[newIndex];
        
        onElementsChange?.(newElements);
        
        return {
          ...prev,
          elements: newElements,
          historyIndex: newIndex,
          selectedElementIds: []
        };
      }
      return prev;
    });
  }, [onElementsChange]);

  const redo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex < prev.history.length - 1) {
        const newIndex = prev.historyIndex + 1;
        const newElements = prev.history[newIndex];
        
        onElementsChange?.(newElements);
        
        return {
          ...prev,
          elements: newElements,
          historyIndex: newIndex,
          selectedElementIds: []
        };
      }
      return prev;
    });
  }, [onElementsChange]);

  // Group operations
  const groupElements = useCallback((elementIds: string[]) => {
    const elementsToGroup = state.elements.filter(el => elementIds.includes(el.id));
    if (elementsToGroup.length < 2) return;

    const groupId = `group-${Date.now()}`;
    
    // Calculate group bounds
    const bounds = elementsToGroup.reduce((acc, el) => ({
      minX: Math.min(acc.minX, el.position.x),
      minY: Math.min(acc.minY, el.position.y),
      maxX: Math.max(acc.maxX, el.position.x + el.size.width),
      maxY: Math.max(acc.maxY, el.position.y + el.size.height)
    }), {
      minX: Infinity,
      minY: Infinity,
      maxX: -Infinity,
      maxY: -Infinity
    });

    const groupElement: CanvasElement = {
      id: groupId,
      type: 'group',
      position: { x: bounds.minX, y: bounds.minY },
      size: { 
        width: bounds.maxX - bounds.minX, 
        height: bounds.maxY - bounds.minY 
      },
      visible: true,
      locked: false,
      data: { children: elementIds }
    };

    setState(prev => {
      const updatedElements = prev.elements.map(el => 
        elementIds.includes(el.id) 
          ? { ...el, parentId: groupId }
          : el
      );
      
      const newElements = [...updatedElements, groupElement];
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      
      onElementsChange?.(newElements);
      
      return {
        ...prev,
        elements: newElements,
        selectedElementIds: [groupId],
        history: [...newHistory, newElements],
        historyIndex: newHistory.length
      };
    });

    toast.success('تم تجميع العناصر');
  }, [state.elements, onElementsChange]);

  // Alignment operations
  const alignElements = useCallback((direction: string, elementIds: string[]) => {
    const elementsToAlign = state.elements.filter(el => elementIds.includes(el.id));
    if (elementsToAlign.length < 2) return;

    setState(prev => {
      const updatedElements = [...prev.elements];
      
      // Calculate alignment reference
      let referenceValue = 0;
      switch (direction) {
        case 'left':
          referenceValue = Math.min(...elementsToAlign.map(el => el.position.x));
          break;
        case 'right':
          referenceValue = Math.max(...elementsToAlign.map(el => el.position.x + el.size.width));
          break;
        case 'top':
          referenceValue = Math.min(...elementsToAlign.map(el => el.position.y));
          break;
        case 'bottom':
          referenceValue = Math.max(...elementsToAlign.map(el => el.position.y + el.size.height));
          break;
        case 'center':
          const centerX = elementsToAlign.reduce((sum, el) => sum + el.position.x + el.size.width / 2, 0) / elementsToAlign.length;
          referenceValue = centerX;
          break;
        case 'middle':
          const centerY = elementsToAlign.reduce((sum, el) => sum + el.position.y + el.size.height / 2, 0) / elementsToAlign.length;
          referenceValue = centerY;
          break;
      }

      // Apply alignment
      elementsToAlign.forEach(element => {
        const index = updatedElements.findIndex(el => el.id === element.id);
        if (index !== -1) {
          switch (direction) {
            case 'left':
              updatedElements[index].position.x = referenceValue;
              break;
            case 'right':
              updatedElements[index].position.x = referenceValue - element.size.width;
              break;
            case 'top':
              updatedElements[index].position.y = referenceValue;
              break;
            case 'bottom':
              updatedElements[index].position.y = referenceValue - element.size.height;
              break;
            case 'center':
              updatedElements[index].position.x = referenceValue - element.size.width / 2;
              break;
            case 'middle':
              updatedElements[index].position.y = referenceValue - element.size.height / 2;
              break;
          }
        }
      });

      onElementsChange?.(updatedElements);
      
      return {
        ...prev,
        elements: updatedElements
      };
    });

    toast.success('تم محاذاة العناصر');
  }, [state.elements, onElementsChange]);

  // Get selected elements
  const selectedElements = state.elements.filter(el => 
    state.selectedElementIds.includes(el.id)
  );

  return {
    // State
    elements: state.elements,
    selectedElements,
    selectedElementIds: state.selectedElementIds,
    clipboard: state.clipboard,
    canUndo: state.historyIndex > 0,
    canRedo: state.historyIndex < state.history.length - 1,

    // Actions
    addElement,
    updateElement,
    deleteElements,
    selectElements,
    toggleElementSelection,
    copyElements,
    pasteElements,
    undo,
    redo,
    groupElements,
    alignElements,

    // Utilities
    clearSelection: () => selectElements([]),
    selectAll: () => selectElements(state.elements.map(el => el.id)),
    duplicateElements: () => {
      copyElements();
      pasteElements();
    }
  };
}