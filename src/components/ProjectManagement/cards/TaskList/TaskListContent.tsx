import React, { useImperativeHandle } from 'react';
import type { TaskData } from '@/types';
import TaskCard from '@/components/TaskCard';
import { useUnifiedTasks } from '@/hooks/useUnifiedTasks';
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
    console.log('تعديل المهمة:', taskId);
    // سيتم تنفيذ modal التعديل لاحقاً
  };

  const handleTaskUpdated = (updatedTask: TaskData) => {
    console.log('تحديث المهمة:', updatedTask);
    const unifiedTask = mapFromTaskData(updatedTask);
    unifiedTasks.updateTask(updatedTask.id.toString(), unifiedTask);
  };

  const handleTaskArchive = (taskId: string) => {
    unifiedTasks.removeTask(taskId);
    console.log('تم أرشفة المهمة:', taskId);
  };

  const handleTaskDelete = (taskId: string) => {
    unifiedTasks.removeTask(taskId);
    console.log('تم حذف المهمة:', taskId);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-4 pr-1 py-0 my-0">
        {allTasks.map(task => (
          <div key={task.id}>
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