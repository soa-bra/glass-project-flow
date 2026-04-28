import ProjectCardDaysCircle from './ProjectCardDaysCircle';
import ProjectCardTitle from './ProjectCardTitle';
import ProjectCardTasksCircle from './ProjectCardTasksCircle';

interface ProjectCardHeaderProps {
  daysLeft: number;
  title: string;
  description: string;
  projectId: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

const ProjectCardHeader = ({
  daysLeft,
  title,
  description,
  projectId,
  status
}: ProjectCardHeaderProps) => {
  return (
    <div
      dir="rtl"
      className="flex items-start justify-between gap-2 sm:gap-3 mb-2 mx-0 relative py-0 my-0 px-0"
    >
      <div className="relative shrink-0">
        <ProjectCardDaysCircle daysLeft={daysLeft} />
      </div>
      <ProjectCardTitle title={title} description={description} />
      <div className="shrink-0">
        <ProjectCardTasksCircle projectId={projectId} />
      </div>
    </div>
  );
};

export default ProjectCardHeader;
