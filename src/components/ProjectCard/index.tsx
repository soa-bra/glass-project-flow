
import ProjectCardLayout from './ProjectCardLayout';
import ProjectCardHeader from './ProjectCardHeader';
import ProjectCardFooter from './ProjectCardFooter';
import type { ProjectCardProps } from './types';

interface ProjectCardInteractiveProps extends ProjectCardProps {
  isSelected?: boolean;
  isOtherSelected?: boolean;
  isDimmed?: boolean;
  onProjectSelect?: (projectId: string) => void;
  onSelect?: () => void;
  onEdit?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
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
  isSelected = false,
  isOtherSelected = false,
  isDimmed = false,
  onProjectSelect,
  onSelect = () => {},
  onEdit = () => {},
  onArchive = () => {},
  onDelete = () => {}
}: ProjectCardInteractiveProps) => {
  return (
    <ProjectCardLayout
      id={id.toString()}
      isSelected={isSelected}
      isOtherSelected={isOtherSelected}
      isDimmed={isDimmed}
      onProjectSelect={onProjectSelect}
    >
      <ProjectCardHeader
        daysLeft={daysLeft}
        title={name}
        description={description}
        tasksCount={tasksCount}
        status={status}
        onSelect={onSelect}
        onEdit={onEdit}
        onArchive={onArchive}
        onDelete={onDelete}
      />
      
      <ProjectCardFooter
        status={status}
        date={deadline}
        owner={owner}
        value={budget.toString()}
      />
    </ProjectCardLayout>
  );
};

export default ProjectCard;
