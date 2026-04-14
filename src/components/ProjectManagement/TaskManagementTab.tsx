import React, { useState } from 'react';
import { KanbanBox } from './TaskManagement/KanbanBox';
import { TaskDetailsBox } from './TaskManagement/TaskDetailsBox';
import { AITaskAssistant } from './TaskManagement/AITaskAssistant';
import { Project } from '@/types/project';
import { useUnifiedTasks } from '@/hooks/useUnifiedTasks';
import { TaskFilters as UnifiedTaskFilters } from '@/types/task';
import { MetricHeroCard } from '@/components/shared/visual-data';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';
import { AppCardSurface } from '@/components/shared/surfaces/AppCardSurface';

interface TaskManagementTabProps {
  project: Project;
}

export const TaskManagementTab: React.FC<TaskManagementTabProps> = ({
  project
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'details'>('kanban');
  const [filters, setFilters] = useState<UnifiedTaskFilters>({
    assignee: '',
    priority: '',
    status: '',
    search: ''
  });
  const { tasks } = useUnifiedTasks(project.id);

  const completed = tasks.filter(t => t.status === 'completed').length;
  const late = tasks.filter(t => t.status === 'late').length;
  const avgProgress = Math.round(tasks.reduce((acc, task) => acc + task.progress, 0) / Math.max(tasks.length, 1));
  const completionPct = Math.round(completed / Math.max(tasks.length, 1) * 100);

  return (
    <div className="flex-1 overflow-auto space-y-6">
      {/* Header */}
      <AppCardSurface density="compact">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[11px] font-medium text-[rgba(11,15,18,0.6)] uppercase tracking-wide">إدارة المهام</h3>
          <div className="flex items-center gap-4">
            <div className="flex bg-transparent ring-1 ring-[rgba(11,15,18,0.3)] rounded-full p-1">
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  viewMode === 'kanban' ? 'bg-[#0B0F12] text-white' : 'text-[#0B0F12] hover:bg-[rgba(11,15,18,0.05)]'
                }`}
              >
                لوحة كانبان
              </button>
              <button
                onClick={() => setViewMode('details')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  viewMode === 'details' ? 'bg-[#0B0F12] text-white' : 'text-[#0B0F12] hover:bg-[rgba(11,15,18,0.05)]'
                }`}
              >
                تفاصيل المهام
              </button>
            </div>
          </div>
        </div>
        <p className="text-sm text-[rgba(11,15,18,0.6)]">
          إدارة شاملة للمهام مع أدوات ذكية للتخطيط والمتابعة والتحليل
        </p>
      </AppCardSurface>

      {/* Task Statistics - Bold Metrics */}
      <AppDashboardGrid columns={12} density="default" minRowHeight="auto">
        <AppGridItem colSpan={3} tabletSpan={3}>
          <MetricHeroCard
            title="إجمالي المهام"
            value={String(tasks.length)}
            unit="مهمة"
            badgeText="نشطة"
            badgeColor="#bdeed3"
          />
        </AppGridItem>
        <AppGridItem colSpan={3} tabletSpan={3}>
          <MetricHeroCard
            title="المكتملة"
            value={String(completed)}
            unit="مهمة"
            badgeText={`${completionPct}%`}
            badgeColor="#a4e2f6"
          />
        </AppGridItem>
        <AppGridItem colSpan={3} tabletSpan={3}>
          <MetricHeroCard
            title="المتأخرة"
            value={String(late)}
            unit="مهمة"
            badgeText="عاجلة"
            badgeColor="#f1b5b9"
          />
        </AppGridItem>
        <AppGridItem colSpan={3} tabletSpan={3}>
          <MetricHeroCard
            title="معدل الإنجاز"
            value={`${avgProgress}%`}
            badgeText="ممتاز"
            badgeColor="#d9d2fd"
          />
        </AppGridItem>
      </AppDashboardGrid>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0">
        {viewMode === 'kanban' ? (
          <KanbanBox projectId={project.id} filters={filters} />
        ) : (
          <TaskDetailsBox projectId={project.id} filters={filters} />
        )}
      </div>

      {/* AI Assistant Panel */}
      <AITaskAssistant projectId={project.id} />
    </div>
  );
};
