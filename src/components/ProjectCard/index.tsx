
import ProjectCardLayout from './ProjectCardLayout';
import ProjectCardHeader from './ProjectCardHeader';
import ProjectCardFooter from './ProjectCardFooter';
import type { ProjectCardProps } from './types';

interface ProjectCardInteractiveProps extends ProjectCardProps {
  isSelected?: boolean;
  isOtherSelected?: boolean;
  onProjectSelect?: (projectId: string) => void;
}

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
  isSelected = false,
  isOtherSelected = false,
  onProjectSelect
}: ProjectCardInteractiveProps) => {
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
