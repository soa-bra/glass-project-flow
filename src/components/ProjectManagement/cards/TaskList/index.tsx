
import React from 'react';
import { Project } from '@/types/project';
import { TaskListContainer } from './TaskListContainer';
import { TaskListHeader } from './TaskListHeader';
import { TaskListContent } from './TaskListContent';
import { useTaskManagement } from '@/hooks/useTaskManagement';

interface TaskListCardProps {
  project: Project;
}

export const TaskListCard: React.FC<TaskListCardProps> = ({ project }) => {
  const { tasks, addTask, addTasks } = useTaskManagement();

  return (
    <TaskListContainer>
      <TaskListHeader onTaskAdded={addTask} onTasksGenerated={addTasks} />
      <TaskListContent tasks={tasks} />
    </TaskListContainer>
  );
};
