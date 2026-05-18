import { useState, useEffect, useCallback } from 'react';
import { UnifiedTask, TaskFilters, mapFromTaskData } from '@/types/task';
import { createTask, deleteTask, listTasksByProject, updateTask } from '@/services/central/tasks.service';

const sortTasks = (tasks: UnifiedTask[], sortField: string, sortDirection: 'asc' | 'desc'): UnifiedTask[] => {
  return [...tasks].sort((a, b) => {
    let aValue: any, bValue: any;
    switch (sortField) {
      case 'title': aValue = a.title; bValue = b.title; break;
      case 'priority': {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
        bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
        break;
      }
      case 'stage': {
        const statusOrder = { completed: 6, 'in-progress': 5, treating: 4, todo: 3, late: 2, stopped: 1 };
        aValue = statusOrder[a.status as keyof typeof statusOrder] || 0;
        bValue = statusOrder[b.status as keyof typeof statusOrder] || 0;
        break;
      }
      case 'dueDate': aValue = new Date(a.dueDate).getTime(); bValue = new Date(b.dueDate).getTime(); break;
      case 'assignee': aValue = a.assignee; bValue = b.assignee; break;
      case 'attachments': aValue = a.attachments || 0; bValue = b.attachments || 0; break;
      default: return 0;
    }
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
};

export const useUnifiedTasks = (projectId: string) => {
  const [allTasks, setAllTasks] = useState<Record<string, UnifiedTask[]>>({});

  const loadTasks = useCallback(async () => {
    if (!projectId) return;
    const rows = await listTasksByProject(projectId);
    setAllTasks((prev) => ({ ...prev, [projectId]: rows.map((r) => mapFromTaskData(r as any)) }));
  }, [projectId]);

  useEffect(() => { void loadTasks(); }, [loadTasks]);

  const mergeTasks = (additionalTasks: any[]) => {
    if (!additionalTasks || additionalTasks.length === 0) return;
    const convertedTasks = additionalTasks.map(task => mapFromTaskData(task));
    setAllTasks(prev => {
      const existingTasks = prev[projectId] || [];
      const newTasks = convertedTasks.filter(newTask => !existingTasks.some(existing => existing.id === newTask.id));
      return { ...prev, [projectId]: [...existingTasks, ...newTasks] };
    });
  };

  const getProjectTasks = (filters?: TaskFilters, sortConfig?: { field: string; direction: 'asc' | 'desc' }): UnifiedTask[] => {
    let tasks = allTasks[projectId] || [];
    if (filters) {
      tasks = tasks.filter(task => {
        if (filters.assignee && !task.assignee.toLowerCase().includes(filters.assignee.toLowerCase())) return false;
        if (filters.priority && task.priority !== filters.priority) return false;
        if (filters.status) {
          const statusMap: { [key: string]: string } = { 'To-Do': 'todo', 'In Progress': 'in-progress', 'Treating': 'treating', 'Late': 'late', 'Stopped': 'stopped', 'Done': 'completed' };
          const mappedStatus = statusMap[filters.status] || filters.status;
          if (task.status !== mappedStatus) return false;
        }
        if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
        return true;
      });
    }
    if (sortConfig) tasks = sortTasks(tasks, sortConfig.field, sortConfig.direction);
    return tasks;
  };

  const getTasksByStatus = (status: UnifiedTask['status'], filters?: TaskFilters): UnifiedTask[] => getProjectTasks(filters).filter(task => task.status === status);

  const addTask = async (task: Omit<UnifiedTask, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>) => {
    const created = await createTask({
      linked_project_id: projectId,
      title: task.title,
      description: task.description,
      assignee: task.assignee,
      priority: task.priority,
      status: task.status,
      due_date: task.dueDate,
      progress: task.progress,
    } as any);
    const unified = mapFromTaskData(created as any);
    setAllTasks(prev => ({ ...prev, [projectId]: [...(prev[projectId] || []), unified] }));
    return unified;
  };

  const updateExistingTask = async (taskId: string, updates: Partial<UnifiedTask>) => {
    const updated = await updateTask(taskId, updates as any);
    const unified = mapFromTaskData(updated as any);
    setAllTasks(prev => ({ ...prev, [projectId]: (prev[projectId] || []).map(task => task.id === taskId ? unified : task) }));
  };

  const deleteExistingTask = async (taskId: string) => {
    await deleteTask(taskId);
    setAllTasks(prev => ({ ...prev, [projectId]: (prev[projectId] || []).filter(task => task.id !== taskId) }));
  };

  return { getProjectTasks, getTasksByStatus, addTask, updateTask: updateExistingTask, deleteTask: deleteExistingTask, mergeTasks, reloadTasks: loadTasks };
};
