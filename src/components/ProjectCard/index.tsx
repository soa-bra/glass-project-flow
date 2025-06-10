
import ProjectCardLayout from './ProjectCardLayout';
import ProjectCardHeader from './ProjectCardHeader';
import ProjectCardFooter from './ProjectCardFooter';
import type { ProjectCardProps } from './types';

const ProjectCard = ({
  id,
  title,
  description,
  tasksCount,
  status,
  date,
  owner,
  value,
  daysLeft,
  onProjectSelect,
  isSelected = false,
  isOtherSelected = false
}: ProjectCardProps) => {
  return (
    <ProjectCardLayout
      id={id}
      isSelected={isSelected}
      isOtherSelected={isOtherSelected}
      onProjectSelect={onProjectSelect}
    >
      <ProjectCardHeader
        daysLeft={daysLeft}
        title={title}
        description={description}
        tasksCount={tasksCount}
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
