
import React from 'react';
import { Project } from '@/types/project';
import { NotificationsCard } from './cards/NotificationsCard';
import { BudgetCard } from './cards/BudgetCard';
import { AICard } from './cards/AICard';
import { TaskListCard } from './cards/TaskListCard';

interface ProjectCardGridProps {
  project: Project;
}

export const ProjectCardGrid: React.FC<ProjectCardGridProps> = ({ project }) => {
  return (
    <div className="grid grid-cols-3 grid-rows-4 gap-4 h-full">
      {/* الصف الأول */}
      {/* العمود 1-2، الصف 1 - التنبيهات */}
      <div className="col-span-2">
        <NotificationsCard />
      </div>

      {/* العمود 3، الصف 1-4 - قائمة المهام */}
      <div className="row-span-4">
        <TaskListCard project={project} />
      </div>

      {/* العمود 1، الصف 2-3 - الميزانية */}
      <div className="row-span-2">
        <BudgetCard project={project} />
      </div>

      {/* العمود 2، الصف 2-4 - اقتراحات الذكاء الاصطناعي */}
      <div className="row-span-3">
        <AICard project={project} />
      </div>
    </div>
  );
};
