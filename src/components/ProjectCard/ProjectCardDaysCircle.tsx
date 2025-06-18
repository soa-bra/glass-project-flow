
interface ProjectCardDaysCircleProps {
  daysLeft: number;
}

const ProjectCardDaysCircle = ({
  daysLeft
}: ProjectCardDaysCircleProps) => {
  return (
    <div 
      className="w-[75px] h-[75px] rounded-full border-2 flex flex-col items-center justify-center bg-transparent"
      style={{
        borderColor: 'var(--project-card-elements-title-text)'
      }}
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
