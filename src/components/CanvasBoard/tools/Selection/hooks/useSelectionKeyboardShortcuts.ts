import { useEffect } from 'react';

interface SelectionKeyboardActions {
  copy: () => void;
  cut: () => void;
  paste: () => void;
  delete: () => void;
  undo: () => void;
  redo: () => void;
  selectAll: () => void;
  group: () => void;
  ungroup: () => void;
  deselect: () => void;
  moveUp: () => void;
  moveDown: () => void;
  moveLeft: () => void;
  moveRight: () => void;
  fastMoveUp: () => void;
  fastMoveDown: () => void;
  fastMoveLeft: () => void;
  fastMoveRight: () => void;
}

interface UseSelectionKeyboardShortcutsProps {
  isActive: boolean;
  hasSelection: boolean;
  actions: SelectionKeyboardActions;
}

export const useSelectionKeyboardShortcuts = ({
  isActive,
  hasSelection,
  actions
}: UseSelectionKeyboardShortcutsProps) => {
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const { ctrlKey, metaKey, shiftKey, key, code } = event;
      const cmdCtrl = ctrlKey || metaKey;

      // Prevent default for our handled shortcuts
      const preventDefault = () => {
        event.preventDefault();
        event.stopPropagation();
      };

      // Copy: Ctrl/Cmd + C
      if (cmdCtrl && key === 'c' && hasSelection) {
        preventDefault();
        actions.copy();
        return;
      }

      // Cut: Ctrl/Cmd + X
      if (cmdCtrl && key === 'x' && hasSelection) {
        preventDefault();
        actions.cut();
        return;
      }

      // Paste: Ctrl/Cmd + V
      if (cmdCtrl && key === 'v') {
        preventDefault();
        actions.paste();
        return;
      }

      // Delete: Delete or Backspace
      if ((key === 'Delete' || key === 'Backspace') && hasSelection) {
        preventDefault();
        actions.delete();
        return;
      }

      // Undo: Ctrl/Cmd + Z
      if (cmdCtrl && !shiftKey && key === 'z') {
        preventDefault();
        actions.undo();
        return;
      }

      // Redo: Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z
      if ((cmdCtrl && key === 'y') || (cmdCtrl && shiftKey && key === 'z')) {
        preventDefault();
        actions.redo();
        return;
      }

      // Select All: Ctrl/Cmd + A
      if (cmdCtrl && key === 'a') {
        preventDefault();
        actions.selectAll();
        return;
      }

      // Group: Ctrl + G
      if (ctrlKey && key === 'g' && hasSelection) {
        preventDefault();
        actions.group();
        return;
      }

      // Ungroup: Shift + G
      if (shiftKey && key === 'g' && hasSelection) {
        preventDefault();
        actions.ungroup();
        return;
      }

      // Deselect: Escape
      if (key === 'Escape' && hasSelection) {
        preventDefault();
        actions.deselect();
        return;
      }

      // Arrow key movements (only when elements are selected)
      if (hasSelection) {
        const isShiftHeld = shiftKey;
        const moveDistance = isShiftHeld ? 10 : 1; // 10px for fast move, 1px for precise

        switch (code) {
          case 'ArrowUp':
            preventDefault();
            if (isShiftHeld) {
              actions.fastMoveUp();
            } else {
              actions.moveUp();
            }
            break;

          case 'ArrowDown':
            preventDefault();
            if (isShiftHeld) {
              actions.fastMoveDown();
            } else {
              actions.moveDown();
            }
            break;

          case 'ArrowLeft':
            preventDefault();
            if (isShiftHeld) {
              actions.fastMoveLeft();
            } else {
              actions.moveLeft();
            }
            break;

          case 'ArrowRight':
            preventDefault();
            if (isShiftHeld) {
              actions.fastMoveRight();
            } else {
              actions.moveRight();
            }
            break;
        }
      }
    };

    // Attach keyboard event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, hasSelection, actions]);
};