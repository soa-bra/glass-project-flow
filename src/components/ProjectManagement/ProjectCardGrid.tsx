import React from 'react';
import { Project } from '@/types/project';
import { NotificationsBox } from './cards/NotificationsBox';
import { TaskListCard } from './cards/TaskListCard';
import { BudgetBox } from './cards/BudgetBox';
import { DataVisualizationBox } from './cards/DataVisualizationBox';
import { AISuggestedPerformanceBox } from './cards/AISuggestedPerformanceBox';
interface ProjectCardGridProps {
  project: Project;
}
export const ProjectCardGrid: React.FC<ProjectCardGridProps> = ({
  project
}) => {
  return <div className="grid grid-cols-3 grid-rows-4 gap-2 h-[90%] py-0 my-0">
      {/* العمود الأول - قائمة المهام (بعرض مساوي للأعمدة الأخرى) */}
      <div className="col-span-1 row-span-4">
        <TaskListCard project={project} />
      </div>

      {/* الصف الأول - العمود الثاني والثالث - التنبيهات */}
      <div className="col-span-2 row-span-1">
        <NotificationsBox />
      </div>

      {/* الصف الثاني - العمود الثاني - بطاقة أداء ذكية */}
      <div className="col-span-1 row-span-1">
        <AISuggestedPerformanceBox type="analytics" title="تحليل الأداء" metric="94%" description="معدل الإنجاز" trend="+12%" chartType="line" />
      </div>

      {/* الصف الثاني والثالث - العمود الثالث - النظرة المالية */}
      <div className="col-span-1 row-span-2">
        <BudgetBox project={project} />
      </div>

      {/* الصف الثالث - العمود الثاني - بطاقة أداء ذكية */}
      <div className="col-span-1 row-span-1">
        <AISuggestedPerformanceBox type="team" title="أداء الفريق" metric="23" description="عضو نشط" trend="+5 جدد" chartType="bar" />
      </div>

      {/* الصف الرابع - العمود الثاني - بطاقة أداء ذكية */}
      <div className="col-span-1 row-span-1">
        <AISuggestedPerformanceBox type="goals" title="الأهداف" metric="7/10" description="أهداف محققة" trend="3 متبقية" chartType="pie" />
      </div>

      {/* الصف الرابع - العمود الثالث - بطاقة أداء ذكية */}
      <div className="col-span-1 row-span-1">
        <AISuggestedPerformanceBox type="reports" title="التقارير" metric="8" description="تقارير جاهزة" trend="3 جديدة" chartType="donut" />
      </div>
    </div>;
};