import React, { useImperativeHandle, useEffect, useMemo, useRef, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import type { TaskData } from '@/types';
import TaskCard from '@/components/TaskCard';
import { useUnifiedTasks } from '@/hooks/useUnifiedTasks';
import { useProjectTasksContext } from '@/contexts/ProjectTasksContext';
import { mapToTaskCardProps, mapFromTaskData } from '@/types/task';
import { useAutoScroll } from '@/hooks/dnd/useAutoScroll';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [pointerY, setPointerY] = useState(0);
  const unifiedTasks = useUnifiedTasks(projectId || 'default');
  const projectTasksContext = useProjectTasksContext();

  useAutoScroll({ container: containerRef, active: dragging, pointerY });

  // نلتقط موضع المؤشر عالميًا أثناء السحب (يدعم ماوس ولمس)
  useEffect(() => {
    if (!dragging) return;
    const onMove = (ev: PointerEvent) => setPointerY(ev.clientY);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [dragging]);

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

  const handleTaskDelete = (taskId: string) => {
    unifiedTasks.removeTask(taskId);
    // Task deleted successfully
  };

  const handleDragStart = () => {
    setDragging(true);
    // حبس سكرول الصفحة أثناء السحب (اختياري)
    document.documentElement.style.overscrollBehaviorY = "contain";
  };

  const handleDragEnd = (result: DropResult) => {
    setDragging(false);
    document.documentElement.style.overscrollBehaviorY = "";
    
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    if (sourceIndex === destinationIndex) return;
    
    // إعادة ترتيب المهام
    unifiedTasks.reorderTasks(sourceIndex, destinationIndex);
  };

  return (
    <div 
      ref={containerRef} 
      role="list" 
      className={`flex-1 h-full overflow-y-auto overscroll-contain ${dragging ? "select-none" : ""}`}
    >
      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <Droppable droppableId="task-list">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4 pr-1 py-0 my-0 min-h-[200px]"
            >
              {allTasks.length > 0 ? (
                allTasks.map((task, index) => (
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
                        style={{
                          ...provided.draggableProps.style,
                          opacity: snapshot.isDragging ? 0.8 : 1,
                          transform: snapshot.isDragging 
                            ? `${provided.draggableProps.style?.transform} scale(1.02)` 
                            : provided.draggableProps.style?.transform,
                          zIndex: snapshot.isDragging ? 30 : 'auto',
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
                ))
              ) : (
                <div className="flex items-center justify-center py-12 text-center">
                  <div className="text-gray-500">
                    <p className="text-lg mb-2">لا توجد مهام تطابق المعايير المحددة</p>
                    <p className="text-sm">جرب تعديل الفلاتر أو إضافة مهام جديدة</p>
                  </div>
                </div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
});