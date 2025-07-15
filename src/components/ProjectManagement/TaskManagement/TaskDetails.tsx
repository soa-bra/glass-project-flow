import React, { useState } from 'react';
import { UnifiedTask, TaskFilters } from '@/types/task';
import { useUnifiedTasks } from '@/hooks/useUnifiedTasks';
import { TaskListCard } from '../cards/TaskListCard';
import { TaskDetailsPanel } from './TaskDetailsPanel';
import TaskCardLayout from '@/components/TaskCard/TaskCardLayout';
import TaskCardHeader from '@/components/TaskCard/TaskCardHeader';
import TaskCardFooterSimple from '@/components/TaskCard/TaskCardFooterSimple';
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
    if (!filters) return true; // Safety check for undefined filters
    
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
              {filteredTasks.map(task => <TaskListItem key={task.id} task={task} isSelected={selectedTaskId === task.id} onSelect={handleTaskSelect} />)}
              
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
interface TaskListItemProps {
  task: UnifiedTask;
  isSelected: boolean;
  onSelect: (taskId: string) => void;
}
const TaskListItem: React.FC<TaskListItemProps> = ({
  task,
  isSelected,
  onSelect
}) => {
  const dueDate = new Date(task.dueDate);
  const daysLeft = Math.max(Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)), 0);
  
  const statusColorMap = {
    completed: '#bdeed3',
    'in-progress': '#a4e2f6',
    todo: '#dfecf2',
    stopped: '#f1b5b9',
    treating: '#d9d2fd',
    late: '#fbe2aa'
  };
  
  const statusTextMap = {
    completed: 'مكتملة',
    'in-progress': 'قيد التنفيذ',
    todo: 'لم تبدأ',
    stopped: 'متوقفة',
    treating: 'تحت المعالجة',
    late: 'متأخرة'
  };

  const priorityMap = {
    urgent: 'urgent-important',
    high: 'urgent-not-important', 
    medium: 'not-urgent-important',
    low: 'not-urgent-not-important'
  } as const;

  const handleCardClick = () => {
    onSelect(task.id);
  };

  return (
    <div onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <TaskCardLayout 
        id={task.id.toString()}
        isSelected={isSelected}
        isSelectionMode={true}
        isOtherSelected={false}
      >
        <TaskCardHeader
          daysLeft={daysLeft}
          title={task.title}
          description={task.description || 'لا يوجد وصف'}
          priority={priorityMap[task.priority] || 'not-urgent-not-important'}
        />
        
        <TaskCardFooterSimple
          status={statusTextMap[task.status]}
          statusColor={statusColorMap[task.status]}
          date={daysLeft === 0 ? 'اليوم' : `${daysLeft} يوم`}
          assignee={task.assignee}
          members={task.comments > 0 ? `💬 ${task.comments}` : 'لا توجد تعليقات'}
          isSelected={isSelected}
        />
      </TaskCardLayout>
    </div>
  );
};