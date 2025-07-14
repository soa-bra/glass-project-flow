import React, { useState } from 'react';
import { useUnifiedTasks } from '@/hooks/useUnifiedTasks';
import { UnifiedTask, TaskFilters } from '@/types/task';
import { TaskDetails } from './TaskDetails';

interface GanttChartProps {
  projectId: string;
  filters?: TaskFilters;
}

export const GanttChart: React.FC<GanttChartProps> = ({ projectId, filters }) => {
  const { getProjectTasks } = useUnifiedTasks(projectId);
  const tasks = getProjectTasks(filters);
  const [selectedTaskForDetails, setSelectedTaskForDetails] = useState<UnifiedTask | null>(null);

  const getStatusColor = (status: UnifiedTask['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-[#bdeed3]';
      case 'in-progress':
        return 'bg-[#a4e2f6]';
      case 'todo':
        return 'bg-[#dfecf2]';
      case 'stopped':
        return 'bg-[#f1b5b9]';
      case 'treating':
        return 'bg-[#d9d2fd]';
      case 'late':
        return 'bg-[#fbe2aa]';
      default:
        return 'bg-gray-200';
    }
  };

  const getProgressColor = (status: UnifiedTask['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-[#bdeed3]';
      case 'in-progress':
        return 'bg-[#a4e2f6]';
      case 'todo':
        return 'bg-[#d9d2fd]';
      case 'stopped':
        return 'bg-[#f1b5b9]';
      case 'treating':
        return 'bg-[#d9d2fd]';
      case 'late':
        return 'bg-[#fbe2aa]';
      default:
        return 'bg-gray-300';
    }
  };

  // Calculate date range for the timeline based on actual tasks
  const taskDates = tasks.map(task => new Date(task.dueDate).getTime());
  const startDate = tasks.length > 0 ? new Date(Math.min(...taskDates) - 7 * 24 * 60 * 60 * 1000) : new Date();
  const endDate = tasks.length > 0 ? new Date(Math.max(...taskDates) + 7 * 24 * 60 * 60 * 1000) : new Date();
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  const calculatePosition = (task: UnifiedTask) => {
    const taskStart = new Date(task.dueDate);
    const taskEnd = new Date(taskStart.getTime() + 7 * 24 * 60 * 60 * 1000); // مدة افتراضية 7 أيام
    const left = ((taskStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) / totalDays * 100;
    const width = 7 / totalDays * 100; // عرض ثابت للمهام
    return { left: `${Math.max(0, left)}%`, width: `${Math.min(width, 100 - left)}%` };
  };

  // Generate timeline headers
  const timelineHeaders = [];
  for (let i = 0; i < totalDays; i += 7) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    timelineHeaders.push(date.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' }));
  }

  return (
    <div className="bg-[#F2FFFF] rounded-3xl p-6 border border-black/10 h-full overflow-auto">
      <h3 className="text-lg font-semibold text-black mb-6">مخطط جانت - جدولة المهام</h3>
      
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Timeline Header */}
          <div className="flex mb-4">
            <div className="w-64 flex-shrink-0"></div>
            <div className="flex-1 grid grid-cols-9 border-b border-black/10 pb-2">
              {timelineHeaders.map((header, index) => (
                <div key={index} className="text-xs text-center text-black font-medium">
                  {header}
                </div>
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div className="space-y-4">
            {tasks.map((task) => {
              const position = calculatePosition(task);
              const statusText = {
                completed: 'مكتملة',
                'in-progress': 'قيد التنفيذ',
                todo: 'لم تبدأ',
                stopped: 'متوقفة',
                treating: 'تحت المعالجة',
                late: 'متأخرة'
              };
              
              return (
                <div key={task.id} className="flex items-center">
                  {/* Task Info */}
                  <div className="w-64 flex-shrink-0 pr-4">
                    <div 
                      className="bg-white rounded-2xl p-3 border border-black/10 cursor-pointer hover:bg-gray-50 transition-colors"
                      onDoubleClick={() => setSelectedTaskForDetails(task)}
                    >
                      <h4 className="text-sm font-semibold text-black mb-1">{task.title}</h4>
                      <p className="text-xs text-gray-600 mb-2">{task.assignee}</p>
                      <div className="flex items-center gap-2">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium text-black ${getStatusColor(task.status)}`}>
                          {statusText[task.status]}
                        </div>
                        <span className="text-xs text-gray-600">{task.progress}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Bar */}
                  <div className="flex-1 relative h-8">
                    <div 
                      className="absolute top-1 h-6 rounded-full border border-black/10 bg-white"
                      style={position}
                    >
                      <div 
                        className={`h-full rounded-full ${getProgressColor(task.status)}`}
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-black/10">
        <h4 className="text-sm font-semibold text-black mb-3">المفتاح:</h4>
        <div className="flex gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#bdeed3]"></div>
            <span className="text-black">مكتملة</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#a4e2f6]"></div>
            <span className="text-black">قيد التنفيذ</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#dfecf2]"></div>
            <span className="text-black">لم تبدأ</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#f1b5b9]"></div>
            <span className="text-black">متوقفة</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#d9d2fd]"></div>
            <span className="text-black">تحت المعالجة</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#fbe2aa]"></div>
            <span className="text-black">متأخرة</span>
          </div>
        </div>
      </div>

      {/* Task Details Modal */}
      {selectedTaskForDetails && (
        <TaskDetails
          task={selectedTaskForDetails}
          isOpen={!!selectedTaskForDetails}
          onClose={() => setSelectedTaskForDetails(null)}
        />
      )}
    </div>
  );
};