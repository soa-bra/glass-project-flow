import { useEffect, useCallback } from 'react';

export interface SelectionShortcutActions {
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onGroup: () => void;
  onUngroup: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveUpFast: () => void;
  onMoveDownFast: () => void;
  onMoveLeftFast: () => void;
  onMoveRightFast: () => void;
}

interface UseSelectionKeyboardShortcutsProps {
  enabled: boolean;
  hasSelection: boolean;
  actions: SelectionShortcutActions;
}

export const useSelectionKeyboardShortcuts = ({
  enabled,
  hasSelection,
  actions
}: UseSelectionKeyboardShortcutsProps) => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled) return;

    const isCtrlCmd = e.ctrlKey || e.metaKey;
    const isShift = e.shiftKey;

    // منع التداخل مع حقول الإدخال
    if (e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement) {
      return;
    }

    switch (e.key.toLowerCase()) {
      // العمليات الأساسية
      case 'c':
        if (isCtrlCmd && hasSelection) {
          e.preventDefault();
          actions.onCopy();
        }
        break;
      case 'x':
        if (isCtrlCmd && hasSelection) {
          e.preventDefault();
          actions.onCut();
        }
        break;
      case 'v':
        if (isCtrlCmd) {
          e.preventDefault();
          actions.onPaste();
        }
        break;
      case 'a':
        if (isCtrlCmd) {
          e.preventDefault();
          actions.onSelectAll();
        }
        break;
      case 'delete':
      case 'backspace':
        if (hasSelection) {
          e.preventDefault();
          actions.onDelete();
        }
        break;
      case 'escape':
        e.preventDefault();
        actions.onDeselectAll();
        break;

      // التجميع
      case 'g':
        if (isCtrlCmd && !isShift && hasSelection) {
          e.preventDefault();
          actions.onGroup();
        } else if (isCtrlCmd && isShift && hasSelection) {
          e.preventDefault();
          actions.onUngroup();
        }
        break;

      // الحركة
      case 'arrowup':
        if (hasSelection) {
          e.preventDefault();
          if (isShift) {
            actions.onMoveUpFast();
          } else {
            actions.onMoveUp();
          }
        }
        break;
      case 'arrowdown':
        if (hasSelection) {
          e.preventDefault();
          if (isShift) {
            actions.onMoveDownFast();
          } else {
            actions.onMoveDown();
          }
        }
        break;
      case 'arrowleft':
        if (hasSelection) {
          e.preventDefault();
          if (isShift) {
            actions.onMoveLeftFast();
          } else {
            actions.onMoveLeft();
          }
        }
        break;
      case 'arrowright':
        if (hasSelection) {
          e.preventDefault();
          if (isShift) {
            actions.onMoveRightFast();
          } else {
            actions.onMoveRight();
          }
        }
        break;
    }
  }, [enabled, hasSelection, actions]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled, handleKeyDown]);
};