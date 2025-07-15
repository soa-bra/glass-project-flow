import React, { useState } from 'react';
import TaskCard from '@/components/TaskCard';
import { AddTaskButton } from './AddTaskButton';
import { BulkActionsBar } from './BulkActionsBar';
import { useUnifiedTasks } from '@/hooks/useUnifiedTasks';
import { UnifiedTask, TaskFilters, mapToTaskCardProps } from '@/types/task';
import TaskCardKanbanLayout from '@/components/TaskCard/TaskCardKanbanLayout';
import TaskCardKanbanHeader from '@/components/TaskCard/TaskCardKanbanHeader';
import TaskCardFooterSimple from '@/components/TaskCard/TaskCardFooterSimple';

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

interface KanbanTaskCardProps {
  task: UnifiedTask;
  isSelected: boolean;
  isSelectionMode: boolean;
  isOtherSelected: boolean;
  onSelect: () => void;
  onDragStart: () => void;
}

const KanbanTaskCard: React.FC<KanbanTaskCardProps> = ({
  task,
  isSelected,
  isSelectionMode,
  isOtherSelected,
  onSelect,
  onDragStart
}) => {
  const dueDate = new Date(task.dueDate);
  const daysLeft = Math.max(Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)), 0);
  
  const statusColorMap = {
    completed: '#bdeed3',
    'in-progress': '#a4e2f6',
    todo: '#dfecf2',
    stopped: '#f1b5b9',
    treating: '#d9d2fd',
    late: '#fbe2aa'
  };
  
  const statusTextMap = {
    completed: 'مكتملة',
    'in-progress': 'قيد التنفيذ',
    todo: 'لم تبدأ',
    stopped: 'متوقفة',
    treating: 'تحت المعالجة',
    late: 'متأخرة'
  };

  const priorityMap = {
    urgent: 'urgent-important',
    high: 'urgent-not-important', 
    medium: 'not-urgent-important',
    low: 'not-urgent-not-important'
  } as const;

  return (
    <div 
      draggable
      onDragStart={onDragStart}
      onClick={onSelect}
      style={{ cursor: 'pointer' }}
    >
      <TaskCardKanbanLayout 
        id={task.id.toString()}
        isSelected={isSelected}
        isSelectionMode={isSelectionMode}
        isOtherSelected={isOtherSelected}
      >
        <TaskCardKanbanHeader
          daysLeft={daysLeft}
          title={task.title}
          description={task.description || 'لا يوجد وصف'}
          priority={priorityMap[task.priority] || 'not-urgent-not-important'}
        />
        
        <TaskCardFooterSimple
          status={statusTextMap[task.status]}
          statusColor={statusColorMap[task.status]}
          date={daysLeft === 0 ? 'اليوم' : `${daysLeft} يوم`}
          assignee={task.assignee}
          members={task.comments > 0 ? `💬 ${task.comments}` : 'لا توجد تعليقات'}
          isSelected={isSelected}
        />
      </TaskCardKanbanLayout>
    </div>
  );
};

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
                  return (
                    <KanbanTaskCard
                      key={task.id}
                      task={task}
                      isSelected={selectedTasks.includes(task.id)}
                      isSelectionMode={selectedTasks.length > 0}
                      isOtherSelected={selectedTasks.length > 0 && !selectedTasks.includes(task.id)}
                      onSelect={() => handleTaskSelect(task.id)}
                      onDragStart={() => handleDragStart(task, column.status)}
                    />
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