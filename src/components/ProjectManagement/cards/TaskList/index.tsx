
import React from 'react';
import { Project } from '@/types/project';
import { TaskListContainer } from './TaskListContainer';
import { TaskListHeader } from './TaskListHeader';
import { TaskListContent } from './TaskListContent';

interface TaskListCardProps {
  project: Project;
}

export const TaskListCard: React.FC<TaskListCardProps> = ({ project }) => {
  return (
    <TaskListContainer>
      <TaskListHeader />
      <TaskListContent />
    </TaskListContainer>
  );
};
