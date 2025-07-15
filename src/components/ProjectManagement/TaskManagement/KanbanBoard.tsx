import React, { useState } from 'react';
import TaskCard from '@/components/TaskCard';
import { AddTaskButton } from './AddTaskButton';
import { BulkActionsBar } from './BulkActionsBar';
import { useUnifiedTasks } from '@/hooks/useUnifiedTasks';
import { UnifiedTask, TaskFilters, mapToTaskCardProps } from '@/types/task';

interface KanbanColumn {
  name: string;
  color: string;
  description: string;
  status: UnifiedTask['status'];
}

interface KanbanBoardProps {
  projectId: string;
  filters: TaskFilters;
}

const columns: KanbanColumn[] = [
  { name: "To-Do", color: "#dfecf2", description: "المهام المجدولة", status: "todo" },
  { name: "Stopped", color: "#f1b5b9", description: "المهام المتوقفة", status: "stopped" },
  { name: "Treating", color: "#d9d2fd", description: "المهام تحت المعالجة", status: "treating" },
  { name: "Late", color: "#fbe2aa", description: "المهام المتأخرة", status: "late" },
  { name: "In Progress", color: "#a4e2f6", description: "المهام الجارية", status: "in-progress" },
  { name: "Done", color: "#bdeed3", description: "المهام المكتملة", status: "completed" }
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId, filters }) => {
  const { getTasksByStatus, updateTaskStatus } = useUnifiedTasks(projectId);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [draggedTask, setDraggedTask] = useState<UnifiedTask | null>(null);
  const [draggedFromStatus, setDraggedFromStatus] = useState<UnifiedTask['status'] | "">("");

  const handleDragStart = (task: UnifiedTask, fromStatus: UnifiedTask['status']) => {
    setDraggedTask(task);
    setDraggedFromStatus(fromStatus);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, toStatus: UnifiedTask['status']) => {
    e.preventDefault();
    if (draggedTask && draggedFromStatus !== toStatus) {
      updateTaskStatus(draggedTask.id, toStatus);
      console.log(`Moving task ${draggedTask.id} from ${draggedFromStatus} to ${toStatus}`);
    }
    setDraggedTask(null);
    setDraggedFromStatus("");
  };

  const handleTaskSelect = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      {selectedTasks.length > 0 && (
        <BulkActionsBar 
          selectedCount={selectedTasks.length}
          onClearSelection={() => setSelectedTasks([])}
        />
      )}

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-6 gap-4 min-h-[600px]">
        {columns.map(column => {
          const columnTasks = getTasksByStatus(column.status, filters);
          
          return (
            <div
              key={column.name}
              className="bg-[#F2FFFF] rounded-3xl border border-black/10 flex flex-col"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.status)}
            >
              {/* Column Header */}
              <div 
                className="p-4 rounded-t-3xl border-b border-black/10"
                style={{ backgroundColor: column.color }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-black">{column.name}</h3>
                  <span className="text-xs font-normal text-gray-400">
                    {columnTasks.length}
                  </span>
                </div>
                <p className="text-xs font-normal text-gray-400">{column.description}</p>
              </div>

              {/* Tasks Container */}
              <div className="flex-1 p-4 space-y-3 min-h-[400px]">
                {columnTasks.map(task => {
                  const taskCardProps = mapToTaskCardProps(task);
                  return (
                    <div 
                      key={task.id}
                      draggable
                      onDragStart={() => handleDragStart(task, column.status)}
                      className="w-full"
                    >
                      <div className="w-full max-w-full">
                        <TaskCard
                          {...taskCardProps}
                          isSelected={selectedTasks.includes(task.id)}
                          isSelectionMode={false}
                          onSelect={() => handleTaskSelect(task.id)}
                        />
                      </div>
                    </div>
                  );
                })}
                
                {/* Add Task Button */}
                <AddTaskButton column={column.name} projectId={projectId} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};