
import { useState, useEffect } from 'react';
import type { TaskData } from '@/types';

export const useProjectTasks = (projectId?: string) => {
  const [projectTasks, setProjectTasks] = useState<Record<string, TaskData[]>>({});

  const addTasksToProject = (projectId: string, tasks: TaskData[]) => {
    setProjectTasks(prev => ({
      ...prev,
      [projectId]: [...(prev[projectId] || []), ...tasks]
    }));
  };

  const addTaskToProject = (projectId: string, task: TaskData) => {
    setProjectTasks(prev => ({
      ...prev,
      [projectId]: [...(prev[projectId] || []), task]
    }));
  };

  const updateTaskInProject = (projectId: string, updatedTask: TaskData) => {
    setProjectTasks(prev => ({
      ...prev,
      [projectId]: (prev[projectId] || []).map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    }));
  };

  const removeTaskFromProject = (projectId: string, taskId: number) => {
    setProjectTasks(prev => ({
      ...prev,
      [projectId]: (prev[projectId] || []).filter(task => task.id !== taskId)
    }));
  };

  const getProjectTasks = (projectId: string): TaskData[] => {
    return projectTasks[projectId] || [];
  };

  return {
    addTasksToProject,
    addTaskToProject,
    updateTaskInProject,
    removeTaskFromProject,
    getProjectTasks,
    projectTasks
  };
};
