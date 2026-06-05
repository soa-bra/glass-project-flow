import { useState, useEffect } from 'react';
import { UnifiedTask, TaskFilters, mapFromTaskData } from '@/types/task';

// تم إفراغ البيانات الوهمية — تأتي المهام من الباك إند فقط (Supabase / ProjectTasksContext)
const generateMockTasks = (_projectId: string): UnifiedTask[] => [];

// Helper function to sort tasks
const sortTasks = (tasks: UnifiedTask[], sortField: string, sortDirection: 'asc' | 'desc'): UnifiedTask[] => {
  return [...tasks].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortField) {
      case 'title':
        aValue = a.title;
        bValue = b.title;
        break;
      case 'priority':
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
        bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
        break;
      case 'stage':
        const statusOrder = { completed: 6, 'in-progress': 5, treating: 4, todo: 3, late: 2, stopped: 1 };
        aValue = statusOrder[a.status as keyof typeof statusOrder] || 0;
        bValue = statusOrder[b.status as keyof typeof statusOrder] || 0;
        break;
      case 'dueDate':
        aValue = new Date(a.dueDate).getTime();
        bValue = new Date(b.dueDate).getTime();
        break;
      case 'assignee':
        aValue = a.assignee;
        bValue = b.assignee;
        break;
      case 'attachments':
        aValue = a.attachments || 0;
        bValue = b.attachments || 0;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
};

export const useUnifiedTasks = (projectId: string) => {
  const [allTasks, setAllTasks] = useState<Record<string, UnifiedTask[]>>({});
  
  useEffect(() => {
    if (projectId && !allTasks[projectId]) {
      setAllTasks(prev => ({
        ...prev,
        [projectId]: generateMockTasks(projectId)
      }));
    }
  }, [projectId, allTasks]);

  // دالة لدمج المهام من ProjectTasksContext
  const mergeTasks = (additionalTasks: any[]) => {
    if (!additionalTasks || additionalTasks.length === 0) return;
    
    const convertedTasks = additionalTasks.map(task => mapFromTaskData(task));
    
    setAllTasks(prev => {
      const existingTasks = prev[projectId] || [];
      const newTasks = convertedTasks.filter(newTask => 
        !existingTasks.some(existing => existing.id === newTask.id)
      );
      
      return {
        ...prev,
        [projectId]: [...existingTasks, ...newTasks]
      };
    });
  };

  const getProjectTasks = (filters?: TaskFilters, sortConfig?: { field: string; direction: 'asc' | 'desc' }): UnifiedTask[] => {
    let tasks = allTasks[projectId] || [];
    
    // Apply filters
    if (filters) {
      tasks = tasks.filter(task => {
        if (filters.assignee && !task.assignee.toLowerCase().includes(filters.assignee.toLowerCase())) {
          return false;
        }
        if (filters.priority && task.priority !== filters.priority) {
          return false;
        }
        if (filters.status) {
          // Map status values to match our data
          const statusMap: { [key: string]: string } = {
            'To-Do': 'todo',
            'In Progress': 'in-progress',
            'Treating': 'treating',
            'Late': 'late',
            'Stopped': 'stopped',
            'Done': 'completed'
          };
          const mappedStatus = statusMap[filters.status] || filters.status;
          if (task.status !== mappedStatus) {
            return false;
          }
        }
        if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) {
          return false;
        }
        return true;
      });
    }

    // Apply sorting
    if (sortConfig) {
      tasks = sortTasks(tasks, sortConfig.field, sortConfig.direction);
    }

    return tasks;
  };

  const getTasksByStatus = (status: UnifiedTask['status'], filters?: TaskFilters): UnifiedTask[] => {
    return getProjectTasks(filters).filter(task => task.status === status);
  };

  const addTask = (task: Omit<UnifiedTask, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>) => {
    const newTask: UnifiedTask = {
      ...task,
      id: `${projectId}-${Date.now()}`,
      projectId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setAllTasks(prev => ({
      ...prev,
      [projectId]: [...(prev[projectId] || []), newTask]
    }));

    return newTask;
  };

  const updateTask = (taskId: string, updates: Partial<UnifiedTask>) => {
    setAllTasks(prev => ({
      ...prev,
      [projectId]: (prev[projectId] || []).map(task =>
        task.id === taskId
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      )
    }));
  };

  const updateTaskStatus = (taskId: string, status: UnifiedTask['status']) => {
    updateTask(taskId, { 
      status, 
      progress: status === 'completed' ? 100 : status === 'in-progress' ? 50 : 0 
    });
  };

  const removeTask = (taskId: string) => {
    setAllTasks(prev => ({
      ...prev,
      [projectId]: (prev[projectId] || []).filter(task => task.id !== taskId)
    }));
  };

  return {
    tasks: getProjectTasks(),
    getProjectTasks,
    getTasksByStatus,
    addTask,
    updateTask,
    updateTaskStatus,
    removeTask,
    mergeTasks,
    sortTasks: (sortConfig: { field: string; direction: 'asc' | 'desc' }) => sortTasks(allTasks[projectId] || [], sortConfig.field, sortConfig.direction)
  };
};