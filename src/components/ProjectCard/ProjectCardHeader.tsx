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
      className="relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-2 sm:gap-3 mb-2 py-2 sm:py-3 px-2 sm:px-3 min-h-[96px] sm:min-h-[110px] overflow-hidden"
    >
      <div className="relative shrink-0 self-start">
        <ProjectCardDaysCircle daysLeft={daysLeft} />
      </div>
      <ProjectCardTitle title={title} description={description} />
      <div className="shrink-0 self-start">
        <ProjectCardTasksCircle projectId={projectId} />
      </div>
    </div>
  );
};

export default ProjectCardHeader;
