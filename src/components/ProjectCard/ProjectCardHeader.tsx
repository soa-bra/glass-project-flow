
import React from 'react';
import ProjectCardTitle from './ProjectCardTitle';
import ProjectCardDaysCircle from './ProjectCardDaysCircle';
import ProjectCardTasksCircle from './ProjectCardTasksCircle';
import { CardDropdownMenu } from '@/components/ui/CardDropdownMenu';

interface ProjectCardHeaderProps {
  daysLeft: number;
  title: string;
  description: string;
  tasksCount: number;
  status: string;
  onSelect?: () => void;
  onEdit?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
}

const ProjectCardHeader: React.FC<ProjectCardHeaderProps> = ({
  daysLeft,
  title,
  description,
  tasksCount,
  status,
  onSelect = () => {},
  onEdit = () => {},
  onArchive = () => {},
  onDelete = () => {}
}) => {
  return (
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3 flex-1">
        <ProjectCardDaysCircle daysLeft={daysLeft} />
        <ProjectCardTitle title={title} description={description} />
        <ProjectCardTasksCircle tasksCount={tasksCount} status={status} />
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

export default ProjectCardHeader;
