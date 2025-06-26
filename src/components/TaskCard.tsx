
import React from 'react';
import TaskCardLayout from './TaskCard/TaskCardLayout';
import TaskCardHeader from './TaskCard/TaskCardHeader';
import TaskCardFooter from './TaskCard/TaskCardFooter';
import type { TaskCardProps } from './TaskCard/types';

interface ExtendedTaskCardProps extends TaskCardProps {
  isSelected?: boolean;
  isSelectionMode?: boolean;
  onSelect?: (taskId: string) => void;
  onEdit?: (taskId: string) => void;
  onArchive?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
}

const TaskCard: React.FC<ExtendedTaskCardProps> = ({
  id,
  title,
  description,
  status,
  statusColor,
  date,
  assignee,
  members,
  daysLeft,
  priority,
  isSelected = false,
  isSelectionMode = false,
  onSelect,
  onEdit,
  onArchive,
  onDelete
}) => {
  const handleCardClick = (e: React.MouseEvent) => {
    // منع انتشار الحدث إذا كان النقر على القائمة المنسدلة
    if ((e.target as HTMLElement).closest('[data-dropdown-trigger]') || 
        (e.target as HTMLElement).closest('[data-radix-popper-content-wrapper]')) {
      return;
    }

    if (isSelectionMode && onSelect) {
      onSelect(id.toString());
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      style={{ cursor: isSelectionMode ? 'pointer' : 'default' }}
    >
      <TaskCardLayout id={id.toString()}>
        <TaskCardHeader
          daysLeft={daysLeft}
          title={title}
          description={description}
          priority={priority}
        />
        
        <TaskCardFooter
          status={status}
          statusColor={statusColor}
          date={date}
          assignee={assignee}
          members={members}
          taskId={id.toString()}
          isSelected={isSelected}
          isSelectionMode={isSelectionMode}
          onSelect={onSelect}
          onEdit={onEdit}
          onArchive={onArchive}
          onDelete={onDelete}
        />
      </TaskCardLayout>
    </div>
  );
};

export default TaskCard;
