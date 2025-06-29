
import React, { createContext, useContext, ReactNode } from 'react';
import { useProjectTasks } from '@/hooks/useProjectTasks';
import type { TaskData } from '@/types';

interface ProjectTasksContextType {
  addTasksToProject: (projectId: string, tasks: TaskData[]) => void;
  addTaskToProject: (projectId: string, task: TaskData) => void;
  updateTaskInProject: (projectId: string, updatedTask: TaskData) => void;
  removeTaskFromProject: (projectId: string, taskId: number) => void;
  getProjectTasks: (projectId: string) => TaskData[];
  projectTasks: Record<string, TaskData[]>;
}

const ProjectTasksContext = createContext<ProjectTasksContextType | undefined>(undefined);

export const ProjectTasksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const projectTasksHook = useProjectTasks();

  return (
    <ProjectTasksContext.Provider value={projectTasksHook}>
      {children}
    </ProjectTasksContext.Provider>
  );
};

export const useProjectTasksContext = () => {
  const context = useContext(ProjectTasksContext);
  if (!context) {
    throw new Error('useProjectTasksContext must be used within a ProjectTasksProvider');
  }
  return context;
};
