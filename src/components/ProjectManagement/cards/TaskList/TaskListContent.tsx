import React, { useImperativeHandle, useEffect, useMemo, useState, useCallback } from 'react';
import type { TaskData } from '@/types';
import TaskCard from '@/components/TaskCard';
import { useUnifiedTasks } from '@/hooks/useUnifiedTasks';
import { useProjectTasksContext } from '@/contexts/ProjectTasksContext';
import { mapToTaskCardProps, mapFromTaskData } from '@/types/task';

import { TaskFilterOptions } from './TasksFilterDialog';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

export interface TaskListContentRef {
  addTask: (task: TaskData) => void;
  addTasks: (tasks: TaskData[]) => void;
}

interface TaskListContentProps {
  projectId?: string;
  filters?: TaskFilterOptions;
  sortConfig?: { field: string; direction: 'asc' | 'desc' } | null;
}

// Sortable wrapper for each task card
const SortableTaskItem: React.FC<{
  taskProps: any;
  onEdit: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onTaskUpdated: (task: TaskData) => void;
}> = ({ taskProps, onEdit, onArchive, onDelete, onTaskUpdated }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: taskProps.id.toString() });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: 'relative',
  };

  return (
    <div ref={setNodeRef} style={style} className="group/sortable">
      <div
        {...attributes}
        {...listeners}
        className="absolute right-[-4px] top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover/sortable:opacity-60 hover:!opacity-100 cursor-grab active:cursor-grabbing transition-opacity p-1 rounded-md"
        aria-label="اسحب لإعادة الترتيب"
      >
        <GripVertical size={14} className="text-[rgba(11,15,18,0.4)]" />
      </div>
      <TaskCard
        {...taskProps}
        onEdit={onEdit}
        onArchive={onArchive}
        onDelete={onDelete}
        onTaskUpdated={onTaskUpdated}
      />
    </div>
  );
};

export const TaskListContent = React.forwardRef<TaskListContentRef, TaskListContentProps>(({ projectId, filters, sortConfig }, ref) => {
  const unifiedTasks = useUnifiedTasks(projectId || 'default');
  const projectTasksContext = useProjectTasksContext();
  const [localOrder, setLocalOrder] = useState<string[] | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

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

  // Apply local drag order
  const orderedTasks = useMemo(() => {
    if (!localOrder) return allTasks;
    const taskMap = new Map(allTasks.map(t => [t.id.toString(), t]));
    const ordered: typeof allTasks = [];
    for (const id of localOrder) {
      const task = taskMap.get(id);
      if (task) ordered.push(task);
    }
    // Add any tasks not in localOrder (new tasks)
    for (const task of allTasks) {
      if (!localOrder.includes(task.id.toString())) {
        ordered.push(task);
      }
    }
    return ordered;
  }, [allTasks, localOrder]);

  const taskIds = useMemo(() => orderedTasks.map(t => t.id.toString()), [orderedTasks]);

  const addTask = (task: TaskData) => {
    const unifiedTask = mapFromTaskData(task);
    unifiedTasks.addTask(unifiedTask);
    setLocalOrder(null); // Reset order on new task
  };

  const addTasks = (newTasks: TaskData[]) => {
    newTasks.forEach(task => {
      const unifiedTask = mapFromTaskData(task);
      unifiedTasks.addTask(unifiedTask);
    });
    setLocalOrder(null);
  };

  useImperativeHandle(ref, () => ({ addTask, addTasks }));

  const handleTaskEdit = (_taskId: string) => {
    // Edit task functionality
  };

  const handleTaskUpdated = (updatedTask: TaskData) => {
    const unifiedTask = mapFromTaskData(updatedTask);
    unifiedTasks.updateTask(updatedTask.id.toString(), unifiedTask);
  };

  const handleTaskArchive = (taskId: string) => {
    unifiedTasks.removeTask(taskId);
  };

  const handleTaskDelete = (taskId: string) => {
    unifiedTasks.removeTask(taskId);
  };

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = taskIds.indexOf(active.id as string);
    const newIndex = taskIds.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;

    const newOrder = arrayMove(taskIds, oldIndex, newIndex);
    setLocalOrder(newOrder);
  }, [taskIds]);

  const activeTask = activeId ? orderedTasks.find(t => t.id.toString() === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4 pr-1 py-0 my-0 min-h-[200px]">
        {orderedTasks.length > 0 ? (
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            {orderedTasks.map((task) => (
              <SortableTaskItem
                key={`task-${task.id}`}
                taskProps={task}
                onEdit={handleTaskEdit}
                onArchive={handleTaskArchive}
                onDelete={handleTaskDelete}
                onTaskUpdated={handleTaskUpdated}
              />
            ))}
          </SortableContext>
        ) : (
          <div className="flex items-center justify-center py-12 text-center">
            <div className="text-gray-500">
              <p className="text-lg mb-2">لا توجد مهام تطابق المعايير المحددة</p>
              <p className="text-sm">جرب تعديل الفلاتر أو إضافة مهام جديدة</p>
            </div>
          </div>
        )}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="opacity-90 shadow-lg rounded-[18px]">
            <TaskCard
              {...activeTask}
              onEdit={() => {}}
              onArchive={() => {}}
              onDelete={() => {}}
              onTaskUpdated={() => {}}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
});
