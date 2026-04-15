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
    <AppDashboardGrid columns={12} density="compact" minRowHeight="140px">
      {/* العمود الأيمن - قائمة المهام: 5 أعمدة، 4 صفوف */}
      <AppGridItem colSpan={5} rowSpan={4} tabletSpan={6} className="max-h-[620px]">
        <TaskListCard project={project} />
      </AppGridItem>

      {/* التنبيهات: 7 أعمدة عرض */}
      <AppGridItem colSpan={7} rowSpan={1} tabletSpan={6}>
        <NotificationsBox />
      </AppGridItem>

      {/* تحليل الأداء + النظرة المالية: صف واحد */}
      <AppGridItem colSpan={3} rowSpan={1} tabletSpan={3}>
        <AISuggestedPerformanceBox type="analytics" title="تحليل الأداء" metric="94%" description="معدل الإنجاز" trend="+12%" chartType="line" />
      </AppGridItem>

      <AppGridItem colSpan={4} rowSpan={2} tabletSpan={3}>
        <BudgetBox project={project} />
      </AppGridItem>

      {/* أداء الفريق + الأهداف */}
      <AppGridItem colSpan={3} rowSpan={1} tabletSpan={3}>
        <AISuggestedPerformanceBox type="team" title="أداء الفريق" metric="23" description="عضو نشط" trend="+5 جدد" chartType="bar" />
      </AppGridItem>

      {/* الأهداف + التقارير */}
      <AppGridItem colSpan={3} rowSpan={1} tabletSpan={3}>
        <AISuggestedPerformanceBox type="goals" title="الأهداف" metric="7/10" description="أهداف محققة" trend="3 متبقية" chartType="pie" />
      </AppGridItem>

      <AppGridItem colSpan={4} rowSpan={1} tabletSpan={3}>
        <AISuggestedPerformanceBox type="reports" title="التقارير" metric="8" description="تقارير جاهزة" trend="3 جديدة" chartType="donut" />
      </AppGridItem>
    </AppDashboardGrid>
  );
};
