
interface ProjectCardDaysCircleProps {
  daysLeft: number;
}
const ProjectCardDaysCircle = ({
  daysLeft
}: ProjectCardDaysCircleProps) => {
  return (
    <div className="w-[70px] h-[70px] rounded-full flex flex-col items-center justify-center"
      style={{
        background: 'rgba(255,255,255,0.35)',
        border: '2.1px solid #dde2e8',
        boxShadow: '0 2px 12px rgba(114,140,190,0.09)',
        fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif'
      }}
    >
      <span className="text-[16px] font-bold leading-none text-gray-800">
        {daysLeft.toString().padStart(2, '0')}
      </span>
      <span className="text-xs leading-none text-gray-600">
        يوم
      </span>
    </div>
  );
};
export default ProjectCardDaysCircle;
