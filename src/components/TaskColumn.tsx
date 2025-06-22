
import React, { useState } from 'react';
import { HiPlus, HiStar, HiArrowLeft } from 'react-icons/hi';
import { ScrollArea } from '@/components/ui/scroll-area';
import TaskCard from './TaskCard';
import { AddTaskModal } from './ProjectsColumn/AddTaskModal';
import type { TaskData } from '@/types';

const tasks: TaskData[] = [
  {
    id: 1,
    title: 'تصميم الواجهة',
    description: 'تطوير موقع سوبرا',
    dueDate: '28 May',
    assignee: 'د. أسامة',
    priority: 'medium',
    stage: 'development',
    attachments: [],
  },
  {
    id: 2,
    title: 'كتابة الكود',
    description: 'تطوير موقع سوبرا',
    dueDate: '29 May',
    assignee: 'د. أسامة',
    priority: 'high',
    stage: 'planning',
    attachments: [],
  },
];

const TaskColumn: React.FC = () => {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [taskList, setTaskList] = useState<TaskData[]>(tasks);

  const handleTaskAdded = (newTask: TaskData) => {
    setTaskList(prev => [...prev, newTask]);
  };

  return (
    <>
      <div
        className="w-full h-full flex flex-col overflow-hidden rounded-t-3xl mx-0"
        style={{
          background: 'var(--backgrounds-project-column-bg)',
        }}
      >
        {/* رأس العمود */}
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

        {/* منطقة التمرير لبطاقات المهام */}
        <div className="flex-1 overflow-hidden rounded-t-3xl">
          <ScrollArea className="h-full w-full">
            <div className="space-y-4 pb-4 px-0 rounded-full mx-[10px]">
              {taskList.map(task => (
                <TaskCard key={task.id} {...task} />
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      <AddTaskModal 
        isOpen={showAddTaskModal} 
        onClose={() => setShowAddTaskModal(false)}
        onTaskAdded={handleTaskAdded}
      />
    </>
  );
};

export default TaskColumn;
