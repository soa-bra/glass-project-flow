import React from 'react';
import { Project } from '@/types/project';
import { NotificationsCard } from './cards/NotificationsCard';
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
    <div className="grid grid-cols-2 grid-rows-4 gap-3 h-full">
      {/* الصف الأول - العمود الأول والثاني - التنبيهات */}
      <div className="col-span-2 row-span-1">
        <NotificationsCard />
      </div>

      {/* الصف الثاني - العمود الأول - بطاقة أداء ذكية */}
      <div className="col-span-1 row-span-1">
        <AISuggestedPerformanceCard 
          type="analytics" 
          title="تحليل الأداء" 
          metric="94%" 
          description="معدل الإنجاز" 
          trend="+12%" 
          chartType="line" 
        />
      </div>

      {/* الصف الثاني والثالث - العمود الثاني - النظرة المالية */}
      <div className="col-span-1 row-span-2">
        <BudgetCard project={project} />
      </div>

      {/* الصف الثالث - العمود الأول - بطاقة أداء ذكية */}
      <div className="col-span-1 row-span-1">
        <AISuggestedPerformanceCard 
          type="team" 
          title="أداء الفريق" 
          metric="23" 
          description="عضو نشط" 
          trend="+5 جدد" 
          chartType="bar" 
        />
      </div>

      {/* الصف الرابع - العمود الأول - بطاقة أداء ذكية */}
      <div className="col-span-1 row-span-1">
        <AISuggestedPerformanceCard 
          type="goals" 
          title="الأهداف" 
          metric="7/10" 
          description="أهداف محققة" 
          trend="3 متبقية" 
          chartType="pie" 
        />
      </div>

      {/* الصف الرابع - العمود الثاني - بطاقة أداء ذكية */}
      <div className="col-span-1 row-span-1">
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