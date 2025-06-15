interface ProjectCardDaysCircleProps {
  daysLeft: number;
}
const ProjectCardDaysCircle = ({
  daysLeft
}: ProjectCardDaysCircleProps) => {
  return <div className="w-[75px] h-[75px] rounded-full border-2 border-gray-300 flex flex-col items-center justify-center bg-F2F2F2 bg-transparent ">
      <span className="text-sm font-bold leading-none text-gray-800">
        {daysLeft.toString().padStart(2, '0')}
      </span>
      <span className="text-xs leading-none text-gray-600">
        يوم
      </span>
    </div>;
};
export default ProjectCardDaysCircle;