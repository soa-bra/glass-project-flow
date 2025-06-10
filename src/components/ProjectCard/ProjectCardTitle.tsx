interface ProjectCardTitleProps {
  title: string;
  description: string;
}
const ProjectCardTitle = ({
  title,
  description
}: ProjectCardTitleProps) => {
  return <div className="flex-1 text-center py-0 px-0 my-[8px] mx-[14px]">
      <h3 className="text-lg font-bold mb-1 font-arabic text-right text-gray-900 mx-0 py-0 my-0">
        {title}
      </h3>
      <p className="font-arabic text-right text-cyan-800 px-0 py-0 my-px mx-px">
        {description}
      </p>
    </div>;
};
export default ProjectCardTitle;