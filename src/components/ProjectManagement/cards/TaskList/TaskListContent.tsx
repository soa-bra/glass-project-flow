import React, { useImperativeHandle, useEffect } from 'react';
import type { TaskData } from '@/types';
import TaskCard from '@/components/TaskCard';
import { useUnifiedTasks } from '@/hooks/useUnifiedTasks';
import { useProjectTasksContext } from '@/contexts/ProjectTasksContext';
import { mapToTaskCardProps, mapFromTaskData } from '@/types/task';

export interface TaskListContentRef {
  addTask: (task: TaskData) => void;
  addTasks: (tasks: TaskData[]) => void;
}

interface TaskListContentProps {
  projectId?: string;
}

export const TaskListContent = React.forwardRef<TaskListContentRef, TaskListContentProps>(({ projectId }, ref) => {
  const unifiedTasks = useUnifiedTasks(projectId || 'default');
  const projectTasksContext = useProjectTasksContext();

  // دمج المهام من ProjectTasksContext عند التحديث
  useEffect(() => {
    if (projectId) {
      const contextTasks = projectTasksContext.getProjectTasks(projectId);
      if (contextTasks.length > 0) {
        unifiedTasks.mergeTasks(contextTasks);
      }
    }
  }, [projectId, projectTasksContext.projectTasks[projectId || '']]);

  // الحصول على المهام من النظام الموحد
  const allTasks = unifiedTasks.tasks.map(mapToTaskCardProps);

  const addTask = (task: TaskData) => {
    const unifiedTask = mapFromTaskData(task);
    unifiedTasks.addTask(unifiedTask);
  };

  const addTasks = (newTasks: TaskData[]) => {
    newTasks.forEach(task => {
      const unifiedTask = mapFromTaskData(task);
      unifiedTasks.addTask(unifiedTask);
    });
  };

  useImperativeHandle(ref, () => ({ addTask, addTasks }));

  const handleTaskEdit = (taskId: string) => {
    // Edit task functionality
    // سيتم تنفيذ modal التعديل لاحقاً
  };

  const handleTaskUpdated = (updatedTask: TaskData) => {
    // Task updated successfully
    const unifiedTask = mapFromTaskData(updatedTask);
    unifiedTasks.updateTask(updatedTask.id.toString(), unifiedTask);
  };

  const handleTaskArchive = (taskId: string) => {
    unifiedTasks.removeTask(taskId);
    // Task archived successfully
  };

  const handleTaskDelete = (taskId: string) => {
    unifiedTasks.removeTask(taskId);
    // Task deleted successfully
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-4 pr-1 py-0 my-0">
        {allTasks.map((task, index) => (
          <div key={`task-${task.id}-${index}`}>
            <TaskCard 
              {...task} 
              onEdit={handleTaskEdit} 
              onArchive={handleTaskArchive} 
              onDelete={handleTaskDelete} 
              onTaskUpdated={handleTaskUpdated}
            />
          </div>
        ))}
      </div>
    </div>
  );
});