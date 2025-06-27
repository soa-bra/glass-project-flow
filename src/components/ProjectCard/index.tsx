
import React from 'react';
import { ProjectCardLayout } from './ProjectCardLayout';
import { ProjectCardHeader } from './ProjectCardHeader';
import { ProjectCardTitle } from './ProjectCardTitle';
import { ProjectCardFooter } from './ProjectCardFooter';
import { ProjectCardStatusIndicators } from './ProjectCardStatusIndicators';
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
      onClick={handleCardClick}
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
      <ProjectCardTitle name={name} description={description} />
      <ProjectCardFooter
        team={team}
        status={status}
        budget={budget}
        tasksCount={tasksCount}
        daysLeft={daysLeft}
        value={value}
      />
      <ProjectCardStatusIndicators 
        status={status}
        isOverBudget={false}
        hasOverdueTasks={false}
      />
    </ProjectCardLayout>
  );
};

export default ProjectCard;
