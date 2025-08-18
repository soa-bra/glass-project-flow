import React, { useImperativeHandle, useEffect, useMemo, useState } from 'react';
import type { TaskData } from '@/types';
import TaskCard from '@/components/TaskCard';
import { useUnifiedTasks } from '@/hooks/useUnifiedTasks';
import { useProjectTasksContext } from '@/contexts/ProjectTasksContext';
import { mapToTaskCardProps, mapFromTaskData } from '@/types/task';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  const [draggedTask, setDraggedTask] = useState<any | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

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
    unifiedTasks.removeTask(taskId);
    // Task archived successfully
  };

  
  const handleDragStart = (e: React.DragEvent, task: any, index: number) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
    
    // إضافة كلاس للعنصر المسحوب
    (e.target as HTMLElement).style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).style.opacity = '1';
    setDraggedTask(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    
    if (!draggedTask) return;
    
    const dragIndex = allTasks.findIndex(task => task.id === draggedTask.id);
    if (dragIndex === dropIndex) return;
    
    // إعادة ترتيب المهام
    const reorderedTasks = [...allTasks];
    const [movedTask] = reorderedTasks.splice(dragIndex, 1);
    reorderedTasks.splice(dropIndex, 0, movedTask);
    
    // تحديث ترتيب المهام في النظام
    reorderedTasks.forEach((task, newIndex) => {
      // إنشاء TaskData مناسب للتحويل
      const taskData: TaskData = {
        id: typeof task.id === 'string' ? parseInt(task.id) : task.id,
        title: task.title,
        description: task.description,
        dueDate: task.date,
        assignee: task.assignee,
        priority: task.priority,
        stage: 'planning',
        attachments: [],
        createdAt: new Date().toISOString()
      };
      
      const unifiedTask = mapFromTaskData(taskData);
      unifiedTasks.updateTask(task.id.toString(), unifiedTask);
    });
  };

  const handleTaskDelete = (taskId: string) => {
    unifiedTasks.removeTask(taskId);
    // Task deleted successfully
  };

  return (
    <ScrollArea className="flex-1 h-full">
      <div className="space-y-4 pr-1 py-0 my-0 min-h-[200px]">
        {allTasks.length > 0 ? (
          allTasks.map((task, index) => (
            <div 
              key={`task-${task.id}-${index}`}
              draggable
              onDragStart={(e) => handleDragStart(e, task, index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              className={`transition-all duration-200 ${
                dragOverIndex === index ? 'transform scale-105 shadow-lg' : ''
              } ${draggedTask?.id === task.id ? 'opacity-50' : ''}`}
              style={{
                cursor: 'grab',
                userSelect: 'none'
              }}
            >
              <TaskCard 
                {...task} 
                onEdit={handleTaskEdit} 
                onArchive={handleTaskArchive} 
                onDelete={handleTaskDelete} 
                onTaskUpdated={handleTaskUpdated}
              />
            </div>
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
    </ScrollArea>
  );
});