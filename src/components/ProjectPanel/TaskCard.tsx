
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskData } from './types';
import { Clock, User, AlertCircle } from 'lucide-react';

interface TaskCardProps {
  task: TaskData;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const statusColors = {
  'pending': '#fbbf24',
  'in-progress': '#3b82f6',
  'completed': '#10b981'
};

const statusLabels = {
  'pending': 'قيد الانتظار',
  'in-progress': 'قيد التنفيذ',
  'completed': 'مكتمل'
};

const priorityColors = {
  'low': '#6b7280',
  'medium': '#f59e0b',
  'high': '#ef4444'
};

const priorityLabels = {
  'low': 'منخفضة',
  'medium': 'متوسطة',
  'high': 'عالية'
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-white/30 backdrop-blur-[15px] rounded-[20px] p-4 border border-white/40 
        hover:bg-white/40 transition-all duration-200 cursor-move
        ${isDragging ? 'shadow-lg scale-105' : ''}
      `}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: priorityColors[task.priority] }}
          ></div>
          <span className="text-xs text-gray-600">
            {priorityLabels[task.priority]}
          </span>
        </div>
        
        <div
          className="px-3 py-1 rounded-full text-xs font-medium text-white"
          style={{ backgroundColor: statusColors[task.status] }}
        >
          {statusLabels[task.status]}
        </div>
      </div>
      
      <h3 className="font-semibold text-gray-800 mb-2 text-right font-arabic">
        {task.title}
      </h3>
      
      <p className="text-sm text-gray-600 mb-3 text-right line-clamp-2">
        {task.description}
      </p>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>{new Date(task.dueDate).toLocaleDateString('ar-SA')}</span>
        </div>
        <div className="flex items-center gap-1">
          <User size={14} />
          <span>{task.assignee}</span>
        </div>
      </div>

      {task.priority === 'high' && (
        <div className="flex items-center gap-1 mt-2 text-red-600">
          <AlertCircle size={14} />
          <span className="text-xs">أولوية عالية</span>
        </div>
      )}
    </div>
  );
};
