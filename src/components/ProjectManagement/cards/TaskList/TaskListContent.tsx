import React, { useImperativeHandle, useEffect, useMemo } from 'react';
import type { TaskData } from '@/types';
import TaskCard from '@/components/TaskCard';
import { useUnifiedTasks } from '@/hooks/useUnifiedTasks';
import { useProjectTasksContext } from '@/contexts/ProjectTasksContext';
import { mapToTaskCardProps, mapFromTaskData } from '@/types/task';
import { TaskFilterOptions } from './TasksFilterDialog';

export interface TaskListContentRef {
  addTask: (task: TaskData) => void;
  addTasks: (tasks: TaskData[]) => void;
}

interface TaskListContentProps {
  projectId?: string;
  filters?: TaskFilterOptions;
  sortConfig?: { field: string; direction: 'asc' | 'desc' } | null;
}

export const TaskListContent = React.forwardRef<TaskListContentRef, TaskListContentProps>(({ projectId, filters, sortConfig }, ref) => {
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

  // الحصول على المهام مع تطبيق الفلترة والترتيب
  const allTasks = useMemo(() => {
    const tasks = unifiedTasks.getProjectTasks(filters, sortConfig);
    return tasks.map(mapToTaskCardProps);
  }, [unifiedTasks, filters, sortConfig]);

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
    const confirmed = window.confirm('هل أنت متأكد من أرشفة هذه المهمة؟ يمكن استعادتها لاحقاً.');
    if (confirmed) {
      unifiedTasks.updateTask(taskId, { status: 'archived' as any });
      // Task archived successfully - يمكن إضافة toast notification هنا
    }
  };

  const handleTaskDelete = (taskId: string) => {
    const confirmed = window.confirm('هل أنت متأكد من حذف هذه المهمة نهائياً؟ لا يمكن التراجع عن هذا الإجراء.');
    if (confirmed) {
      unifiedTasks.removeTask(taskId);
      // Task deleted permanently - يمكن إضافة toast notification هنا
    }
  };

  return (
    <div 
      role="list" 
      className="flex-1 min-h-0 overflow-y-auto scroll-smooth"
      style={{
        paddingBottom: `max(20px, env(safe-area-inset-bottom, 0px))`,
        scrollBehavior: 'smooth',
        scrollPaddingBottom: '20px'
      }}
    >
      <div className="space-y-4 px-2 pb-4">
        {allTasks.length > 0 ? (
          allTasks.map((task) => (
            <TaskCard 
              key={`task-${task.id}`}
              {...task} 
              onEdit={handleTaskEdit} 
              onArchive={handleTaskArchive} 
              onDelete={handleTaskDelete} 
              onTaskUpdated={handleTaskUpdated}
            />
          ))
        ) : (
          <div className="flex items-center justify-center py-12 text-center">
            <div className="text-gray-500">
              <p className="text-lg mb-2">لا توجد مهام تطابق المعايير المحددة</p>
              <p className="text-sm">جرب تعديل الفلاتر أو إضافة مهام جديدة</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});