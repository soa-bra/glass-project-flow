import { useEffect } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';

export const useKeyboardShortcuts = () => {
  const {
    selectedElementIds,
    undo,
    redo,
    deleteElements,
    copyElements,
    pasteElements,
    cutElements,
    toggleGrid,
    groupElements,
    ungroupElements,
    duplicateElement,
    alignElements,
    lockElements,
    unlockElements,
    moveElements
  } = useCanvasStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcuts when typing in inputs
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      // Zoom shortcuts
      if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        useCanvasStore.getState().zoomIn();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault();
        useCanvasStore.getState().zoomOut();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        useCanvasStore.getState().resetViewport();
      }

      // Undo/Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        redo();
      }

      // Copy/Paste/Cut
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selectedElementIds.length > 0) {
        e.preventDefault();
        copyElements(selectedElementIds);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        pasteElements();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'x' && selectedElementIds.length > 0) {
        e.preventDefault();
        cutElements(selectedElementIds);
      }

      // Duplicate (Ctrl+D)
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedElementIds.length > 0) {
        e.preventDefault();
        selectedElementIds.forEach(id => duplicateElement(id));
      }

      // Delete
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementIds.length > 0) {
        e.preventDefault();
        deleteElements(selectedElementIds);
      }

      // Select All (Ctrl+A)
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        const allElementIds = useCanvasStore.getState().elements.map(el => el.id);
        useCanvasStore.getState().selectElements(allElementIds);
      }

      // Grid toggle (G)
      if (e.key === 'g' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        toggleGrid();
      }

      // Tool shortcuts
      if (e.key === 'v' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        useCanvasStore.getState().setActiveTool('selection_tool');
      }
      if (e.key === 't' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        useCanvasStore.getState().setActiveTool('text_tool');
      }
      if (e.key === 'r' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        useCanvasStore.getState().setActiveTool('shapes_tool');
      }
      if (e.key === 'p' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        useCanvasStore.getState().setActiveTool('smart_pen');
      }
      if (e.key === 'f' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        useCanvasStore.getState().setActiveTool('frame_tool');
      }
      if (e.key === 'u' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        useCanvasStore.getState().setActiveTool('file_uploader');
      }
      if (e.key === 's' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        useCanvasStore.getState().setActiveTool('smart_element_tool');
      }

      // Group/Ungroup (Ctrl+G / Ctrl+Shift+G)
      if ((e.ctrlKey || e.metaKey) && e.key === 'g' && !e.shiftKey && selectedElementIds.length > 1) {
        e.preventDefault();
        groupElements(selectedElementIds);
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'g' && selectedElementIds.length > 0) {
        e.preventDefault();
        const groupId = useCanvasStore.getState().elements.find(el => 
          selectedElementIds.includes(el.id)
        )?.metadata?.groupId;
        if (groupId) ungroupElements(groupId);
      }

      // Alignment shortcuts (Ctrl+Shift+Arrow)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && selectedElementIds.length > 0) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          alignElements(selectedElementIds, 'left');
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          alignElements(selectedElementIds, 'right');
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          alignElements(selectedElementIds, 'top');
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          alignElements(selectedElementIds, 'bottom');
        }
      }

      // Lock/Unlock (Ctrl+L / Ctrl+Shift+L)
      if ((e.ctrlKey || e.metaKey) && e.key === 'l' && !e.shiftKey && selectedElementIds.length > 0) {
        e.preventDefault();
        lockElements(selectedElementIds);
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'l' && selectedElementIds.length > 0) {
        e.preventDefault();
        unlockElements(selectedElementIds);
      }

      // Arrow keys for precise movement
      if (selectedElementIds.length > 0 && !e.ctrlKey && !e.metaKey) {
        let dx = 0;
        let dy = 0;
        const step = e.shiftKey ? 10 : 1;
        
        if (e.key === 'ArrowLeft') {
          dx = -step;
          e.preventDefault();
        } else if (e.key === 'ArrowRight') {
          dx = step;
          e.preventDefault();
        } else if (e.key === 'ArrowUp') {
          dy = -step;
          e.preventDefault();
        } else if (e.key === 'ArrowDown') {
          dy = step;
          e.preventDefault();
        }
        
        if (dx !== 0 || dy !== 0) {
          moveElements(selectedElementIds, dx, dy);
        }
      }

      // Escape to deselect
      if (e.key === 'Escape') {
        e.preventDefault();
        useCanvasStore.getState().clearSelection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedElementIds,
    undo,
    redo,
    deleteElements,
    copyElements,
    pasteElements,
    cutElements,
    toggleGrid,
    groupElements,
    ungroupElements,
    duplicateElement,
    alignElements,
    lockElements,
    unlockElements,
    moveElements
  ]);
};
