
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
    let baseClasses = 'w-full bg-white/90 backdrop-blur-xl rounded-[32px] p-6 mx-auto my-3 cursor-pointer border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300';
    
    if (isSelected) {
      return `${baseClasses} ring-2 ring-blue-400/50 shadow-2xl`;
    }
    
    if (isOtherSelected) {
      return `${baseClasses} opacity-60`;
    }
    
    return baseClasses;
  };

  return (
    <div
      onClick={handleClick}
      className={getCardClasses()}
    >
      <div className="pointer-events-none">
        {children}
      </div>
    </div>
  );
};

export default ProjectCardLayout;
