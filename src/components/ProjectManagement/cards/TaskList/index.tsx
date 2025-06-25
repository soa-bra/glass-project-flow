
import React, { useState } from 'react';
import { Project } from '@/types/project';
import { TaskListContainer } from './TaskListContainer';
import { TaskListHeader } from './TaskListHeader';
import { TaskListContent } from './TaskListContent';

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

interface TaskListCardProps {
  project: Project;
}

export const TaskListCard: React.FC<TaskListCardProps> = ({ project }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleTasksChange = (newTasks: Task[]) => {
    setTasks(newTasks);
  };

  return (
    <TaskListContainer tasks={tasks} onTasksChange={handleTasksChange}>
      <TaskListHeader />
      <TaskListContent />
    </TaskListContainer>
  );
};
