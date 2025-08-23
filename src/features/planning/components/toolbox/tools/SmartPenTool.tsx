import React from 'react';
import { Pen } from 'lucide-react';
import { useToolsStore } from '../../../store/tools.store';
import { cn } from '@/lib/utils';

export const SmartPenTool: React.FC = () => {
  const { setActiveTool, isToolActive } = useToolsStore();
  const isActive = isToolActive('smart-pen');

  return (
    <button
      onClick={() => setActiveTool('smart-pen')}
      className={cn(
        "w-12 h-12 flex items-center justify-center rounded-lg transition-colors",
        "hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary",
        isActive && "bg-primary text-primary-foreground"
      )}
      title="القلم الذكي (P)"
      aria-label="القلم الذكي"
    >
      <Pen size={20} />
    </button>
  );
};