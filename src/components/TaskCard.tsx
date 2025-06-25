
import React from 'react';
import TaskCardLayout from './TaskCard/TaskCardLayout';
import TaskCardHeader from './TaskCard/TaskCardHeader';
import TaskCardFooter from './TaskCard/TaskCardFooter';
import type { TaskCardProps } from './TaskCard/types';

const TaskCard: React.FC<TaskCardProps> = ({
  id,
  title,
  description,
  status,
  statusColor,
  date,
  assignee,
  members,
  daysLeft,
  priority
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
      />
    </TaskCardLayout>
  );
};

export default TaskCard;
