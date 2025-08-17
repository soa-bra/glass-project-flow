
interface ProjectCardDaysCircleProps {
  daysLeft: number;
}

const ProjectCardDaysCircle = ({
  daysLeft
}: ProjectCardDaysCircleProps) => {
  return (
    <div 
      className="w-[75px] h-[75px] rounded-full bg-transparent border border-[#000000] flex flex-col items-center justify-center"
    >
      <span 
        className="text-sm font-bold leading-none"
        style={{
          color: 'var(--project-card-elements-title-text)'
        }}
      >
        {daysLeft.toString().padStart(2, '0')}
      </span>
      <span 
        className="text-xs leading-none"
        style={{
          color: 'var(--project-card-elements-secondary-text)'
        }}
      >
        يوم
      </span>
    </div>
  );
};

export default ProjectCardDaysCircle;
