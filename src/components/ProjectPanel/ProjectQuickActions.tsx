
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
      <div className="grid grid-cols-3 md:flex gap-3 p-4 bg-white/30 backdrop-blur-[15px] rounded-[20px] border border-white/40">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onAddTask}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-sky-500 hover:bg-sky-600 text-white transition-all duration-200 font-medium text-sm font-arabic"
            >
              <Plus size={18} />
              <span className="hidden md:inline">إضافة مهمة</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>إضافة مهمة جديدة</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onSmartGenerate}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-white transition-all duration-200 font-medium text-sm font-arabic"
            >
              <Zap size={18} />
              <span className="hidden md:inline">توليد ذكي</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>توليد مهام ذكية</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onEditProject}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-gray-500 hover:bg-gray-600 text-white transition-all duration-200 font-medium text-sm font-arabic"
            >
              <Edit3 size={18} />
              <span className="hidden md:inline">تعديل المشروع</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>تعديل بيانات المشروع</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
