
import ProjectCardStatusIndicators from './ProjectCardStatusIndicators';

interface ProjectCardFooterProps {
  status: 'success' | 'warning' | 'error' | 'info';
  date: string;
  owner: string;
  value: string;
  teamMembersCount?: number;
}

const ProjectCardFooter = ({
  status,
  date,
  owner,
  value,
  teamMembersCount
}: ProjectCardFooterProps) => {
  return (
    <ProjectCardStatusIndicators 
      status={status}
      date={date}
      owner={owner}
      value={value}
      teamMembersCount={teamMembersCount}
    />
  );
};

export default ProjectCardFooter;
