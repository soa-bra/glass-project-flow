import React, { useState } from 'react';
import { KanbanBoard } from './TaskManagement/KanbanBoard';
import { SprintBurndownChart } from './TaskManagement/SprintBurndownChart';
import { GanttChart } from './TaskManagement/GanttChart';
import { TaskDetails } from './TaskManagement/TaskDetails';
import { AITaskAssistant } from './TaskManagement/AITaskAssistant';
import { TaskFilters } from './TaskManagement/TaskFilters';
import { Project } from '@/types/project';
import { useUnifiedTasks } from '@/hooks/useUnifiedTasks';
import { TaskFilters as UnifiedTaskFilters } from '@/types/task';

interface TaskManagementTabProps {
  project: Project;
}

export const TaskManagementTab: React.FC<TaskManagementTabProps> = ({ project }) => {
  const { tasks } = useUnifiedTasks(project.id);

  return (
    <div className="flex-1 overflow-auto space-y-6">
      {/* Header */}
      <div className="bg-[#F2FFFF] rounded-3xl p-6 border border-black/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-black">إدارة المهام</h3>
        </div>
        
        <p className="text-sm font-medium text-black">
          إدارة شاملة للمهام مع لوحة كانبان للتخطيط والمتابعة
        </p>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#F2FFFF] rounded-3xl p-6 text-center border border-black/10">
          <h4 className="text-lg font-semibold text-black mb-2">إجمالي المهام</h4>
          <p className="text-2xl font-bold text-black mb-1">{tasks.length}</p>
          <div className="bg-[#bdeed3] px-3 py-1 rounded-full inline-block">
            <span className="text-sm font-medium text-black">نشطة</span>
          </div>
        </div>
        
        <div className="bg-[#F2FFFF] rounded-3xl p-6 text-center border border-black/10">
          <h4 className="text-lg font-semibold text-black mb-2">المكتملة</h4>
          <p className="text-2xl font-bold text-black mb-1">{tasks.filter(t => t.status === 'completed').length}</p>
          <div className="bg-[#a4e2f6] px-3 py-1 rounded-full inline-block">
            <span className="text-sm font-medium text-black">{Math.round((tasks.filter(t => t.status === 'completed').length / Math.max(tasks.length, 1)) * 100)}%</span>
          </div>
        </div>
        
        <div className="bg-[#F2FFFF] rounded-3xl p-6 text-center border border-black/10">
          <h4 className="text-lg font-semibold text-black mb-2">المتأخرة</h4>
          <p className="text-2xl font-bold text-black mb-1">{tasks.filter(t => t.status === 'late').length}</p>
          <div className="bg-[#f1b5b9] px-3 py-1 rounded-full inline-block">
            <span className="text-sm font-medium text-black">عاجلة</span>
          </div>
        </div>
        
        <div className="bg-[#F2FFFF] rounded-3xl p-6 text-center border border-black/10">
          <h4 className="text-lg font-semibold text-black mb-2">معدل الإنجاز</h4>
          <p className="text-2xl font-bold text-black mb-1">{Math.round(tasks.reduce((acc, task) => acc + task.progress, 0) / Math.max(tasks.length, 1))}%</p>
          <div className="bg-[#d9d2fd] px-3 py-1 rounded-full inline-block">
            <span className="text-sm font-medium text-black">ممتاز</span>
          </div>
        </div>
      </div>

      {/* Main Content Area - Kanban Board Only */}
      <div className="flex-1 min-h-0">
        <KanbanBoard projectId={project.id} filters={{
          assignee: '',
          priority: '',
          status: '',
          search: ''
        }} />
      </div>
    </div>
  );
};