
interface ProjectCardTasksCircleProps {
  tasksCount: number;
}
const ProjectCardTasksCircle = ({
  tasksCount
}: ProjectCardTasksCircleProps) => {
  return (
    <div
      className="w-[75px] h-[75px] rounded-full flex flex-col items-center justify-center"
      style={{
        background: '#CCD4D7',
        fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
        direction: 'rtl',
        textAlign: 'center'
      }}
    >
      <span className="text-sm font-bold leading-none" style={{
        color: '#2A3437'
      }}>
        {tasksCount.toString().padStart(2, '0')}
      </span>
      <span style={{
        color: '#2A3437'
      }} className="text-xs leading-none my-[5px] py-0">
        مهام
      </span>
    </div>
  );
};
export default ProjectCardTasksCircle;
