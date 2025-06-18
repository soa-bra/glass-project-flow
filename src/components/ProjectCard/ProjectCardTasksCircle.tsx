
interface ProjectCardTasksCircleProps {
  tasksCount: number;
}

const ProjectCardTasksCircle = ({
  tasksCount
}: ProjectCardTasksCircleProps) => {
  return (
    <div 
      className="w-[75px] h-[75px] rounded-full flex flex-col items-center justify-center px-0 py-0 my-0"
      style={{
        backgroundColor: 'var(--project-card-elements-task-count)'
      }}
    >
      <span 
        className="text-sm font-bold leading-none"
        style={{
          color: 'var(--project-card-elements-title-text)'
        }}
      >
        {tasksCount.toString().padStart(2, '0')}
      </span>
      <span 
        className="text-xs leading-none my-[5px] py-0"
        style={{
          color: 'var(--project-card-elements-title-text)'
        }}
      >
        مهام
      </span>
    </div>
  );
};

export default ProjectCardTasksCircle;
