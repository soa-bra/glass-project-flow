
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
      <div className="relative">
        <ProjectCardDaysCircle daysLeft={daysLeft} />
        {/* نقطة حالة المشروع بمحاذاة الطرف الأيمن من دائرة الأيام */}
        <div 
          style={{
            backgroundColor: statusColors[status],
            boxShadow: `0 4px 8px ${statusColors[status]}30`
          }} 
          className="absolute w-[15px] h-[15px] rounded-full top-0 -right-[8px]" 
        />
      </div>
      <ProjectCardTitle title={title} description={description} />
      <ProjectCardTasksCircle tasksCount={tasksCount} />
    </div>
  );
};

export default ProjectCardHeader;
