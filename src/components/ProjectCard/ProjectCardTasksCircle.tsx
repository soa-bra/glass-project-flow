
interface ProjectCardTasksCircleProps {
  tasksCount: number;
}

const ProjectCardTasksCircle = ({ tasksCount }: ProjectCardTasksCircleProps) => {
  return (
    <div className="w-[15px] h-[15px] rounded-full flex flex-col items-center justify-center bg-[#CCD4D7] py-0 px-[22px]">
      <span className="text-[8px] font-bold text-white leading-none">
        {tasksCount.toString().padStart(2, '0')}
      </span>
      <span className="text-[6px] text-white leading-none">
        مهام
      </span>
    </div>
  );
};

export default ProjectCardTasksCircle;
