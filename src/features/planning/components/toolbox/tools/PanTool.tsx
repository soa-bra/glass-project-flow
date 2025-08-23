import React from 'react';
import { Hand } from 'lucide-react';
import { useToolsStore } from '../../../store/tools.store';
import { cn } from '@/lib/utils';

export const PanTool: React.FC = () => {
  const { setActiveTool, isToolActive } = useToolsStore();
  const isActive = isToolActive('pan');

  return (
    <button
      onClick={() => setActiveTool('pan')}
      className={cn(
        "w-12 h-12 flex items-center justify-center rounded-lg transition-colors",
        "hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary",
        isActive && "bg-primary text-primary-foreground"
      )}
      title="أداة التحريك (H)"
      aria-label="أداة التحريك"
    >
      <Hand size={20} />
    </button>
  );
};