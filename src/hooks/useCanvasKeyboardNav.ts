/**
 * Canvas Keyboard Navigation Hook
 * خطاف التنقل بلوحة المفاتيح للكانفاس
 */

import { useEffect, useCallback, useState } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';

interface UseCanvasKeyboardNavOptions {
  enabled?: boolean;
  moveStep?: number;
  moveStepLarge?: number;
}

export const useCanvasKeyboardNav = (options: UseCanvasKeyboardNavOptions = {}) => {
  const {
    enabled = true,
    moveStep = 1,
    moveStepLarge = 10
  } = options;

  const [focusedElementIndex, setFocusedElementIndex] = useState(-1);

  const {
    elements,
    selectedElementIds,
    selectElement,
    selectElements,
    clearSelection,
    moveElements,
    deleteElements,
    copyElements,
    pasteElements,
    cutElements,
    undo,
    redo,
    zoomIn,
    zoomOut,
    resetViewport,
    toggleGrid,
    activeTool,
    setActiveTool,
    groupElements,
    ungroupElements,
    alignElements,
    lockElements,
    unlockElements
  } = useCanvasStore();

  // Navigate to next/previous element
  const navigateElements = useCallback((direction: 1 | -1) => {
    if (elements.length === 0) return;

    const newIndex = focusedElementIndex + direction;
    const clampedIndex = Math.max(0, Math.min(elements.length - 1, newIndex));
    
    setFocusedElementIndex(clampedIndex);
    selectElement(elements[clampedIndex].id);
  }, [elements, focusedElementIndex, selectElement]);

  // Move selected elements
  const moveSelected = useCallback((dx: number, dy: number, large: boolean) => {
    if (selectedElementIds.length === 0) return;
    
    const step = large ? moveStepLarge : moveStep;
    moveElements(selectedElementIds, dx * step, dy * step);
  }, [selectedElementIds, moveElements, moveStep, moveStepLarge]);

  // Tool shortcuts mapping
  const toolShortcuts: Record<string, string> = {
    'v': 'selection_tool',
    't': 'text_tool',
    'r': 'shapes_tool',
    'p': 'smart_pen',
    'f': 'frame_tool',
    'u': 'file_uploader',
    's': 'smart_element_tool'
  };

  // Handle keyboard events
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled) return;

    // Check if user is typing in an input
    const target = e.target as HTMLElement;
    const isTyping = 
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable ||
      target.closest('[contenteditable="true"]');

    if (isTyping && e.key !== 'Escape') return;

    const isMeta = e.metaKey || e.ctrlKey;
    const isShift = e.shiftKey;

    // Tool shortcuts (single keys)
    if (!isMeta && !isShift) {
      const lowerKey = e.key.toLowerCase();
      if (toolShortcuts[lowerKey]) {
        e.preventDefault();
        setActiveTool(toolShortcuts[lowerKey] as any);
        return;
      }
    }

    switch (e.key) {
      // Navigation
      case 'Tab':
        e.preventDefault();
        navigateElements(isShift ? -1 : 1);
        break;

      case 'Escape':
        e.preventDefault();
        clearSelection();
        setActiveTool('selection_tool');
        break;

      // Arrow keys - move elements
      case 'ArrowLeft':
        e.preventDefault();
        moveSelected(-1, 0, isShift);
        break;

      case 'ArrowRight':
        e.preventDefault();
        moveSelected(1, 0, isShift);
        break;

      case 'ArrowUp':
        e.preventDefault();
        moveSelected(0, -1, isShift);
        break;

      case 'ArrowDown':
        e.preventDefault();
        moveSelected(0, 1, isShift);
        break;

      // Delete
      case 'Delete':
      case 'Backspace':
        if (!isTyping) {
          e.preventDefault();
          deleteElements(selectedElementIds);
        }
        break;

      // Zoom
      case '+':
      case '=':
        if (!isMeta) {
          e.preventDefault();
          zoomIn();
        }
        break;

      case '-':
        if (!isMeta) {
          e.preventDefault();
          zoomOut();
        }
        break;

      case '0':
        if (!isMeta) {
          e.preventDefault();
          resetViewport();
        }
        break;

      // Grid toggle
      case 'g':
        if (!isMeta) {
          e.preventDefault();
          toggleGrid();
        }
        break;

      default:
        break;
    }

    // Meta/Ctrl shortcuts
    if (isMeta) {
      switch (e.key.toLowerCase()) {
        case 'c':
          e.preventDefault();
          copyElements(selectedElementIds);
          break;

        case 'v':
          e.preventDefault();
          pasteElements();
          break;

        case 'x':
          e.preventDefault();
          cutElements(selectedElementIds);
          break;

        case 'd':
          e.preventDefault();
          // Duplicate
          copyElements(selectedElementIds);
          pasteElements();
          break;

        case 'z':
          e.preventDefault();
          if (isShift) {
            redo();
          } else {
            undo();
          }
          break;

        case 'y':
          e.preventDefault();
          redo();
          break;

        case 'a':
          e.preventDefault();
          selectElements(elements.map(el => el.id));
          break;

        case 'g':
          e.preventDefault();
          if (isShift) {
            // Ungroup - find group ID from first selected element
            const firstEl = elements.find(el => el.id === selectedElementIds[0]);
            if (firstEl?.groupId) {
              ungroupElements(firstEl.groupId);
            }
          } else {
            groupElements(selectedElementIds);
          }
          break;

        case 'l':
          e.preventDefault();
          if (isShift) {
            unlockElements(selectedElementIds);
          } else {
            lockElements(selectedElementIds);
          }
          break;

        default:
          break;
      }
    }

    // Alignment shortcuts (Alt + key)
    if (e.altKey && selectedElementIds.length > 1) {
      switch (e.key.toLowerCase()) {
        case 'l':
          e.preventDefault();
          alignElements(selectedElementIds, 'left');
          break;
        case 'c':
          e.preventDefault();
          alignElements(selectedElementIds, 'center');
          break;
        case 'r':
          e.preventDefault();
          alignElements(selectedElementIds, 'right');
          break;
        case 't':
          e.preventDefault();
          alignElements(selectedElementIds, 'top');
          break;
        case 'm':
          e.preventDefault();
          alignElements(selectedElementIds, 'middle');
          break;
        case 'b':
          e.preventDefault();
          alignElements(selectedElementIds, 'bottom');
          break;
      }
    }
  }, [
    enabled,
    elements,
    selectedElementIds,
    navigateElements,
    moveSelected,
    clearSelection,
    selectElements,
    deleteElements,
    copyElements,
    pasteElements,
    cutElements,
    undo,
    redo,
    zoomIn,
    zoomOut,
    resetViewport,
    toggleGrid,
    setActiveTool,
    groupElements,
    ungroupElements,
    alignElements,
    lockElements,
    unlockElements
  ]);

  // Setup event listener
  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown, { capture: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [enabled, handleKeyDown]);

  // Sync focused element with selection
  useEffect(() => {
    if (selectedElementIds.length === 1) {
      const index = elements.findIndex(el => el.id === selectedElementIds[0]);
      if (index !== -1) {
        setFocusedElementIndex(index);
      }
    }
  }, [selectedElementIds, elements]);

  return {
    focusedElementIndex,
    setFocusedElementIndex,
    navigateElements
  };
};

export default useCanvasKeyboardNav;
