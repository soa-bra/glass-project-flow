
import ProjectCardLayout from './ProjectCardLayout';
import ProjectCardHeader from './ProjectCardHeader';
import ProjectCardFooter from './ProjectCardFooter';
import type { ProjectCardProps } from './types';

const ProjectCard = (project: ProjectCardProps) => {
  const {
    id,
    title,
    description,
    tasksCount,
    status,
    date,
    owner,
    value,
    daysLeft
  } = project;

  return (
    <ProjectCardLayout
      id={id}
      project={project}
    >
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
};

export default ProjectCard;
