import React, { useState } from 'react';
import { UnifiedTask, TaskFilters } from '@/types/task';
import { useUnifiedTasks } from '@/hooks/useUnifiedTasks';
import { TaskListCard } from '../cards/TaskListCard';
import { TaskDetailsPanel } from './TaskDetailsPanel';
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
  const priorityIcons = {
    urgent: '🔴',
    high: '🟠',
    medium: '🟡',
    low: '🟢'
  };
  return <div className={`p-4 rounded-2xl border cursor-pointer transition-all ${isSelected ? 'border-black bg-white shadow-sm' : 'border-black/10 bg-white/50 hover:bg-white hover:border-black/20'}`} onClick={() => onSelect(task.id)}>
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-sm font-medium text-black line-clamp-2 flex-1">
          {task.title}
        </h4>
        <span className="text-lg ml-2 flex-shrink-0">
          {priorityIcons[task.priority]}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="px-2 py-1 rounded-full font-medium text-black" style={{
          backgroundColor: statusColorMap[task.status]
        }}>
            {statusTextMap[task.status]}
          </span>
          <span className="text-black/60">
            {daysLeft === 0 ? 'اليوم' : `${daysLeft} يوم`}
          </span>
        </div>

        <div className="text-xs text-black/60">
          المكلف: {task.assignee}
        </div>

        {task.progress > 0 && <div className="space-y-1">
            <div className="flex justify-between text-xs text-black/60">
              <span>التقدم</span>
              <span>{task.progress}%</span>
            </div>
            <div className="w-full bg-black/10 rounded-full h-1.5">
              <div className="bg-black h-1.5 rounded-full transition-all" style={{
            width: `${task.progress}%`
          }} />
            </div>
          </div>}

        <div className="flex items-center gap-3 text-xs text-black/60">
          {task.attachments > 0 && <span>📎 {task.attachments}</span>}
          {task.comments > 0 && <span>💬 {task.comments}</span>}
        </div>
      </div>
    </div>;
};