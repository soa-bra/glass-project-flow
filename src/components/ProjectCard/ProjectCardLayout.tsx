
import { ReactNode } from 'react';

interface ProjectCardLayoutProps {
  children: ReactNode;
  id: string;
  isSelected?: boolean;
  isOtherSelected?: boolean;
  isDimmed?: boolean;
  onProjectSelect?: (projectId: string) => void;
}

const ProjectCardLayout = ({
  children,
  id,
  isSelected = false,
  isOtherSelected = false,
  isDimmed = false,
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
      'project-card-hover rounded-[40px] p-2 mx-auto my-1 cursor-pointer transition-all duration-300';
    
    if (isDimmed) {
      return `${baseClasses} opacity-30 pointer-events-none`;
    }
    
    if (isSelected) {
      return `${baseClasses} project-card-selected ring-2 ring-blue-500`;
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
        background: '#e7f1f5',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
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
