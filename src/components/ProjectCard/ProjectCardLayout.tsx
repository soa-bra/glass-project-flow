
import { ReactNode } from 'react';

interface ProjectCardLayoutProps {
  children: React.ReactNode;
  id: string;
  isSelected?: boolean;
  isOtherSelected?: boolean;
  onProjectSelect?: (projectId: string) => void;
  className?: string;
}

const ProjectCardLayout = ({
  children,
  id,
  isSelected = false,
  isOtherSelected = false,
  onProjectSelect,
  className = "",
}: ProjectCardLayoutProps) => {
  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onProjectSelect) {
      onProjectSelect(id);
    }
  };

  const getCardClasses = () => {
    let baseClasses = 'project-card-glass project-card-hover rounded-[40px] p-2 mx-auto my-1 cursor-pointer transition-all';
    if (isSelected) {
      return `${baseClasses} project-card-selected ring-4 ring-[#b6a8fa]/50 ${className}`;
    }
    if (isOtherSelected) {
      return `${baseClasses} project-card-dimmed`;
    }
    return `${baseClasses} ${className}`;
  };

  return (
    <div
      onClick={handleClick}
      className={getCardClasses()}
      style={{
        zIndex: isSelected ? 600 : undefined,
        boxShadow: isSelected
          ? "0 0 0 6px #c6b5fa55, 0px 20px 35px #af95ff09"
          : undefined,
        background: isSelected
          ? "linear-gradient(122deg, #e7e4fa 0%, #f3ebfc 80%, #e7ebfa 100%)"
          : undefined,
        transition: 'all 0.42s cubic-bezier(0.4,0,0.2,1)'
      }}
    >
      <div className="pointer-events-none">
        {children}
      </div>
    </div>
  );
};

export default ProjectCardLayout;
