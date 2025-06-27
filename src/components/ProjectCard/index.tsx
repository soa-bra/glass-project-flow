
import React from 'react';
import ProjectCardLayout from './ProjectCardLayout';
import { ProjectCardHeader } from './ProjectCardHeader';
import ProjectCardTitle from './ProjectCardTitle';
import ProjectCardFooter from './ProjectCardFooter';
import ProjectCardStatusIndicators from './ProjectCardStatusIndicators';
import { ProjectCardDropdown } from './ProjectCardDropdown';
import type { ProjectCardProps } from './types';

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  name,
  description,
  owner,
  deadline,
  team,
  status,
  budget,
  tasksCount,
  daysLeft,
  value,
  isSelected = false,
  isOtherSelected = false,
  onProjectSelect,
  onEdit,
  onArchive,
  onDelete,
}) => {
  const handleCardClick = () => {
    if (onProjectSelect) {
      onProjectSelect();
    }
  };

  const handleEdit = (projectId: number) => {
    if (onEdit) {
      onEdit(projectId);
    }
  };

  const handleArchive = (projectId: number) => {
    if (onArchive) {
      onArchive(projectId);
    }
  };

  const handleDelete = (projectId: number) => {
    if (onDelete) {
      onDelete(projectId);
    }
  };

  return (
    <ProjectCardLayout
      id={id.toString()}
      isSelected={isSelected}
      isOtherSelected={isOtherSelected}
      onProjectSelect={handleCardClick}
    >
      <ProjectCardHeader 
        owner={owner}
        deadline={deadline}
        dropdown={
          <ProjectCardDropdown
            projectId={id}
            projectName={name}
            onEdit={handleEdit}
            onArchive={handleArchive}
            onDelete={handleDelete}
          />
        }
      />
      <ProjectCardTitle title={name} description={description} />
      <ProjectCardFooter
        status={status}
        date={deadline}
        owner={owner}
        value={value}
      />
    </ProjectCardLayout>
  );
};

export default ProjectCard;
