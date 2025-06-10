interface ProjectCardTitleProps {
  title: string;
  description: string;
}
const ProjectCardTitle = ({
  title,
  description
}: ProjectCardTitleProps) => {
  return <div className="flex-1 text-center px-0 mx-[10px] my-[2px] py-[10px]">
      <h3 className="text-lg font-bold mb-1 font-arabic text-right text-gray-900">
        {title}
      </h3>
      <p className="font-arabic text-right text-cyan-800">
        {description}
      </p>
    </div>;
};
export default ProjectCardTitle;