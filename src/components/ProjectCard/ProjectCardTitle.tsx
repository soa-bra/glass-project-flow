
interface ProjectCardTitleProps {
  title: string;
  description: string;
}
const ProjectCardTitle = ({
  title,
  description
}: ProjectCardTitleProps) => {
  return (
    <div className="flex-1 font-arabic text-center py-0 px-0 mx-[14px] my-[17px]" style={{
      fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif'
    }}>
      <h3 className="text-lg font-extrabold mb-1 font-arabic text-right text-gray-900 mx-0 my-0 py-0">
        {title}
      </h3>
      <p className="font-arabic text-right text-cyan-800 text-[15px] px-0 py-0 mx-px my-0" style={{
        opacity: 0.86,
        letterSpacing: '0.01em'
      }}>
        {description}
      </p>
    </div>
  );
};
export default ProjectCardTitle;
