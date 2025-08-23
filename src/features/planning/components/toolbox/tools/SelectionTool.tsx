import React from 'react';
import { MousePointer2 } from 'lucide-react';
import { useToolsStore } from '../../../store/tools.store';
import { cn } from '@/lib/utils';

export const SelectionTool: React.FC = () => {
  const { activeTool, setActiveTool, isToolActive } = useToolsStore();
  const isActive = isToolActive('select');

  return (
    <button
      onClick={() => setActiveTool('select')}
      className={cn(
        "w-12 h-12 flex items-center justify-center rounded-lg transition-colors",
        "hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary",
        isActive && "bg-primary text-primary-foreground"
      )}
      title="أداة التحديد (V)"
      aria-label="أداة التحديد"
    >
      <MousePointer2 size={20} />
    </button>
  );
};