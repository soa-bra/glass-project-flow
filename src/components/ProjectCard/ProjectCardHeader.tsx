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
  return <div className="flex items-start justify-between mb-2 mx-0 relative py-0 my-0 px-0">
      <div className="relative">
        <ProjectCardDaysCircle daysLeft={daysLeft} />
        {/* نقطة حالة المشروع بمحاذاة الطرف الأيمن من دائرة الأيام */}
        
      </div>
      <ProjectCardTitle title={title} description={description} />
      <ProjectCardTasksCircle tasksCount={tasksCount} />
    </div>;
};
export default ProjectCardHeader;