
import React from 'react';
import TaskCardLayout from './TaskCard/TaskCardLayout';
import TaskCardHeader from './TaskCard/TaskCardHeader';
import TaskCardFooter from './TaskCard/TaskCardFooter';
import type { TaskCardProps } from './TaskCard/types';

interface ExtendedTaskCardProps extends TaskCardProps {
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
  onSelect,
  onEdit,
  onArchive,
  onDelete
}) => {
  return (
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
        onSelect={onSelect}
        onEdit={onEdit}
        onArchive={onArchive}
        onDelete={onDelete}
      />
    </TaskCardLayout>
  );
};

export default TaskCard;
