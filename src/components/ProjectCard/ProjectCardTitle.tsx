interface ProjectCardTitleProps {
  title: string;
  description: string;
}
const ProjectCardTitle = ({
  title,
  description
}: ProjectCardTitleProps) => {
  return <div className="flex-1 text-center mx-[9px] px-[15px]">
      <h3 className="text-lg font-bold mb-1 font-arabic text-right text-gray-900 mx-[10px]">
        {title}
      </h3>
      <p className="font-arabic text-right text-cyan-800 my-[8px] px-0 mx-[10px]">
        {description}
      </p>
    </div>;
};
export default ProjectCardTitle;