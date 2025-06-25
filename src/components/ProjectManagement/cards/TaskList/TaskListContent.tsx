import React from 'react';
import TaskCard from '@/components/TaskCard';
import { Task } from '@/hooks/useTaskManagement';
interface TaskListContentProps {
  tasks: Task[];
}
export const TaskListContent: React.FC<TaskListContentProps> = ({
  tasks
}) => {
  return <div className="flex-1 overflow-y-auto ">
      <div className="space-y-1 pr-0 py-0 my-[5px]">
        {tasks.map(task => <TaskCard key={task.id} {...task} />)}
      </div>
    </div>;
};