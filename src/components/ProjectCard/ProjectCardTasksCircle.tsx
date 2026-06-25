import { useProjectMetrics } from '@/hooks/useProjectMetrics';

interface ProjectCardTasksCircleProps {
  projectId: string;
  fallbackTasksCount?: number;
}

const ProjectCardTasksCircle = ({
  projectId,
  fallbackTasksCount = 0,
}: ProjectCardTasksCircleProps) => {
  const { taskStats, loading } = useProjectMetrics(projectId);
  const tasksCount = loading ? fallbackTasksCount : taskStats.total;

  return (
    <div 
      className="w-[64px] h-[64px] sm:w-[75px] sm:h-[75px] rounded-full flex flex-col items-center justify-center px-0 py-0 my-0"
      style={{
        backgroundColor: '#d1e1ea'
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
