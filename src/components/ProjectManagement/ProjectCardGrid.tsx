
import React from 'react';
import { Project } from '@/types/project';
import { NotificationsCard } from './cards/NotificationsCard';
import { TaskListCard } from './cards/TaskListCard';
import { FinancialOverviewCard } from './cards/FinancialOverviewCard';
import { DataVisualizationCard } from './cards/DataVisualizationCard';

interface ProjectCardGridProps {
  project: Project;
}

export const ProjectCardGrid: React.FC<ProjectCardGridProps> = ({ project }) => {
  return (
    <div className="grid grid-cols-4 grid-rows-3 gap-4 h-full">
      {/* الصف الأول */}
      
      {/* العمود الأول، الصف الأول - التنبيهات */}
      <div className="col-span-2 row-span-1">
        <NotificationsCard />
      </div>

      {/* العمود الثالث والرابع، الصف الأول - قائمة المهام */}
      <div className="col-span-2 row-span-3">
        <TaskListCard project={project} />
      </div>

      {/* الصف الثاني */}
      
      {/* العمود الأول، الصف الثاني والثالث - النظرة المالية */}
      <div className="col-span-1 row-span-2">
        <FinancialOverviewCard />
      </div>

      {/* العمود الثاني، الصف الثاني والثالث - الرسوم البيانية */}
      <div className="col-span-1 row-span-2">
        <DataVisualizationCard />
      </div>
    </div>
  );
};
