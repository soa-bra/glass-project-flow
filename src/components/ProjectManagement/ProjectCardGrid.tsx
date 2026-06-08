import React from 'react';
import { Project } from '@/types/project';
import { NotificationsBox } from './cards/NotificationsBox';
import { TaskListCard } from './cards/TaskListCard';
import { BudgetBox } from './cards/BudgetBox';
import { AISuggestedPerformanceBox } from './cards/AISuggestedPerformanceBox';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';
import { useProjectMetrics } from '@/hooks/useProjectMetrics';

interface ProjectCardGridProps {
  project: Project;
}

export const ProjectCardGrid: React.FC<ProjectCardGridProps> = ({ project }) => {
  const { taskStats, teamStats, budgetTotals } = useProjectMetrics(project.id);

  const completionTrend = taskStats.total > 0
    ? `${taskStats.done} مكتملة من ${taskStats.total}`
    : '—';
  const teamTrend = taskStats.inProgress > 0 ? `${taskStats.inProgress} قيد التنفيذ` : '—';
  const goalsTrend = taskStats.overdue > 0 ? `${taskStats.overdue} متأخرة` : 'لا توجد متأخرات';
  const budgetTrend = budgetTotals.planned > 0
    ? `${Math.round(budgetTotals.percentage)}% من الميزانية`
    : '—';

  return (
    <AppDashboardGrid columns={12} density="compact" minRowHeight="auto">
      <AppGridItem colSpan={5} rowSpan={4} tabletSpan={6} className="min-h-[300px] max-h-[65vh]">
        <TaskListCard project={project} />
      </AppGridItem>

      <AppGridItem colSpan={7} rowSpan={1} tabletSpan={6} className="min-h-[120px]">
        <NotificationsBox projectId={project.id} />
      </AppGridItem>

      <AppGridItem colSpan={3} rowSpan={1} tabletSpan={3} className="min-h-[140px]">
        <AISuggestedPerformanceBox type="analytics" title="تحليل الأداء" metric={`${taskStats.completionRate}%`} description="معدل الإنجاز" trend={completionTrend} chartType="line" />
      </AppGridItem>

      <AppGridItem colSpan={4} rowSpan={2} tabletSpan={3} className="min-h-[280px]">
        <BudgetBox project={project} />
      </AppGridItem>

      <AppGridItem colSpan={3} rowSpan={1} tabletSpan={3} className="min-h-[140px]">
        <AISuggestedPerformanceBox type="team" title="أداء الفريق" metric={String(teamStats.activeMembers)} description="عضو نشط" trend={teamTrend} chartType="bar" />
      </AppGridItem>

      <AppGridItem colSpan={3} rowSpan={1} tabletSpan={3} className="min-h-[140px]">
        <AISuggestedPerformanceBox type="goals" title="المهام" metric={`${taskStats.done}/${taskStats.total}`} description="مهام منجزة" trend={goalsTrend} chartType="pie" />
      </AppGridItem>

      <AppGridItem colSpan={4} rowSpan={1} tabletSpan={3} className="min-h-[140px]">
        <AISuggestedPerformanceBox type="reports" title="الميزانية" metric={`${Math.round(budgetTotals.percentage)}%`} description="نسبة الصرف" trend={budgetTrend} chartType="donut" />
      </AppGridItem>
    </AppDashboardGrid>
  );
};
