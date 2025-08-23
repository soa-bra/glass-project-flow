import React from 'react';
import { ZoomIn } from 'lucide-react';
import { useToolsStore } from '../../../store/tools.store';
import { cn } from '@/lib/utils';

export const ZoomTool: React.FC = () => {
  const { setActiveTool, isToolActive } = useToolsStore();
  const isActive = isToolActive('zoom');

  return (
    <button
      onClick={() => setActiveTool('zoom')}
      className={cn(
        "w-12 h-12 flex items-center justify-center rounded-lg transition-colors",
        "hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary",
        isActive && "bg-primary text-primary-foreground"
      )}
      title="أداة التكبير (Z)"
      aria-label="أداة التكبير"
    >
      <ZoomIn size={20} />
    </button>
  );
};