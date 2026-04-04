
import { ReactNode } from 'react';

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
  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (onProjectSelect) {
      onProjectSelect(id);
    }
  };

  const getCardClasses = () => {
    const baseClasses =
      'project-card-hover rounded-[40px] p-2 mx-auto my-1 cursor-pointer';
    
    if (isSelected) {
      return `${baseClasses} project-card-selected`;
    }
    
    if (isOtherSelected) {
      return `${baseClasses} project-card-dimmed`;
    }
    
    return baseClasses;
  };

  return (
    <div
      onClick={handleClick}
      className={getCardClasses()}
      style={{
        background: '#F1F5F9',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        border: '1px solid #DADCE0',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <div className="pointer-events-none">
        {children}
      </div>
    </div>
  );
};

export default ProjectCardLayout;
