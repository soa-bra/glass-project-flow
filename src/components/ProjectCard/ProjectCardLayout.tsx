
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
      'project-card-hover rounded-[40px] p-2 mx-auto my-1 cursor-pointer transform transition-all duration-500 ease-out';
    
    if (isSelected) {
      return `${baseClasses} project-card-selected scale-105 shadow-xl`;
    }
    
    if (isOtherSelected) {
      return `${baseClasses} project-card-dimmed scale-95 opacity-60`;
    }
    
    return `${baseClasses} hover:scale-102 hover:shadow-lg`;
  };

  const getCardStyles = () => {
    const baseStyles = {
      background: '#e7f1f5',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s ease-out, box-shadow 0.3s ease-out'
    };

    if (isSelected) {
      return {
        ...baseStyles,
        background: 'linear-gradient(135deg, #e7f1f5 0%, #d0e7ed 100%)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15), 0 0 0 2px rgba(79, 172, 254, 0.3)',
        transform: 'translateY(-4px) scale(1.05)',
      };
    }

    if (isOtherSelected) {
      return {
        ...baseStyles,
        background: 'rgba(231, 241, 245, 0.6)',
        transform: 'scale(0.95)',
        filter: 'blur(0.5px)',
      };
    }

    return baseStyles;
  };

  return (
    <div
      onClick={handleClick}
      className={getCardClasses()}
      style={getCardStyles()}
    >
      <div 
        className="pointer-events-none transition-all duration-300 ease-out"
        style={{
          transform: isSelected ? 'translateY(-2px)' : 'translateY(0)',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ProjectCardLayout;
