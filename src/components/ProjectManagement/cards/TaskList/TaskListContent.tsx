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
          <div key={`task-${task.id}-${index}`} className="group relative">
            <TaskCard 
              {...task} 
              onEdit={handleTaskEdit} 
              onArchive={handleTaskArchive} 
              onDelete={handleTaskDelete} 
              onTaskUpdated={handleTaskUpdated}
            />
            {/* أيقونات التعديل والحذف */}
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
              <button
                onClick={() => handleTaskEdit(task.id.toString())}
                className="w-8 h-8 bg-black/70 hover:bg-black rounded-full flex items-center justify-center text-white transition-colors"
                title="تعديل المهمة"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                  <path d="m15 5 4 4"/>
                </svg>
              </button>
              <button
                onClick={() => handleTaskDelete(task.id.toString())}
                className="w-8 h-8 bg-red-500/70 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-colors"
                title="حذف المهمة"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"/>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});