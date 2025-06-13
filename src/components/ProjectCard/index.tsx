
import ProjectCardLayout from './ProjectCardLayout';
import ProjectCardHeader from './ProjectCardHeader';
import ProjectCardFooter from './ProjectCardFooter';
import type { ProjectCardProps } from './types';

interface ExtendedProjectCardProps extends ProjectCardProps {
  isSelected?: boolean;
  isOtherSelected?: boolean;
  onProjectSelect?: (projectId: string) => void;
  onProjectManagement?: (projectId: string) => void;
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
  isSelected,
  isOtherSelected,
  onProjectSelect,
  onProjectManagement
}: ExtendedProjectCardProps) => {
  return (
    <ProjectCardLayout
      id={id}
      isSelected={isSelected}
      isOtherSelected={isOtherSelected}
      onProjectSelect={onProjectSelect}
      onProjectManagement={onProjectManagement}
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
