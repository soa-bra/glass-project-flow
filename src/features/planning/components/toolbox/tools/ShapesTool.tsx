import React from 'react';
import { Square } from 'lucide-react';
import { useToolsStore } from '../../../store/tools.store';
import { cn } from '@/lib/utils';

export const ShapesTool: React.FC = () => {
  const { setActiveTool, isToolActive } = useToolsStore();
  const isActive = isToolActive('shapes');

  return (
    <button
      onClick={() => setActiveTool('shapes')}
      className={cn(
        "w-12 h-12 flex items-center justify-center rounded-lg transition-colors",
        "hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary",
        isActive && "bg-primary text-primary-foreground"
      )}
      title="أداة الأشكال (R)"
      aria-label="أداة الأشكال"
    >
      <Square size={20} />
    </button>
  );
};