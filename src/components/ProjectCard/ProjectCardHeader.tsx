
import ProjectCardDaysCircle from './ProjectCardDaysCircle';
import ProjectCardTitle from './ProjectCardTitle';
import ProjectCardTasksCircle from './ProjectCardTasksCircle';

interface ProjectCardHeaderProps {
  daysLeft: number;
  title: string;
  description: string;
  tasksCount: number;
  status: 'success' | 'warning' | 'error' | 'info';
}

const ProjectCardHeader = ({
  daysLeft,
  title,
  description,
  tasksCount,
  status
}: ProjectCardHeaderProps) => {
  return (
    <div className="flex items-start justify-between mb-6">
      {/* دائرة الأيام على اليسار */}
      <div className="flex-shrink-0">
        <ProjectCardDaysCircle daysLeft={daysLeft} />
      </div>

      {/* العنوان والوصف في المنتصف */}
      <div className="flex-1 px-4">
        <ProjectCardTitle title={title} description={description} />
      </div>

      {/* دائرة المهام على اليمين */}
      <div className="flex-shrink-0">
        <ProjectCardTasksCircle tasksCount={tasksCount} />
      </div>
    </div>
  );
};

export default ProjectCardHeader;
