
import React from 'react';
import { Plus, Zap, Edit3 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ProjectQuickActionsProps {
  onAddTask: () => void;
  onSmartGenerate: () => void;
  onEditProject: () => void;
}

export const ProjectQuickActions: React.FC<ProjectQuickActionsProps> = ({
  onAddTask,
  onSmartGenerate,
  onEditProject
}) => {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-2 p-4 bg-white/20 backdrop-blur-[10px] rounded-[20px] border border-white/30">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onAddTask}
              className="w-12 h-12 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center transition-colors"
            >
              <Plus size={20} />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>إضافة مهمة</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onSmartGenerate}
              className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center transition-colors"
            >
              <Zap size={20} />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>توليد ذكي للمهام</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onEditProject}
              className="w-12 h-12 rounded-full bg-gray-500 hover:bg-gray-600 text-white flex items-center justify-center transition-colors"
            >
              <Edit3 size={20} />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>تعديل المشروع</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
