import React from 'react';
import { Project } from '@/types/project';
import { NotificationsCard } from './cards/NotificationsCard';
import { TaskListCard } from './cards/TaskListCard';
import { BudgetCard } from './cards/BudgetCard';
import { DataVisualizationCard } from './cards/DataVisualizationCard';
import { AISuggestedPerformanceCard } from './cards/AISuggestedPerformanceCard';
interface ProjectCardGridProps {
  project: Project;
}
export const ProjectCardGrid: React.FC<ProjectCardGridProps> = ({
  project
}) => {
  return (
    <div 
      className="h-full w-full p-1 grid gap-2"
      style={{
        gridTemplateColumns: 'minmax(240px, 1fr) minmax(160px, 1fr) minmax(160px, 1fr)',
        gridTemplateRows: 'minmax(60px, 1fr) minmax(80px, 1.5fr) minmax(80px, 1.5fr) minmax(80px, 1fr)',
        gridTemplateAreas: `
          "tasks notifications notifications"
          "tasks analytics budget"
          "tasks team budget"
          "tasks goals reports"
        `
      }}
    >
      {/* قائمة المهام */}
      <div style={{ gridArea: 'tasks' }} className="min-h-0">
        <TaskListCard project={project} />
      </div>

      {/* التنبيهات */}
      <div style={{ gridArea: 'notifications' }} className="min-h-0">
        <NotificationsCard />
      </div>

      {/* بطاقات الأداء */}
      <div style={{ gridArea: 'analytics' }} className="min-h-0">
        <AISuggestedPerformanceCard 
          type="analytics" 
          title="تحليل الأداء" 
          metric="94%" 
          description="معدل الإنجاز" 
          trend="+12%" 
          chartType="line" 
        />
      </div>

      <div style={{ gridArea: 'budget' }} className="min-h-0">
        <BudgetCard project={project} />
      </div>

      <div style={{ gridArea: 'team' }} className="min-h-0">
        <AISuggestedPerformanceCard 
          type="team" 
          title="أداء الفريق" 
          metric="23" 
          description="عضو نشط" 
          trend="+5 جدد" 
          chartType="bar" 
        />
      </div>

      <div style={{ gridArea: 'goals' }} className="min-h-0">
        <AISuggestedPerformanceCard 
          type="goals" 
          title="الأهداف" 
          metric="7/10" 
          description="أهداف محققة" 
          trend="3 متبقية" 
          chartType="pie" 
        />
      </div>

      <div style={{ gridArea: 'reports' }} className="min-h-0">
        <AISuggestedPerformanceCard 
          type="reports" 
          title="التقارير" 
          metric="8" 
          description="تقارير جاهزة" 
          trend="3 جديدة" 
          chartType="donut" 
        />
      </div>
    </div>
  );
};