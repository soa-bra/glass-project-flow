
import React from 'react';
import TaskCard from '@/components/TaskCard';
import { Task } from '@/hooks/useTaskManagement';

interface TaskListContentProps {
  tasks: Task[];
}

export const TaskListContent: React.FC<TaskListContentProps> = ({ tasks }) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-4 pr-2 py-0 my-[30px]">
        {tasks.map(task => (
          <TaskCard key={task.id} {...task} />
        ))}
      </div>
    </div>
  );
};
