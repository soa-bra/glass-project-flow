
interface ProjectCardTasksCircleProps {
  tasksCount: number;
}

const ProjectCardTasksCircle = ({ tasksCount }: ProjectCardTasksCircleProps) => {
  return (
    <div 
      className="rounded-full flex items-center justify-center mx-1"
      style={{
        width: '40px',
        height: '40px',
        backgroundColor: 'var(--project-card-elements-tasks-count-circle)',
        color: 'var(--project-card-elements-tasks-count-text)'
      }}
    >
      <span 
        className="text-sm font-bold font-arabic"
        style={{ fontFamily: 'IBM Plex Sans Arabic' }}
      >
        {tasksCount}
      </span>
    </div>
  );
};

export default ProjectCardTasksCircle;
