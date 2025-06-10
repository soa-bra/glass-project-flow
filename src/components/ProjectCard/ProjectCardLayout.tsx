
import { ReactNode } from 'react';

const statusColors = {
  success: '#00bb88',
  warning: '#ffb500',
  error: '#f4767f',
  info: '#2f6ead'
};

interface ProjectCardLayoutProps {
  children: ReactNode;
  id: string;
  isSelected?: boolean;
  isOtherSelected?: boolean;
  onProjectSelect?: (projectId: string) => void;
  status: 'success' | 'warning' | 'error' | 'info';
}

const ProjectCardLayout = ({
  children,
  id,
  isSelected = false,
  isOtherSelected = false,
  onProjectSelect,
  status
}: ProjectCardLayoutProps) => {
  const handleClick = () => {
    if (onProjectSelect) {
      console.log('Selected project:', id);
      onProjectSelect(id);
    }
  };

  const getCardStyles = () => {
    if (isSelected) {
      return {
        boxShadow: `0 0 20px ${statusColors[status]}30, 0 4px 16px ${statusColors[status]}20`
      };
    }
    return {};
  };

  return (
    <div
      onClick={handleClick}
      style={getCardStyles()}
      className={`
        bg-white/60 backdrop-blur-[20px] rounded-3xl p-2 mx-auto my-1 cursor-pointer
        transition-all duration-300 ease-in-out
        ${isSelected 
          ? 'shadow-lg scale-[1.02] opacity-100' 
          : isOtherSelected 
            ? 'opacity-50 shadow-sm' 
            : 'opacity-100 shadow-sm hover:shadow-md'
        }
      `}
    >
      {children}
    </div>
  );
};

export default ProjectCardLayout;
