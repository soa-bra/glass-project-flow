
import React from 'react';
import TaskCardTitle from './TaskCardTitle';
import TaskCardDaysCircle from './TaskCardDaysCircle';
import TaskCardPriorityCircle from './TaskCardPriorityCircle';
import { CardDropdownMenu } from '@/components/ui/CardDropdownMenu';
import type { Priority } from './types';

interface TaskCardHeaderProps {
  daysLeft: number;
  title: string;
  description: string;
  priority: Priority;
  onSelect?: () => void;
  onEdit?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
}

const TaskCardHeader: React.FC<TaskCardHeaderProps> = ({
  daysLeft,
  title,
  description,
  priority,
  onSelect = () => {},
  onEdit = () => {},
  onArchive = () => {},
  onDelete = () => {}
}) => {
  return (
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3 flex-1">
        <TaskCardDaysCircle daysLeft={daysLeft} />
        <TaskCardTitle title={title} description={description} />
        <TaskCardPriorityCircle priority={priority} />
      </div>
      <div className="flex-shrink-0 ml-2">
        <CardDropdownMenu
          onSelect={onSelect}
          onEdit={onEdit}
          onArchive={onArchive}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};

export default TaskCardHeader;
