
import React from 'react';
import TaskCardLayout from './TaskCard/TaskCardLayout';
import TaskCardHeader from './TaskCard/TaskCardHeader';
import TaskCardFooter from './TaskCard/TaskCardFooter';
import type { TaskCardProps } from './TaskCard/types';

interface TaskCardWithActionsProps extends TaskCardProps {
  isDimmed?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
}

const TaskCard: React.FC<TaskCardWithActionsProps> = ({
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
  isDimmed = false,
  onSelect = () => {},
  onEdit = () => {},
  onArchive = () => {},
  onDelete = () => {}
}) => {
  return (
    <TaskCardLayout id={id.toString()} isDimmed={isDimmed}>
      <TaskCardHeader
        daysLeft={daysLeft}
        title={title}
        description={description}
        priority={priority}
        onSelect={onSelect}
        onEdit={onEdit}
        onArchive={onArchive}
        onDelete={onDelete}
      />
      
      <TaskCardFooter
        status={status}
        statusColor={statusColor}
        date={date}
        assignee={assignee}
        members={members}
      />
    </TaskCardLayout>
  );
};

export default TaskCard;
