
import React, { useRef } from 'react';
import { Project } from '@/types/project';
import { TaskListContainer } from './TaskListContainer';
import { TaskListHeader } from './TaskListHeader';
import { TaskListContent, TaskListContentRef } from './TaskListContent';
import type { TaskData } from '@/types';

interface TaskListCardProps {
  project: Project;
}

export const TaskListCard: React.FC<TaskListCardProps> = ({ project }) => {
  const contentRef = useRef<TaskListContentRef>(null);

  const handleTaskAdded = (task: TaskData) => {
    contentRef.current?.addTask(task);
  };

  const handleTasksGenerated = (tasks: TaskData[]) => {
    contentRef.current?.addTasks(tasks);
  };

  return (
    <TaskListContainer>
      <TaskListHeader onTaskAdded={handleTaskAdded} onTasksGenerated={handleTasksGenerated} />
      <TaskListContent ref={contentRef} projectId={project.id} />
    </TaskListContainer>
  );
};
