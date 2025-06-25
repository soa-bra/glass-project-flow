
import React from 'react';
import TaskCard from '@/components/TaskCard';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  statusColor: string;
  date: string;
  assignee: string;
  members: string;
  daysLeft: number;
  priority: 'urgent-important' | 'urgent-not-important' | 'not-urgent-important' | 'not-urgent-not-important';
}

interface TaskListContentProps {
  tasks?: Task[];
}

export const TaskListContent: React.FC<TaskListContentProps> = ({ tasks = [] }) => {
  // Default tasks if no tasks are provided
  const defaultTasks: Task[] = [
    {
      id: 1,
      title: 'تصميم الواجهة',
      description: 'تطوير موقع سوبرا',
      status: 'وفق الخطة',
      statusColor: '#A1E8B8',
      date: '28 May',
      assignee: 'د. أسامة',
      members: 'غير مضيف',
      daysLeft: 1,
      priority: 'urgent-not-important' as const
    },
    {
      id: 2,
      title: 'كتابة الكود',
      description: 'تطوير موقع سوبرا',
      status: 'وفق الخطة',
      statusColor: '#A1E8B8',
      date: '29 May',
      assignee: 'د. أسامة',
      members: 'عضو',
      daysLeft: 2,
      priority: 'urgent-important' as const
    },
    {
      id: 3,
      title: 'تطوير قواعد البيانات',
      description: 'تطوير موقع سوبرا',
      status: 'وفق الخطة',
      statusColor: '#A1E8B8',
      date: '01 Jun',
      assignee: 'د. أسامة',
      members: 'عضوين',
      daysLeft: 5,
      priority: 'not-urgent-important' as const
    },
    {
      id: 4,
      title: 'التسليم',
      description: 'تسليم الموقع النهائي',
      status: 'وفق الخطة',
      statusColor: '#A1E8B8',
      date: '05 Jun',
      assignee: 'د. أسامة',
      members: 'غير مضيف',
      daysLeft: 10,
      priority: 'not-urgent-not-important' as const
    }
  ];

  const displayTasks = tasks.length > 0 ? tasks : defaultTasks;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-4 pr-2 py-0 my-[30px]">
        {displayTasks.map(task => (
          <TaskCard key={task.id} {...task} />
        ))}
      </div>
    </div>
  );
};
