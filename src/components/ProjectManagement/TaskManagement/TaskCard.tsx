import React, { useState } from 'react';
import { HoverBalloon } from './HoverBalloon';
import { FloatingCommentIcon } from './FloatingCommentIcon';

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  tags: string[];
  attachments: number;
  comments: number;
  linkedTasks: string[];
}

interface TaskCardProps {
  task: Task;
  isSelected: boolean;
  onSelect: () => void;
  onDragStart: () => void;
}

const priorityColors = {
  low: '#bdeed3',
  medium: '#a4e2f6',
  high: '#fbe2aa',
  urgent: '#f1b5b9'
};

const tagColors = ['#bdeed3', '#a4e2f6', '#d9d2fd', '#f1b5b9', '#fbe2aa'];

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  isSelected, 
  onSelect, 
  onDragStart 
}) => {
  const [showHover, setShowHover] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    onDragStart();
    e.dataTransfer.effectAllowed = 'move';
  };

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `متأخر ${Math.abs(diffDays)} يوم`;
    if (diffDays === 0) return 'اليوم';
    if (diffDays === 1) return 'غداً';
    return `${diffDays} أيام`;
  };

  return (
    <div
      className={`relative bg-transparent border border-black/10 rounded-3xl p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected ? 'ring-2 ring-black' : ''
      }`}
      draggable
      onDragStart={handleDragStart}
      onMouseEnter={() => setShowHover(true)}
      onMouseLeave={() => setShowHover(false)}
      onClick={onSelect}
    >
      {/* Selection Checkbox */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="w-4 h-4 rounded border-black/20 text-black focus:ring-black"
            onClick={(e) => e.stopPropagation()}
          />
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: priorityColors[task.priority] }}
          />
        </div>
        
        {/* Due Date */}
        <div className="text-xs font-normal text-gray-400">
          {formatDueDate(task.dueDate)}
        </div>
      </div>

      {/* Task Title */}
      <h4 className="text-sm font-bold text-black mb-2 line-clamp-2">
        {task.title}
      </h4>

      {/* Task Description */}
      <p className="text-xs font-normal text-gray-400 mb-3 line-clamp-2">
        {task.description}
      </p>

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 2).map((tag, index) => (
            <span
              key={tag}
              className="px-2 py-1 rounded-full text-xs font-normal text-black"
              style={{ backgroundColor: tagColors[index % tagColors.length] }}
            >
              {tag}
            </span>
          ))}
          {task.tags.length > 2 && (
            <span className="px-2 py-1 rounded-full text-xs font-normal text-gray-400 bg-gray-100">
              +{task.tags.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Assignee and Stats */}
      <div className="flex items-center justify-between">
        <div className="text-xs font-normal text-black">
          {task.assignee}
        </div>
        
        <div className="flex items-center gap-2 text-xs font-normal text-gray-400">
          {task.attachments > 0 && (
            <span>📎 {task.attachments}</span>
          )}
          {task.comments > 0 && (
            <span>💬 {task.comments}</span>
          )}
          {task.linkedTasks.length > 0 && (
            <span>🔗 {task.linkedTasks.length}</span>
          )}
        </div>
      </div>

      {/* Hover Balloon */}
      {showHover && (
        <HoverBalloon 
          task={task}
          onClose={() => setShowHover(false)}
        />
      )}

      {/* Floating Comment Icon */}
      <FloatingCommentIcon
        onActivate={() => setShowCommentInput(true)}
        duration={20000}
      />

      {/* Comment Input */}
      {showCommentInput && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white border border-black/10 rounded-3xl shadow-lg z-10">
          <textarea
            placeholder="أضف تعليق..."
            className="w-full p-2 text-sm border border-black/10 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-black"
            rows={3}
            autoFocus
            onBlur={() => setShowCommentInput(false)}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button 
              className="px-3 py-1 text-xs bg-gray-100 rounded-full hover:bg-gray-200"
              onClick={() => setShowCommentInput(false)}
            >
              إلغاء
            </button>
            <button className="px-3 py-1 text-xs bg-black text-white rounded-full hover:bg-black/80">
              إرسال
            </button>
          </div>
        </div>
      )}
    </div>
  );
};