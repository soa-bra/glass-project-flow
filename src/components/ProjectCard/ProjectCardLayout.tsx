
import { ReactNode } from 'react';

interface ProjectCardLayoutProps {
  id: string;
  isSelected: boolean;
  isOtherSelected: boolean;
  onProjectSelect?: (projectId: string) => void;
  children: ReactNode;
}

const ProjectCardLayout = ({
  id,
  isSelected,
  isOtherSelected,
  onProjectSelect,
  children
}: ProjectCardLayoutProps) => {
  const handleClick = () => {
    onProjectSelect?.(id);
  };

  return (
    <div 
      onClick={handleClick} 
      className={`
        relative w-full bg-white/60 backdrop-blur-[20px] rounded-2xl shadow-sm mx-auto my-1 p-2 
        cursor-pointer transition-all duration-500 ease-out
        ${isSelected ? 'shadow-lg shadow-blue-200/30' : ''} 
        ${isOtherSelected ? 'opacity-50' : 'opacity-100'}
      `} 
      style={{
        boxShadow: isSelected ? `0 0 20px rgba(0, 153, 255, 0.3), 0 4px 16px rgba(0, 153, 255, 0.1)` : undefined
      }}
    >
      {children}
    </div>
  );
};

export default ProjectCardLayout;

