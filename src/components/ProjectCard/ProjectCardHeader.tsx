
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

const statusColors = {
  success: '#00bb88',
  warning: '#ffb500',
  error: '#f4767f',
  info: '#2f6ead'
};

const ProjectCardHeader = ({
  daysLeft,
  title,
  description,
  tasksCount,
  status
}: ProjectCardHeaderProps) => {
  return (
    <div className="flex items-start justify-between mb-2 px-0 py-0 mx-0 my-0 relative">
      {/* أيقونة الأيام على اليمين في RTL */}
      <div className="relative">
        <ProjectCardDaysCircle daysLeft={daysLeft} />
      </div>
      
      {/* العنوان والوصف في الوسط */}
      <ProjectCardTitle title={title} description={description} />
      
      {/* أيقونة المهام على اليسار في RTL */}
      <ProjectCardTasksCircle tasksCount={tasksCount} />
    </div>
  );
};

export default ProjectCardHeader;
