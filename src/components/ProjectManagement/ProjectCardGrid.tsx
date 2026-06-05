import React from 'react';
import { Project } from '@/types/project';
import { NotificationsBox } from './cards/NotificationsBox';
import { TaskListCard } from './cards/TaskListCard';
import { BudgetBox } from './cards/BudgetBox';
import { AISuggestedPerformanceBox } from './cards/AISuggestedPerformanceBox';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';

interface ProjectCardGridProps {
  project: Project;
}

export const ProjectCardGrid: React.FC<ProjectCardGridProps> = ({
  project
}) => {
  return (
    <AppDashboardGrid columns={12} density="compact" minRowHeight="auto">
      {/* العمود الأيمن - قائمة المهام: 5 أعمدة، 4 صفوف */}
      <AppGridItem colSpan={5} rowSpan={4} tabletSpan={6} className="min-h-[300px] max-h-[65vh]">
        <TaskListCard project={project} />
      </AppGridItem>

      {/* التنبيهات: 7 أعمدة عرض */}
      <AppGridItem colSpan={7} rowSpan={1} tabletSpan={6} className="min-h-[120px]">
        <NotificationsBox />
      </AppGridItem>

      {/* تحليل الأداء + النظرة المالية: صف واحد */}
      <AppGridItem colSpan={3} rowSpan={1} tabletSpan={3} className="min-h-[140px]">
        <AISuggestedPerformanceBox type="analytics" title="تحليل الأداء" metric="0%" description="معدل الإنجاز" trend="—" chartType="line" />
      </AppGridItem>

      <AppGridItem colSpan={4} rowSpan={2} tabletSpan={3} className="min-h-[280px]">
        <BudgetBox project={project} />
      </AppGridItem>

      {/* أداء الفريق + الأهداف */}
      <AppGridItem colSpan={3} rowSpan={1} tabletSpan={3} className="min-h-[140px]">
        <AISuggestedPerformanceBox type="team" title="أداء الفريق" metric="0" description="عضو نشط" trend="—" chartType="bar" />
      </AppGridItem>

      {/* الأهداف + التقارير */}
      <AppGridItem colSpan={3} rowSpan={1} tabletSpan={3} className="min-h-[140px]">
        <AISuggestedPerformanceBox type="goals" title="الأهداف" metric="0/0" description="أهداف محققة" trend="—" chartType="pie" />
      </AppGridItem>

      <AppGridItem colSpan={4} rowSpan={1} tabletSpan={3} className="min-h-[140px]">
        <AISuggestedPerformanceBox type="reports" title="التقارير" metric="0" description="تقارير جاهزة" trend="—" chartType="donut" />
      </AppGridItem>
    </AppDashboardGrid>
  );
};
