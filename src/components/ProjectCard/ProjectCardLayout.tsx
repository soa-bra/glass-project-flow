
import { ReactNode, useCallback } from 'react';

interface ProjectCardLayoutProps {
  children: ReactNode;
  id: string;
  isSelected?: boolean;
  isOtherSelected?: boolean;
  onProjectSelect?: (projectId: string) => void;
}

const ProjectCardLayout = ({
  children,
  id,
  isSelected = false,
  isOtherSelected = false,
  onProjectSelect,
}: ProjectCardLayoutProps) => {
  const handleClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    onProjectSelect?.(id);
  }, [id, onProjectSelect]);

  const cardClasses = `project-card-glass project-card-hover rounded-[40px] p-2 mx-auto my-1 cursor-pointer ${
    isSelected ? 'project-card-selected' : 
    isOtherSelected ? 'project-card-dimmed' : ''
  }`;

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
