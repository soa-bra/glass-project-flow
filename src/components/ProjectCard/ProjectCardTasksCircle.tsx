
interface ProjectCardTasksCircleProps {
  tasksCount: number;
}

const ProjectCardTasksCircle = ({
  tasksCount
}: ProjectCardTasksCircleProps) => {
  return (
    <div className="w-20 h-20 rounded-full flex flex-col items-center justify-center bg-blue-100/80 backdrop-blur-sm">
      <span className="text-lg font-bold text-gray-900 leading-none">
        {tasksCount.toString().padStart(2, '0')}
      </span>
      <span className="text-xs text-gray-600 leading-none mt-1">
        مهام
      </span>
    </div>
  );
};

export default ProjectCardTasksCircle;
