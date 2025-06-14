
import ProjectCardLayout from './ProjectCardLayout';
import ProjectCardHeader from './ProjectCardHeader';
import ProjectCardFooter from './ProjectCardFooter';
import type { ProjectCardProps } from './types';

interface Props extends ProjectCardProps {
  isActive?: boolean;
  onClick?: () => void;
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
  isActive = false,
  onClick
}: Props) => {
  return (
    <ProjectCardLayout
      id={id}
      onProjectSelect={onClick}
      isSelected={isActive}
      className={isActive ? 'project-card-highlighted' : ''}
    >
      <div>
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
      </div>
    </ProjectCardLayout>
  );
};

export default ProjectCard;
