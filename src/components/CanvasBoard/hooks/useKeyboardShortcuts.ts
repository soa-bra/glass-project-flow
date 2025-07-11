import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onDelete?: () => void;
  onSelectAll?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
}

export const useKeyboardShortcuts = ({
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
}: KeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { ctrlKey, metaKey, shiftKey, key } = event;
      const isCtrlOrCmd = ctrlKey || metaKey;

      // Prevent default browser shortcuts
      if (isCtrlOrCmd) {
        switch (key.toLowerCase()) {
          case 'z':
            event.preventDefault();
            if (shiftKey) {
              onRedo?.();
            } else {
              onUndo?.();
            }
            break;
          case 'y':
            event.preventDefault();
            onRedo?.();
            break;
          case 's':
            event.preventDefault();
            onSave?.();
            break;
          case 'c':
            event.preventDefault();
            onCopy?.();
            break;
          case 'v':
            event.preventDefault();
            onPaste?.();
            break;
          case 'a':
            event.preventDefault();
            onSelectAll?.();
            break;
          case '=':
          case '+':
            event.preventDefault();
            onZoomIn?.();
            break;
          case '-':
            event.preventDefault();
            onZoomOut?.();
            break;
          case '0':
            event.preventDefault();
            onZoomReset?.();
            break;
        }
      }

      // Non-modifier keys
      switch (key) {
        case 'Delete':
        case 'Backspace':
          event.preventDefault();
          onDelete?.();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onUndo, onRedo, onSave, onCopy, onPaste, onDelete, onSelectAll, onZoomIn, onZoomOut, onZoomReset]);
};