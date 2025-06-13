
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CheckCircle, Circle, GripVertical } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
}

const priorityColors = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800'
};

const priorityLabels = {
  high: 'عالية',
  medium: 'متوسطة',
  low: 'منخفضة'
};

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center gap-3 p-3 bg-white/10 rounded-lg border border-white/20
        hover:bg-white/15 transition-all duration-200 group
        ${task.completed ? 'opacity-60' : ''}
      `}
    >
      {/* أيقونة السحب */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
      >
        <GripVertical size={16} />
      </div>

      {/* checkbox */}
      <button
        onClick={onToggle}
        className="text-gray-600 hover:text-blue-500 transition-colors duration-200"
      >
        {task.completed ? (
          <CheckCircle size={20} className="text-green-500" />
        ) : (
          <Circle size={20} />
        )}
      </button>

      {/* محتوى المهمة */}
      <div className="flex-1 text-right">
        <div className={`font-arabic ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
          {task.title}
        </div>
      </div>

      {/* أولوية المهمة */}
      <div className={`px-2 py-1 rounded-full text-xs font-arabic ${priorityColors[task.priority]}`}>
        {priorityLabels[task.priority]}
      </div>
    </div>
  );
};
