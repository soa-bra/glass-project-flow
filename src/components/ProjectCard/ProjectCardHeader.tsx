
import ProjectCardDaysCircle from './ProjectCardDaysCircle';
import ProjectCardTitle from './ProjectCardTitle';
import ProjectCardTasksCircle from './ProjectCardTasksCircle';

interface ProjectCardHeaderProps {
  daysLeft: number;
  title: string;
  description: string;
  tasksCount: number;
  status: 'success' | 'warning' | 'error' | 'info';
  teamCount?: number;
}

const ProjectCardHeader = ({
  daysLeft,
  title,
  description,
  tasksCount,
  status,
  teamCount = 0
}: ProjectCardHeaderProps) => {
  return (
    <div className="flex items-start justify-between mb-2 mx-0 relative py-0 my-0 px-0">
      <div className="relative">
        <ProjectCardDaysCircle daysLeft={daysLeft} />
      </div>
      <div className="flex-1 px-[14px]">
        <ProjectCardTitle title={title} description={description} />
        {/* كبسولة عدد أعضاء الفريق */}
        <div className="flex justify-center mt-2">
          <div 
            className="px-3 py-1 rounded-full text-xs font-arabic"
            style={{
              backgroundColor: '#e4f3f7',
              color: '#000000'
            }}
          >
            {teamCount} عضو فريق
          </div>
        </div>
      </div>
      <ProjectCardTasksCircle tasksCount={tasksCount} />
    </div>
  );
};

export default ProjectCardHeader;
