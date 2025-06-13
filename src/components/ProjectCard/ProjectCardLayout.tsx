
import { ReactNode, useCallback } from 'react';

interface ProjectCardLayoutProps {
  children: ReactNode;
  id: string;
  onProjectSelect?: (projectId: string) => void;
}

const ProjectCardLayout: React.FC<ProjectCardLayoutProps> = ({
  children,
  id,
  onProjectSelect,
}) => {
  const handleClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    console.log('النقر على كارت المشروع:', id);
    onProjectSelect?.(id);
  }, [id, onProjectSelect]);

  const cardClasses = `
    project-card-glass project-card-hover rounded-[40px] p-2 mx-auto my-1 cursor-pointer 
    transition-all duration-200 ease-out hover:scale-[1.02]
  `;

  return (
    <div onClick={handleClick} className={cardClasses}>
      <div className="pointer-events-none">
        {children}
      </div>
    </div>
  );
};

export { ProjectCardLayout };
export default ProjectCardLayout;
