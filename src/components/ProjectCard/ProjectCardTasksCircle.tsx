
import { useUnifiedTasks } from '@/hooks/useUnifiedTasks';

interface ProjectCardTasksCircleProps {
  projectId: string;
}

const ProjectCardTasksCircle = ({
  projectId
}: ProjectCardTasksCircleProps) => {
  const unifiedTasks = useUnifiedTasks(projectId);
  const tasksCount = unifiedTasks.tasks.length;
  return (
    <div 
      className="w-[75px] h-[75px] rounded-full flex flex-col items-center justify-center px-0 py-0 my-0"
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #DADCE0'
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
