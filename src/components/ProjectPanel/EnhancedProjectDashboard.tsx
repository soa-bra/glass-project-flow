import React from 'react';
import { RedesignedBudgetCard } from './RedesignedBudgetCard';
import { RedesignedPhaseBar } from './RedesignedPhaseBar';
import { RedesignedQuickActionsGrid } from './RedesignedQuickActionsGrid';
import { useLovableConfig } from '../../hooks/useLovableConfig';
import { DashboardCalendarCard } from './DashboardCalendarCard';
import { DashboardTasksCard } from './DashboardTasksCard';
import { DashboardProgressCard } from './DashboardProgressCard';

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
          <div className="grid gap-6" style={{
            gridTemplateColumns: '35% 5% 60%',
            gridTemplateRows: 'repeat(2, 1fr)',
            minHeight: 500
          }}>
            {[...Array(4)].map((_, i) => (<div key={i} className="rounded-[20px] animate-pulse"
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
    <div className="p-6 space-y-6">
      <RedesignedPhaseBar progress={progress} />

      <RedesignedQuickActionsGrid />

      <div
        className="grid gap-6"
        style={{
          gridTemplateColumns: '35% 5% 60%',
          gridTemplateRows: 'repeat(2, 1fr)',
          minHeight: 500
        }}
      >
        {/* Budget Card - Area: budget (row 1, col 1) */}
        <div style={{ gridArea: '1 / 1 / 2 / 2' }}>
          <RedesignedBudgetCard
            total={projectData.budget.total}
            spent={projectData.budget.spent}
            remaining={projectData.budget.remaining}
          />
        </div>

        {/* Calendar Card - Area: calendar (row 2, col 1) */}
        <div style={{ gridArea: '2 / 1 / 3 / 2' }}>
          <DashboardCalendarCard />
        </div>

        {/* Progress Card - Area: gap (row 1, col 2) */}
        <div style={{ gridArea: '1 / 2 / 2 / 3' }}>
          <DashboardProgressCard
            completedTasks={completedTasks}
            totalTasks={totalTasks}
          />
        </div>

        {/* Tasks Card - Area: tasks (both rows, col 3) */}
        <div style={{ gridArea: '1 / 3 / 3 / 4' }}>
          <DashboardTasksCard tasks={projectData.tasks} />
        </div>
      </div>
    </div>
  );
};
