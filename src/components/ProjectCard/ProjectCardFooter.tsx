
import ProjectCardStatusIndicators from './ProjectCardStatusIndicators';

interface ProjectCardFooterProps {
  status: 'success' | 'warning' | 'error' | 'info';
  date: string;
  owner: string;
  value: string;
  projectId?: string;
  onEdit?: (projectId: string) => void;
  onArchive?: (projectId: string) => void;
  onDelete?: (projectId: string) => void;
}

const ProjectCardFooter = ({
  status,
  date,
  owner,
  value,
  projectId,
  onEdit,
  onArchive,
  onDelete
}: ProjectCardFooterProps) => {
  return (
    <ProjectCardStatusIndicators 
      status={status}
      date={date}
      owner={owner}
      value={value}
      projectId={projectId}
      onEdit={onEdit}
      onArchive={onArchive}
      onDelete={onDelete}
    />
  );
};

export default ProjectCardFooter;
