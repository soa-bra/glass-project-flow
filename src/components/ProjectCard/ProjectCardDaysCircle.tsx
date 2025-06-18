
interface ProjectCardDaysCircleProps {
  daysLeft: number;
}

const ProjectCardDaysCircle = ({
  daysLeft
}: ProjectCardDaysCircleProps) => {
  return (
    <div className="w-20 h-20 rounded-full border-2 border-gray-300 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm">
      <span className="text-lg font-bold text-gray-900 leading-none">
        {daysLeft.toString().padStart(2, '0')}
      </span>
      <span className="text-xs text-gray-600 leading-none mt-1">
        يوم
      </span>
    </div>
  );
};

export default ProjectCardDaysCircle;
