
import ProjectCardLayout from './ProjectCardLayout';
import ProjectCardHeader from './ProjectCardHeader';
import ProjectCardFooter from './ProjectCardFooter';
import type { ProjectCardProps } from './types';

interface ProjectCardInteractiveProps extends ProjectCardProps {
  isSelected?: boolean;
  isOtherSelected?: boolean;
  onProjectSelect?: (projectId: string) => void;
  teamMembersCount?: number;
}

const ProjectCard = ({
  id,
  name,
  description,
  tasksCount,
  status,
  deadline,
  owner,
  budget,
  daysLeft,
  teamMembersCount = 3,
  isSelected = false,
  isOtherSelected = false,
  onProjectSelect
}: ProjectCardInteractiveProps) => {
  return (
    <ProjectCardLayout
      id={id.toString()}
      isSelected={isSelected}
      isOtherSelected={isOtherSelected}
      onProjectSelect={onProjectSelect}
    >
      <ProjectCardHeader
        daysLeft={daysLeft}
        title={name}
        description={description}
        tasksCount={tasksCount}
        status={status}
      />
      
      <ProjectCardFooter
        status={status}
        date={deadline}
        owner={owner}
        value={budget.toString()}
        teamMembersCount={teamMembersCount}
      />
    </ProjectCardLayout>
  );
};

export default ProjectCard;
