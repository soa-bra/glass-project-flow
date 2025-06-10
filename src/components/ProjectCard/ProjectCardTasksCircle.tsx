interface ProjectCardTasksCircleProps {
  tasksCount: number;
}
const ProjectCardTasksCircle = ({
  tasksCount
}: ProjectCardTasksCircleProps) => {
  return <div className="w-[75px] h-[75px]  rounded-full flex flex-col items-center justify-center bg-[#CCD4D7] px-0 py-0 my-0">
      <span className="text-sm font-bold leading-none" style={{
      color: '#2A3437'
    }}>
        {tasksCount.toString().padStart(2, '0')}
      </span>
      <span className="text-xs leading-none" style={{
      color: '#2A3437'
    }}>
        مهام
      </span>
    </div>;
};
export default ProjectCardTasksCircle;