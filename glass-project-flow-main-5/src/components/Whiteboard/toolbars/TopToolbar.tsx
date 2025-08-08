import React, { useEffect } from 'react';
import { useWhiteboardStore } from '../../../store/whiteboard';
import {
  Undo2,
  Redo2,
  Grid,
  Sun,
  Moon,
  MessageSquare,
  Layers as LayersIcon,
  PaintBucket,
  Users,
} from 'lucide-react';

const TopToolbar: React.FC = () => {
  const { toggleGrid, setTheme, theme, undo, redo, togglePanel } =
    useWhiteboardStore((state) => ({
      toggleGrid: state.toggleGrid,
      setTheme: state.setTheme,
      theme: state.theme,
      undo: state.undo,
      redo: state.redo,
      togglePanel: state.togglePanel,
    }));
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey && e.key === 'Z') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex gap-2 bg-white/80 dark:bg-gray-900/80 rounded-full shadow px-4 py-1 backdrop-blur-sm">
      <button
        onClick={() => undo()}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        title="Undo"
      >
        <Undo2 size={18} />
      </button>
      <button
        onClick={() => redo()}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        title="Redo"
      >
        <Redo2 size={18} />
      </button>
      <button
        onClick={() => toggleGrid()}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        title="Toggle grid"
      >
        <Grid size={18} />
      </button>
      <button
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        title="Toggle theme"
      >
        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      </button>
      <span className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />
      <button
        onClick={() => togglePanel('assistant')}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        title="AI Assistant"
      >
        <MessageSquare size={18} />
      </button>
      <button
        onClick={() => togglePanel('layers')}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        title="Layers"
      >
        <LayersIcon size={18} />
      </button>
      <button
        onClick={() => togglePanel('appearance')}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        title="Appearance"
      >
        <PaintBucket size={18} />
      </button>
      <button
        onClick={() => togglePanel('collaboration')}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        title="Collaboration"
      >
        <Users size={18} />
      </button>
    </div>
  );
};

export default TopToolbar;