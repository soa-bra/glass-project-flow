
import React from 'react';
import ProjectCardLayout from './ProjectCardLayout';
import ProjectCardHeader from './ProjectCardHeader';
import ProjectCardFooter from './ProjectCardFooter';
import type { ProjectCardProps } from './types';

const ProjectCard: React.FC<ProjectCardProps> = React.memo(({
  id,
  title,
  description,
  tasksCount,
  status,
  date,
  owner,
  value,
  daysLeft
}) => {
  return (
    <ProjectCardLayout id={id}>
      <ProjectCardHeader
        daysLeft={daysLeft}
        title={title}
        description={description}
        tasksCount={tasksCount}
        status={status}
      />
      
      <ProjectCardFooter
        status={status}
        date={date}
        owner={owner}
        value={value}
      />
    </ProjectCardLayout>
  );
});

ProjectCard.displayName = 'ProjectCard';

export { ProjectCard };
export default ProjectCard;
