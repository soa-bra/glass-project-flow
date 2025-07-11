
import React from 'react';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

interface EnhancedKeyboardShortcutsProps {
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onSelectAll: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onToolSelect: (tool: string) => void;
  onToggleGrid: () => void;
  onToggleSnap: () => void;
}

export const EnhancedKeyboardShortcuts: React.FC<EnhancedKeyboardShortcutsProps> = ({
  onUndo,
  onRedo,
  onSave,
  onCopy,
  onPaste,
  onDelete,
  onSelectAll,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onToolSelect,
  onToggleGrid,
  onToggleSnap
}) => {
  useKeyboardShortcuts({
    onUndo,
    onRedo,
    onSave,
    onCopy,
    onPaste,
    onDelete,
    onSelectAll,
    onZoomIn,
    onZoomOut,
    onZoomReset
  });

  // Enhanced shortcuts with tool selection
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key, ctrlKey, metaKey, shiftKey } = event;
      const isCtrlOrCmd = ctrlKey || metaKey;

      // Tool shortcuts
      if (!isCtrlOrCmd && !shiftKey) {
        switch (key.toLowerCase()) {
          case 'v':
            onToolSelect('select');
            break;
          case 'p':
            onToolSelect('pen');
            break;
          case 'r':
            onToolSelect('rectangle');
            break;
          case 'c':
            onToolSelect('circle');
            break;
          case 't':
            onToolSelect('text');
            break;
          case 'h':
            onToolSelect('hand');
            break;
        }
      }

      // Grid and snap shortcuts
      if (isCtrlOrCmd) {
        switch (key.toLowerCase()) {
          case 'g':
            event.preventDefault();
            onToggleGrid();
            break;
          case 'shift+s':
            event.preventDefault();
            onToggleSnap();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onToolSelect, onToggleGrid, onToggleSnap]);

  return null;
};
