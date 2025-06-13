
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useProjectBoard } from '@/contexts/ProjectBoardContext';
import { ProjectCardProps } from './types';

interface ProjectCardLayoutProps {
  children: ReactNode;
  id: string;
  project: ProjectCardProps;
  isSelected?: boolean;
  isOtherSelected?: boolean;
}

const ProjectCardLayout = ({
  children,
  id,
  project,
  isSelected = false,
  isOtherSelected = false,
}: ProjectCardLayoutProps) => {
  const { openBoard, selectedProject, boardTheme } = useProjectBoard();

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!selectedProject) {
      openBoard(project);
    }
  };

  const getCardClasses = () => {
    let baseClasses = 'project-card-hover rounded-[40px] p-2 mx-auto my-1 cursor-pointer transition-all duration-300';
    
    if (isSelected) {
      return `${baseClasses} shadow-none`;
    }
    
    if (isOtherSelected) {
      return `${baseClasses} project-card-dimmed backdrop-blur-xl bg-white/40`;
    }
    
    return `${baseClasses} project-card-glass backdrop-blur-xl bg-white/40`;
  };

  const getCardStyle = () => {
    if (isSelected && selectedProject?.id === id) {
      return {
        background: boardTheme.gradient,
        backdropFilter: 'blur(20px)',
      };
    }
    return {};
  };

  return (
    <motion.div
      layoutId={`project-card-${id}`}
      onClick={handleClick}
      className={getCardClasses()}
      style={getCardStyle()}
      whileHover={{ scale: isSelected ? 1 : 1.02 }}
      transition={{ 
        duration: 0.45,
        ease: [0.25, 0.8, 0.25, 1]
      }}
    >
      <div className="pointer-events-none">
        {children}
      </div>
    </motion.div>
  );
};

export default ProjectCardLayout;
