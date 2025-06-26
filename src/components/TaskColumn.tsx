
import React, { useState } from 'react';
import { HiPlus, HiStar, HiArrowLeft } from 'react-icons/hi';
import { ScrollArea } from '@/components/ui/scroll-area';
import TaskCard from './TaskCard';
import type { TaskCardProps } from './TaskCard/types';

const tasks: TaskCardProps[] = [
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
    priority: 'urgent-not-important'
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
    daysLeft: 1,
    priority: 'urgent-important'
  },
];

const TaskColumn: React.FC = () => {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden rounded-t-3xl"
      style={{
        background: 'var(--backgrounds-project-column-bg)',
      }}
    >
      <div className="flex-shrink-0 px-4 pt-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">قائمة المهام</h2>
          <div className="flex gap-2 text-gray-600">
            <button onClick={() => setShowAddTaskModal(true)}><HiPlus /></button>
            <button><HiStar /></button>
            <button><HiArrowLeft /></button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden rounded-t-3xl">
        <ScrollArea className="h-full w-full">
          <div className="space-y-2 pb-4 mx-[5px]">
            {tasks.map(task => (
              <TaskCard key={task.id} {...task} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default TaskColumn;
