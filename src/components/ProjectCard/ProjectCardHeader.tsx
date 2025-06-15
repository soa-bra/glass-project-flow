
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
    <div
      className="flex items-start justify-between mb-2 mx-0 relative py-0 my-0 px-0 w-full"
      style={{
        direction: 'rtl',
        fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
        flexDirection: 'row-reverse',
        textAlign: 'right',
        alignItems: 'flex-start',
      }}
    >
      <div className="relative flex-shrink-0 flex items-center justify-center">
        <ProjectCardDaysCircle daysLeft={daysLeft} />
        {/* يمكن إضافة نقطة الحالة هنا إذا رغبت */}
      </div>
      <ProjectCardTitle title={title} description={description} />
      <div className="flex-shrink-0 flex items-center justify-center">
        <ProjectCardTasksCircle tasksCount={tasksCount} />
      </div>
    </div>
  );
};
export default ProjectCardHeader;
