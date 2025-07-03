import React, { useState } from 'react';
import { KanbanBoard } from './TaskManagement/KanbanBoard';
import { SprintBurndownChart } from './TaskManagement/SprintBurndownChart';
import { AITaskAssistant } from './TaskManagement/AITaskAssistant';
import { TaskFilters } from './TaskManagement/TaskFilters';
import { Project } from '@/types/project';

interface TaskManagementTabProps {
  project: Project;
}

export const TaskManagementTab: React.FC<TaskManagementTabProps> = ({ project }) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'chart'>('kanban');
  const [filters, setFilters] = useState({
    assignee: '',
    priority: '',
    status: '',
    search: ''
  });

  return (
    <div className="flex-1 overflow-auto space-y-6">
      {/* Header with view toggle and AI assistant */}
      <div className="bg-[#F2FFFF] rounded-3xl p-6 border border-black/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-black">إدارة المهام</h3>
          <div className="flex items-center gap-4">
            {/* View mode toggle */}
            <div className="flex bg-transparent border border-black/10 rounded-full p-1">
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  viewMode === 'kanban'
                    ? 'bg-black text-white'
                    : 'text-black hover:bg-black/5'
                }`}
              >
                لوحة كانبان
              </button>
              <button
                onClick={() => setViewMode('chart')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  viewMode === 'chart'
                    ? 'bg-black text-white'
                    : 'text-black hover:bg-black/5'
                }`}
              >
                مخطط السبرنت
              </button>
            </div>
            
            {/* AI Assistant Button */}
            <button className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-black/80 transition-colors">
              🤖 مساعد الذكاء الاصطناعي
            </button>
          </div>
        </div>
        
        <p className="text-sm font-medium text-black">
          إدارة شاملة للمهام مع أدوات ذكية للتخطيط والمتابعة والتحليل
        </p>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#F2FFFF] rounded-3xl p-6 text-center border border-black/10">
          <h4 className="text-lg font-semibold text-black mb-2">إجمالي المهام</h4>
          <p className="text-2xl font-bold text-black mb-1">24</p>
          <div className="bg-[#bdeed3] px-3 py-1 rounded-full inline-block">
            <span className="text-sm font-medium text-black">نشطة</span>
          </div>
        </div>
        
        <div className="bg-[#F2FFFF] rounded-3xl p-6 text-center border border-black/10">
          <h4 className="text-lg font-semibold text-black mb-2">المكتملة</h4>
          <p className="text-2xl font-bold text-black mb-1">18</p>
          <div className="bg-[#a4e2f6] px-3 py-1 rounded-full inline-block">
            <span className="text-sm font-medium text-black">75%</span>
          </div>
        </div>
        
        <div className="bg-[#F2FFFF] rounded-3xl p-6 text-center border border-black/10">
          <h4 className="text-lg font-semibold text-black mb-2">المتأخرة</h4>
          <p className="text-2xl font-bold text-black mb-1">2</p>
          <div className="bg-[#f1b5b9] px-3 py-1 rounded-full inline-block">
            <span className="text-sm font-medium text-black">عاجلة</span>
          </div>
        </div>
        
        <div className="bg-[#F2FFFF] rounded-3xl p-6 text-center border border-black/10">
          <h4 className="text-lg font-semibold text-black mb-2">معدل الإنجاز</h4>
          <p className="text-2xl font-bold text-black mb-1">94%</p>
          <div className="bg-[#d9d2fd] px-3 py-1 rounded-full inline-block">
            <span className="text-sm font-medium text-black">ممتاز</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <TaskFilters filters={filters} onFiltersChange={setFilters} />

      {/* Main Content Area */}
      <div className="flex-1 min-h-0">
        {viewMode === 'kanban' ? (
          <KanbanBoard projectId={project.id} filters={filters} />
        ) : (
          <SprintBurndownChart projectId={project.id} />
        )}
      </div>

      {/* AI Assistant Panel */}
      <AITaskAssistant projectId={project.id} />
    </div>
  );
};