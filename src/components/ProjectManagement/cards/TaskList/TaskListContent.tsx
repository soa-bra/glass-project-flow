import React, { useImperativeHandle, useEffect, useMemo, useCallback } from 'react';
import type { TaskData } from '@/types';
import TaskCard from '@/components/TaskCard';
import { useUnifiedTasks } from '@/hooks/useUnifiedTasks';
import { useProjectTasksContext } from '@/contexts/ProjectTasksContext';
import { mapToTaskCardProps, mapFromTaskData } from '@/types/task';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TaskFilterOptions } from './TasksFilterDialog';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

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

  const addTask = useCallback((task: TaskData) => {
    const unifiedTask = mapFromTaskData(task);
    unifiedTasks.addTask(unifiedTask);
  }, [unifiedTasks]);

  const addTasks = useCallback((newTasks: TaskData[]) => {
    newTasks.forEach(task => {
      const unifiedTask = mapFromTaskData(task);
      unifiedTasks.addTask(unifiedTask);
    });
  }, [unifiedTasks]);

  useImperativeHandle(ref, () => ({ addTask, addTasks }));

  const handleTaskEdit = useCallback((taskId: string) => {
    // Edit task functionality
    // سيتم تنفيذ modal التعديل لاحقاً
  }, []);

  const handleTaskUpdated = useCallback((updatedTask: TaskData) => {
    // Task updated successfully
    const unifiedTask = mapFromTaskData(updatedTask);
    unifiedTasks.updateTask(updatedTask.id.toString(), unifiedTask);
  }, [unifiedTasks]);

  const handleTaskArchive = useCallback((taskId: string) => {
    unifiedTasks.removeTask(taskId);
    // Task archived successfully
  }, [unifiedTasks]);

  const handleTaskDelete = useCallback((taskId: string) => {
    unifiedTasks.removeTask(taskId);
    // Task deleted successfully
  }, [unifiedTasks]);

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    // إعادة ترتيب المهام
    const reorderedTasks = [...allTasks];
    const [movedTask] = reorderedTasks.splice(sourceIndex, 1);
    reorderedTasks.splice(destinationIndex, 0, movedTask);

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
  }, [allTasks, unifiedTasks]);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <ScrollArea className="flex-1 h-full">
        <Droppable droppableId="task-list" direction="vertical">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`space-y-4 pr-1 py-0 my-0 min-h-[200px] transition-colors duration-200 ${
                snapshot.isDraggingOver ? 'bg-accent/20 rounded-lg' : ''
              }`}
            >
              {allTasks.length > 0 ? (
                <>
                  {allTasks.map((task, index) => (
                    <Draggable 
                      key={`task-${task.id}`} 
                      draggableId={`task-${task.id}`} 
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`transition-all duration-200 ${
                            snapshot.isDragging 
                              ? 'rotate-2 shadow-2xl ring-2 ring-primary/20 bg-card/95 backdrop-blur-sm' 
                              : 'hover:shadow-md'
                          } ${
                            snapshot.isDragging ? 'z-50' : ''
                          }`}
                          style={{
                            ...provided.draggableProps.style,
                            cursor: snapshot.isDragging ? 'grabbing' : 'grab',
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
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </>
              ) : (
                <div className="flex items-center justify-center py-12 text-center">
                  <div className="text-muted-foreground">
                    <p className="text-lg mb-2">لا توجد مهام تطابق المعايير المحددة</p>
                    <p className="text-sm">جرب تعديل الفلاتر أو إضافة مهام جديدة</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </Droppable>
      </ScrollArea>
    </DragDropContext>
  );
});