import React, { useState } from 'react';
import { UnifiedTask, TaskFilters } from '@/types/task';
import { useUnifiedTasks } from '@/hooks/useUnifiedTasks';
import { TaskListCard } from '../cards/TaskListCard';
import { TaskDetailsPanel } from './TaskDetailsPanel';
import TaskCard from '@/components/TaskCard';
import { mapToTaskCardProps } from '@/types/task';
interface TaskDetailsProps {
  projectId: string;
  filters: TaskFilters;
}
export const TaskDetails: React.FC<TaskDetailsProps> = ({
  projectId,
  filters
}) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const {
    tasks
  } = useUnifiedTasks(projectId);

  // Filter tasks based on filters
  const filteredTasks = tasks.filter(task => {
    if (filters.assignee && !task.assignee.toLowerCase().includes(filters.assignee.toLowerCase())) {
      return false;
    }
    if (filters.priority && task.priority !== filters.priority) {
      return false;
    }
    if (filters.status && task.status !== filters.status) {
      return false;
    }
    if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    return true;
  });
  const selectedTask = selectedTaskId ? tasks.find(task => task.id === selectedTaskId) || null : null;
  const handleTaskSelect = (taskId: string) => {
    setSelectedTaskId(taskId === selectedTaskId ? null : taskId);
  };
  return <div className="flex gap-6 h-full">
      {/* Task List Column */}
      <div className="w-1/3 min-w-0">
        <div 
          className="font-arabic h-full"
          style={{
            width: '100%',
            maxWidth: '100%',
            backgroundColor: '#aec2cf',
            borderRadius: '40px',
            padding: '10px',
            position: 'relative',
            direction: 'rtl',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div className="flex items-center justify-between mb-6 px-0 mx-[15px] my-[15px]">
            <h3 className="font-arabic" style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#000000',
              fontFamily: 'IBM Plex Sans Arabic'
            }}>
              قائمة المهام
            </h3>
            <div className="text-sm text-black/70">
              {filteredTasks.length} مهمة
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-4 pr-1 py-0 my-0">
              {filteredTasks.map(task => {
                const taskCardProps = mapToTaskCardProps(task);
                const isSelected = selectedTaskId === task.id;
                const shouldFade = selectedTaskId !== null && !isSelected;
                
                return (
                  <div 
                    key={task.id}
                    className={`transition-opacity duration-300 ${shouldFade ? 'opacity-30' : 'opacity-100'}`}
                  >
                    <TaskCard 
                      {...taskCardProps}
                      isSelected={isSelected}
                      isSelectionMode={false}
                      onSelect={handleTaskSelect}
                      onEdit={() => {}}
                      onArchive={() => {}}
                      onDelete={() => {}}
                      onTaskUpdated={() => {}}
                    />
                  </div>
                );
              })}
              
              {filteredTasks.length === 0 && <div className="text-center text-black/50 py-8">
                  لا توجد مهام مطابقة للمرشحات المحددة
                </div>}
            </div>
          </div>
        </div>
      </div>

      {/* Task Details Panel */}
      <div className="flex-1 min-w-0">
        {selectedTask ? <TaskDetailsPanel task={selectedTask} /> : <div className="bg-[#F2FFFF] rounded-3xl border border-black/10 h-full flex items-center justify-center">
            <div className="text-center text-black/50">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-lg font-medium mb-2">اختر مهمة لعرض التفاصيل</h3>
              <p className="text-sm">قم بالنقر على مهمة من القائمة الجانبية لعرض تفاصيلها كاملة</p>
            </div>
          </div>}
      </div>
    </div>;
};