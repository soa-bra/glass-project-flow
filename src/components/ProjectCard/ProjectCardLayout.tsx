
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

  let baseClasses =
    'glass-card-project rounded-[40px] p-2 mx-auto my-1 cursor-pointer';

  if (isSelected) {
    baseClasses += ' ring-2 ring-[#00bb88]/50 drop-shadow-xl scale-[1.01]';
  } else if (isOtherSelected) {
    baseClasses += ' opacity-30 blur-[1.5px]';
  }

  return (
    <div onClick={handleClick} className={baseClasses}>
      <div className="pointer-events-none">
        {children}
      </div>
    </div>
  );
};

export default ProjectCardLayout;
