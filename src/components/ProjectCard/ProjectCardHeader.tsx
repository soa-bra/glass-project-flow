
import ProjectCardDaysCircle from './ProjectCardDaysCircle';
import ProjectCardTitle from './ProjectCardTitle';
import ProjectCardTasksCircle from './ProjectCardTasksCircle';

interface ProjectCardHeaderProps {
  daysLeft: number;
  title: string;
  description: string;
  tasksCount: number;
}

const ProjectCardHeader = ({
  daysLeft,
  title,
  description,
  tasksCount
}: ProjectCardHeaderProps) => {
  return (
    <div className="flex items-start justify-between mb-2 mx-0 my-0 py-0 px-0">
      <ProjectCardDaysCircle daysLeft={daysLeft} />
      <ProjectCardTitle title={title} description={description} />
      <ProjectCardTasksCircle tasksCount={tasksCount} />
    </div>
  );
};

export default ProjectCardHeader;
