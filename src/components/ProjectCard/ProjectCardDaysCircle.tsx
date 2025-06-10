
interface ProjectCardDaysCircleProps {
  daysLeft: number;
}

const ProjectCardDaysCircle = ({ daysLeft }: ProjectCardDaysCircleProps) => {
  return (
    <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm mx-[2px] px-[8px]">
      <span className="text-sm font-bold leading-none text-gray-800">
        {daysLeft.toString().padStart(2, '0')}
      </span>
      <span className="text-xs leading-none text-gray-600">
        يوم
      </span>
    </div>
  );
};

export default ProjectCardDaysCircle;
