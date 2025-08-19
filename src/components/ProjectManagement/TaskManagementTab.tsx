import React, { useState } from 'react';
import { KanbanBoard } from './TaskManagement/KanbanBoard';
import { TaskDetails } from './TaskManagement/TaskDetails';
import { AITaskAssistant } from './TaskManagement/AITaskAssistant';
import { Project } from '@/types/project';
import { useUnifiedTasks } from '@/hooks/useUnifiedTasks';
import { TaskFilters as UnifiedTaskFilters } from '@/types/task';
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
  const {
    tasks
  } = useUnifiedTasks(project.id);
  return <div className="h-full flex flex-col space-y-6 p-6">
      {/* Header with view toggle and AI assistant */}
      <div className="rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-black">إدارة المهام</h3>
          <div className="flex items-center gap-4">
            {/* View mode toggle */}
            <div className="flex bg-transparent border border-black/10 rounded-full p-1">
              <button onClick={() => setViewMode('kanban')} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${viewMode === 'kanban' ? 'bg-black text-white' : 'text-black hover:bg-black/5'}`}>
                لوحة كانبان
              </button>
              <button onClick={() => setViewMode('details')} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${viewMode === 'details' ? 'bg-black text-white' : 'text-black hover:bg-black/5'}`}>
                تفاصيل المهام
              </button>
            </div>
            
            {/* AI Assistant Button */}
            
          </div>
        </div>
        
        <p className="text-sm font-medium text-black">
          إدارة شاملة للمهام مع أدوات ذكية للتخطيط والمتابعة والتحليل
        </p>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0] p-6 text-center">
          <h4 className="text-lg font-semibold text-black mb-2">إجمالي المهام</h4>
          <p className="text-2xl font-bold text-black mb-1">{tasks.length}</p>
          <div className="bg-[#bdeed3] px-3 py-1 rounded-full inline-block">
            <span className="text-sm font-medium text-black">نشطة</span>
          </div>
        </div>
        
        <div className="rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0] p-6 text-center">
          <h4 className="text-lg font-semibold text-black mb-2">المكتملة</h4>
          <p className="text-2xl font-bold text-black mb-1">{tasks.filter(t => t.status === 'completed').length}</p>
          <div className="bg-[#a4e2f6] px-3 py-1 rounded-full inline-block">
            <span className="text-sm font-medium text-black">{Math.round(tasks.filter(t => t.status === 'completed').length / Math.max(tasks.length, 1) * 100)}%</span>
          </div>
        </div>
        
        <div className="rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0] p-6 text-center">
          <h4 className="text-lg font-semibold text-black mb-2">المتأخرة</h4>
          <p className="text-2xl font-bold text-black mb-1">{tasks.filter(t => t.status === 'late').length}</p>
          <div className="bg-[#f1b5b9] px-3 py-1 rounded-full inline-block">
            <span className="text-sm font-medium text-black">عاجلة</span>
          </div>
        </div>
        
        <div className="rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0] p-6 text-center">
          <h4 className="text-lg font-semibold text-black mb-2">معدل الإنجاز</h4>
          <p className="text-2xl font-bold text-black mb-1">{Math.round(tasks.reduce((acc, task) => acc + task.progress, 0) / Math.max(tasks.length, 1))}%</p>
          <div className="bg-[#d9d2fd] px-3 py-1 rounded-full inline-block">
            <span className="text-sm font-medium text-black">ممتاز</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {viewMode === 'kanban' ? <KanbanBoard projectId={project.id} filters={filters} /> : <TaskDetails projectId={project.id} filters={filters} />}
      </div>

      {/* AI Assistant Panel */}
      <AITaskAssistant projectId={project.id} />
    </div>;
};