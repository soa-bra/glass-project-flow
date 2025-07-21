
import { useEffect } from 'react';

interface SelectionKeyboardShortcutsProps {
  isActive: boolean;
  hasSelection: boolean;
  actions: {
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
  };
}

export const useSelectionKeyboardShortcuts = ({
  isActive,
  hasSelection,
  actions
}: SelectionKeyboardShortcutsProps) => {
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default behavior for our shortcuts
      const isCtrl = e.ctrlKey || e.metaKey;
      const isShift = e.shiftKey;

      switch (e.key) {
        case 'a':
        case 'A':
          if (isCtrl) {
            e.preventDefault();
            actions.selectAll();
          }
          break;
        case 'c':
        case 'C':
          if (isCtrl && hasSelection) {
            e.preventDefault();
            actions.copy();
          }
          break;
        case 'x':
        case 'X':
          if (isCtrl && hasSelection) {
            e.preventDefault();
            actions.cut();
          }
          break;
        case 'v':
        case 'V':
          if (isCtrl) {
            e.preventDefault();
            actions.paste();
          }
          break;
        case 'Delete':
        case 'Backspace':
          if (hasSelection) {
            e.preventDefault();
            actions.delete();
          }
          break;
        case 'z':
        case 'Z':
          if (isCtrl && !isShift) {
            e.preventDefault();
            actions.undo();
          } else if (isCtrl && isShift) {
            e.preventDefault();
            actions.redo();
          }
          break;
        case 'y':
        case 'Y':
          if (isCtrl) {
            e.preventDefault();
            actions.redo();
          }
          break;
        case 'g':
        case 'G':
          if (isCtrl && hasSelection) {
            e.preventDefault();
            if (isShift) {
              actions.ungroup();
            } else {
              actions.group();
            }
          }
          break;
        case 'Escape':
          if (hasSelection) {
            e.preventDefault();
            actions.deselect();
          }
          break;
        case 'ArrowUp':
          if (hasSelection) {
            e.preventDefault();
            if (isShift) {
              actions.fastMoveUp();
            } else {
              actions.moveUp();
            }
          }
          break;
        case 'ArrowDown':
          if (hasSelection) {
            e.preventDefault();
            if (isShift) {
              actions.fastMoveDown();
            } else {
              actions.moveDown();
            }
          }
          break;
        case 'ArrowLeft':
          if (hasSelection) {
            e.preventDefault();
            if (isShift) {
              actions.fastMoveLeft();
            } else {
              actions.moveLeft();
            }
          }
          break;
        case 'ArrowRight':
          if (hasSelection) {
            e.preventDefault();
            if (isShift) {
              actions.fastMoveRight();
            } else {
              actions.moveRight();
            }
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, hasSelection, actions]);
};
