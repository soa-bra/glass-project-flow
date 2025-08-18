
import React, { useRef, useState, useMemo } from 'react';
import { Project } from '@/types/project';
import { TaskListContainer } from './TaskListContainer';
import { TaskListHeader } from './TaskListHeader';
import { TaskListContent, TaskListContentRef } from './TaskListContent';
import { TaskFilterOptions } from './TasksFilterDialog';
import type { TaskData } from '@/types';

interface TaskListCardProps {
  project: Project;
}

export const TaskListCard: React.FC<TaskListCardProps> = ({ project }) => {
  const contentRef = useRef<TaskListContentRef>(null);
  const [filters, setFilters] = useState<TaskFilterOptions>({});
  const [sortConfig, setSortConfig] = useState<{ field: string; direction: 'asc' | 'desc' } | null>(null);

  const handleTaskAdded = (task: TaskData) => {
    contentRef.current?.addTask(task);
  };

  const handleTasksGenerated = (tasks: TaskData[]) => {
    contentRef.current?.addTasks(tasks);
  };

  const handleFilterChange = (newFilters: TaskFilterOptions) => {
    setFilters(newFilters);
  };

  const handleSortChange = (field: string, direction: 'asc' | 'desc') => {
    setSortConfig({ field, direction });
  };

  const header = (
    <TaskListHeader 
      onTaskAdded={handleTaskAdded} 
      onTasksGenerated={handleTasksGenerated}
      onFilterChange={handleFilterChange}
      onSortChange={handleSortChange}
    />
  );

  return (
    <TaskListContainer header={header}>
      <TaskListContent 
        ref={contentRef} 
        projectId={project.id}
        filters={filters}
        sortConfig={sortConfig}
      />
    </TaskListContainer>
  );
};
