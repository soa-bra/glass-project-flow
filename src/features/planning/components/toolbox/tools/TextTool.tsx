import React from 'react';
import { Type } from 'lucide-react';
import { useToolsStore } from '../../../store/tools.store';
import { cn } from '@/lib/utils';

export const TextTool: React.FC = () => {
  const { setActiveTool, isToolActive } = useToolsStore();
  const isActive = isToolActive('text');

  return (
    <button
      onClick={() => setActiveTool('text')}
      className={cn(
        "w-12 h-12 flex items-center justify-center rounded-lg transition-colors",
        "hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary",
        isActive && "bg-primary text-primary-foreground"
      )}
      title="أداة النص (T)"
      aria-label="أداة النص"
    >
      <Type size={20} />
    </button>
  );
};