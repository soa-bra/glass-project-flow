
import React from 'react';
import { Project } from '@/types/project';
import { NotificationsCard } from './cards/NotificationsCard';
import { BudgetCard } from './cards/BudgetCard';
import { AICard } from './cards/AICard';
import { TaskListCard } from './cards/TaskListCard';
import { ProgressStagesCard } from './cards/ProgressStagesCard';
import { DataVisualizationCard } from './cards/DataVisualizationCard';

interface ProjectCardGridProps {
  project: Project;
}

export const ProjectCardGrid: React.FC<ProjectCardGridProps> = ({ project }) => {
  return (
    <div className="h-full">
      {/* شريط التقدم العلوي */}
      <div className="mb-6">
        <ProgressStagesCard progress={project.progress || 65} />
      </div>

      {/* الشبكة الرئيسية */}
      <div className="grid grid-cols-4 grid-rows-3 gap-4 h-[calc(100%-120px)]">
        {/* الصف الأول */}
        <div className="col-span-1">
          <NotificationsCard />
        </div>
        
        <div className="col-span-1">
          <DataVisualizationCard 
            title="النظرة المالية" 
            value="20" 
            unit="الآف ريال"
            chartType="donut"
          />
        </div>
        
        <div className="col-span-1">
          <DataVisualizationCard 
            title="بيانات" 
            value="17" 
            unit="مليار"
            chartType="bar"
          />
        </div>
        
        <div className="col-span-1 row-span-3">
          <TaskListCard project={project} />
        </div>

        {/* الصف الثاني */}
        <div className="col-span-1">
          <DataVisualizationCard 
            title="بيانات" 
            value="03" 
            unit="مليار"
            chartType="line"
          />
        </div>
        
        <div className="col-span-1">
          <DataVisualizationCard 
            title="بيانات" 
            value="03" 
            unit="مليار"
            chartType="trend"
          />
        </div>
        
        <div className="col-span-1">
          <DataVisualizationCard 
            title="بيانات" 
            value="03" 
            unit="مليار"
            chartType="chart"
          />
        </div>

        {/* الصف الثالث */}
        <div className="col-span-1">
          <DataVisualizationCard 
            title="بيانات" 
            value="20" 
            unit="حالي جاري"
            chartType="circular"
          />
        </div>
        
        <div className="col-span-1">
          <DataVisualizationCard 
            title="بيانات" 
            value="03" 
            unit="مليار"
            chartType="simple"
          />
        </div>
        
        <div className="col-span-1">
          <DataVisualizationCard 
            title="بيانات" 
            value="03" 
            unit="مليار"
            chartType="column"
          />
        </div>
      </div>
    </div>
  );
};
