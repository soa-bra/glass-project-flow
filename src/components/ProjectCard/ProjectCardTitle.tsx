interface ProjectCardTitleProps {
  title: string;
  description: string;
}

const ProjectCardTitle = ({
  title,
  description
}: ProjectCardTitleProps) => {
  return (
    <div className="flex-1 min-w-0 text-center py-0 px-0 mx-0 my-[17px]">
      <h3
        className="font-arabic text-right mx-0 my-0 py-0 mb-1 text-base sm:text-lg font-semibold sm:font-bold leading-[1.6] sm:leading-[1.5] break-words"
        style={{
          color: 'var(--project-card-elements-title-text)'
        }}
      >
        {title}
      </h3>
      <p
        className="font-arabic text-right px-0 py-0 mx-0 my-0 text-sm sm:text-base leading-[1.75] sm:leading-[1.7] break-words"
        style={{
          color: 'var(--project-card-elements-secondary-text)'
        }}
      >
        {description}
      </p>
    </div>
  );
};

export default ProjectCardTitle;
