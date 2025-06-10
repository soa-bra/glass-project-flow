
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
  const handleClick = (event: React.MouseEvent) => {
    console.log('🎯 ProjectCardLayout: Click event started for project:', id);
    console.log('🎯 Current selection state - isSelected:', isSelected, 'isOtherSelected:', isOtherSelected);
    
    // منع انتشار الحدث لمكونات أخرى
    event.stopPropagation();
    
    console.log('🎯 Event propagation stopped');
    
    if (onProjectSelect) {
      console.log('🎯 Calling onProjectSelect for project:', id);
      onProjectSelect(id);
    } else {
      console.log('⚠️ onProjectSelect is not available');
    }
  };

  const getCardStyles = () => {
    if (isSelected) {
      return {
        transform: 'scale(1.02)'
      };
    }
    return {};
  };

  return (
    <div
      onClick={handleClick}
      style={getCardStyles()}
      className={`
        glass-enhanced rounded-[40px] p-2 mx-auto my-1 cursor-pointer
        transition-all duration-200 ease-in-out
        ${isSelected 
          ? 'opacity-100' 
          : isOtherSelected 
            ? 'opacity-25 shadow-sm' 
            : 'opacity-100 shadow-sm hover:shadow-md'
        }
      `}
    >
      <div className="pointer-events-none">
        {children}
      </div>
    </div>
  );
};

export default ProjectCardLayout;
