
import React from 'react';
import { RedesignedBudgetCard } from './RedesignedBudgetCard';
import { ReferenceProjectEvaluation } from './ReferenceProjectEvaluation';
import { ReferenceLegalCard } from './ReferenceLegalCard';
import { ReferenceProgressBar } from './ReferenceProgressBar';
import { ReferenceQuickActions } from './ReferenceQuickActions';
import { useLovableConfig } from '../../hooks/useLovableConfig';
import { DashboardCalendarCard } from './DashboardCalendarCard';
import { DashboardTasksCard } from './DashboardTasksCard';

interface EnhancedProjectDashboardProps {
  projectData: any;
  loading: boolean;
}

export const EnhancedProjectDashboard: React.FC<EnhancedProjectDashboardProps> = ({
  projectData,
  loading
}) => {
  const config = useLovableConfig();

  if (loading || !projectData) {
    return (
      <div className="p-6">
        <div className="space-y-6">
          <div className="rounded-[20px] p-6 animate-pulse"
            style={{background: config.theme.glass.bg, backdropFilter: config.theme.glass.backdrop, border: config.theme.glass.border}} >
            <div className="h-6 bg-white/30 rounded w-1/3 mb-4"></div>
            <div className="h-12 bg-white/30 rounded"></div>
          </div>
          <div className="rounded-[20px] p-4 animate-pulse"
            style={{background: config.theme.glass.bg, backdropFilter: config.theme.glass.backdrop, border: config.theme.glass.border}}>
            <div className="grid grid-cols-5 gap-3">{[...Array(5)].map((_, i) => (<div key={i} className="h-16 bg-white/30 rounded-[15px]"></div>))}</div>
          </div>
          <div className="grid grid-cols-3 gap-6" style={{ minHeight: 500 }}>
            {[...Array(6)].map((_, i) => (<div key={i} className="rounded-[20px] animate-pulse"
              style={{background: config.theme.glass.bg, backdropFilter: config.theme.glass.backdrop, border: config.theme.glass.border}}>
              <div className="p-6">
                <div className="h-4 bg-white/30 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-white/30 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-white/30 rounded w-2/3"></div>
              </div>
            </div>))}
          </div>
        </div>
      </div>
    );
  }

  const completedTasks = projectData.tasks.filter((t:any) => t.status === 'completed').length;
  const totalTasks = projectData.tasks.length;
  const progress = totalTasks > 0 ? completedTasks * 100 / totalTasks : 0;

  return (
    <div className="space-y-0">
      {/* شريط التقدم */}
      <ReferenceProgressBar progress={progress} />

      {/* الإجراءات السريعة */}
      <ReferenceQuickActions />

      {/* التخطيط الثلاثي الأعمدة */}
      <div className="px-6 pb-6">
        <div
          className="grid grid-cols-3 gap-6"
          style={{
            gridTemplateRows: 'repeat(2, minmax(280px, 1fr))',
            minHeight: 600
          }}
        >
          {/* العمود الأول */}
          <div className="space-y-6">
            <RedesignedBudgetCard
              total={projectData.budget.total}
              spent={projectData.budget.spent}
              remaining={projectData.budget.remaining}
            />
            <DashboardCalendarCard />
          </div>

          {/* العمود الثاني */}
          <div className="space-y-6">
            <ReferenceProjectEvaluation />
            <ReferenceLegalCard />
          </div>

          {/* العمود الثالث */}
          <div className="h-full">
            <DashboardTasksCard tasks={projectData.tasks} />
          </div>
        </div>
      </div>
    </div>
  );
};
