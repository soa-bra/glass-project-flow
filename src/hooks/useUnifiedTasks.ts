import { useState, useEffect, useCallback } from 'react';
import { UnifiedTask, TaskFilters, mapFromTaskData } from '@/types/task';
import { createTask, deleteTask, listTasksByProject, updateTask as patchTask } from '@/services/central/tasks.service';

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

  const refresh = useCallback(async () => {
    if (!projectId) return;
    const rows = await listTasksByProject(projectId);
    const mapped = rows.map((row) => mapFromTaskData(row));
    setAllTasks((prev) => ({ ...prev, [projectId]: mapped }));
  }, [projectId]);

  useEffect(() => { void refresh(); }, [refresh]);

  const mergeTasks = (additionalTasks: any[]) => {
    if (!additionalTasks?.length) return;
    const convertedTasks = additionalTasks.map((task) => mapFromTaskData(task));
    setAllTasks((prev) => {
      const existingTasks = prev[projectId] || [];
      const newTasks = convertedTasks.filter((newTask) => !existingTasks.some((existing) => existing.id === newTask.id));
      return { ...prev, [projectId]: [...existingTasks, ...newTasks] };
    });
  };

  const getProjectTasks = (filters?: TaskFilters, sortConfig?: { field: string; direction: 'asc' | 'desc' }): UnifiedTask[] => {
    let tasks = allTasks[projectId] || [];
    if (filters) {
      tasks = tasks.filter((task) => {
        if (filters.assignee && !task.assignee.toLowerCase().includes(filters.assignee.toLowerCase())) return false;
        if (filters.priority && task.priority !== filters.priority) return false;
        if (filters.status) {
          const statusMap: { [key: string]: string } = { 'To-Do': 'todo', 'In Progress': 'in-progress', Treating: 'treating', Late: 'late', Stopped: 'stopped', Done: 'completed' };
          if (task.status !== (statusMap[filters.status] || filters.status)) return false;
        }
        if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
        return true;
      });
    }
    if (sortConfig) tasks = sortTasks(tasks, sortConfig.field, sortConfig.direction);
    return tasks;
  };

  const getTasksByStatus = (status: UnifiedTask['status'], filters?: TaskFilters) => getProjectTasks(filters).filter((task) => task.status === status);

  const addTask = async (task: Omit<UnifiedTask, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>) => {
    const created = await createTask({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      linked_project_id: projectId,
      assigned_to: task.assignee,
      due_date: task.dueDate,
    });
    const mapped = mapFromTaskData(created);
    setAllTasks((prev) => ({ ...prev, [projectId]: [mapped, ...(prev[projectId] || [])] }));
    return mapped;
  };

  const updateTask = async (taskId: string, updates: Partial<UnifiedTask>) => {
    await patchTask(taskId, {
      title: updates.title,
      description: updates.description,
      status: updates.status,
      priority: updates.priority,
      assigned_to: updates.assignee,
      due_date: updates.dueDate,
    });
    await refresh();
  };

  const updateTaskStatus = async (taskId: string, status: UnifiedTask['status']) => {
    await updateTask(taskId, { status, progress: status === 'completed' ? 100 : status === 'in-progress' ? 50 : 0 });
  };

  const removeTask = async (taskId: string) => { await deleteTask(taskId); await refresh(); };

  return { tasks: getProjectTasks(), getProjectTasks, getTasksByStatus, addTask, updateTask, updateTaskStatus, removeTask, mergeTasks, refresh, sortTasks: (sortConfig: { field: string; direction: 'asc' | 'desc' }) => sortTasks(allTasks[projectId] || [], sortConfig.field, sortConfig.direction) };
};
