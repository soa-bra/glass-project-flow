
interface ProjectCardTitleProps {
  title: string;
  description: string;
}
const ProjectCardTitle = ({
  title,
  description
}: ProjectCardTitleProps) => {
  return (
    <div
      className="flex-1 py-0 px-0 mx-[14px] my-[17px] flex flex-col items-end justify-start"
      style={{
        direction: "rtl",
        textAlign: "right",
        fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif'
      }}
    >
      <h3 className="text-lg font-bold mb-1 font-arabic text-right text-gray-900 mx-0 my-0 py-0">
        {title}
      </h3>
      <p className="font-arabic text-right text-cyan-800 px-0 py-0 mx-px my-0">
        {description}
      </p>
    </div>
  );
};
export default ProjectCardTitle;
