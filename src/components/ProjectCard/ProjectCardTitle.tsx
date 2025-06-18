
interface ProjectCardTitleProps {
  title: string;
  description: string;
}

const ProjectCardTitle = ({
  title,
  description
}: ProjectCardTitleProps) => {
  return (
    <div className="text-center py-2">
      <h3 className="text-xl font-bold mb-2 font-arabic text-gray-900">
        {title}
      </h3>
      <p className="text-sm font-arabic text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default ProjectCardTitle;
