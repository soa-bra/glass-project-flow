
interface ProjectCardTitleProps {
  title: string;
  description: string;
}

const ProjectCardTitle = ({
  title,
  description
}: ProjectCardTitleProps) => {
  return (
    <div className="text-center py-0 px-0 mx-0 my-0">
      <h3 
        className="text-lg font-bold mb-1 font-arabic text-right mx-0 my-0 py-0"
        style={{
          color: 'var(--project-card-elements-title-text)'
        }}
      >
        {title}
      </h3>
      <p 
        className="font-arabic text-right px-0 py-0 mx-px my-0"
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
