import { useEffect } from 'react';
import { useToolsStore } from '../store/tools.store';

export const useKeyboardShortcuts = () => {
  const { setActiveTool } = useToolsStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      const { key, ctrlKey, metaKey, shiftKey } = event;
      const isModifierPressed = ctrlKey || metaKey;

      // Tool shortcuts
      switch (key.toLowerCase()) {
        case 'v':
          if (!isModifierPressed) {
            event.preventDefault();
            setActiveTool('select');
          }
          break;
        case 'h':
          if (!isModifierPressed) {
            event.preventDefault();
            setActiveTool('pan');
          }
          break;
        case 'z':
          if (isModifierPressed && !shiftKey) {
            event.preventDefault();
            // TODO: Implement undo functionality
            console.log('Undo');
          } else if (isModifierPressed && shiftKey) {
            event.preventDefault();
            // TODO: Implement redo functionality
            console.log('Redo');
          } else if (!isModifierPressed) {
            event.preventDefault();
            setActiveTool('zoom');
          }
          break;
        case 'y':
          if (isModifierPressed) {
            event.preventDefault();
            // TODO: Implement redo functionality
            console.log('Redo');
          }
          break;
        case 't':
          if (!isModifierPressed) {
            event.preventDefault();
            setActiveTool('text');
          }
          break;
        case 'r':
          if (!isModifierPressed) {
            event.preventDefault();
            setActiveTool('shapes');
          }
          break;
        case 'p':
          if (!isModifierPressed) {
            event.preventDefault();
            setActiveTool('smart-pen');
          }
          break;
        case 'escape':
          event.preventDefault();
          setActiveTool('select');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTool]);
};