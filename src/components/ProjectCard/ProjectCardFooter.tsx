
import ProjectCardStatusIndicators from './ProjectCardStatusIndicators';

interface ProjectCardFooterProps {
  status: 'success' | 'warning' | 'error' | 'info';
  date: string;
  owner: string;
  value: string;
}

const ProjectCardFooter = ({
  status,
  date,
  owner,
  value
}: ProjectCardFooterProps) => {
  return (
    <ProjectCardStatusIndicators 
      status={status}
      date={date}
      owner={owner}
      value={value}
    />
  );
};

export default ProjectCardFooter;
