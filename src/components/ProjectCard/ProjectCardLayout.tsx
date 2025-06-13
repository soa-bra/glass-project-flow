
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useProjectBoard } from '@/contexts/ProjectBoardContext';
import { ProjectCardProps } from './types';

interface ProjectCardLayoutProps {
  children: ReactNode;
  id: string;
  project: ProjectCardProps;
}

const ProjectCardLayout = ({
  children,
  id,
  project,
}: ProjectCardLayoutProps) => {
  const { openBoard, selectedProject } = useProjectBoard();

  const isSelected = selectedProject?.id === id;

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!selectedProject) {
      openBoard(project);
    }
  };

  const getProjectTint = (status: string) => {
    const tints = {
      success: 'rgba(34, 197, 94, 0.4)',
      warning: 'rgba(245, 158, 11, 0.4)',
      error: 'rgba(239, 68, 68, 0.4)',
      info: 'rgba(59, 130, 246, 0.4)',
    };
    return tints[status as keyof typeof tints] || tints.info;
  };

  const getCardClasses = () => {
    let baseClasses = 'project-card-hover rounded-[40px] p-2 mx-auto my-1 cursor-pointer transition-all duration-300';
    
    if (isSelected) {
      return `${baseClasses} shadow-none border border-white/30`;
    }
    
    return `${baseClasses} project-card-glass backdrop-blur-xl bg-white/40`;
  };

  const getCardStyle = () => {
    if (isSelected) {
      return {
        background: getProjectTint(project.status),
        backdropFilter: 'blur(14px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: 'inset 0 0 24px rgba(255,255,255,0.15)',
      };
    }
    return {};
  };

  return (
    <motion.div
      layoutId={isSelected ? `project-piece-${id}` : `project-card-${id}`}
      onClick={handleClick}
      className={getCardClasses()}
      style={getCardStyle()}
      whileHover={{ scale: isSelected ? 1 : 1.02 }}
      transition={{ 
        duration: 0.25,
        ease: [0.4, 0.0, 0.2, 1],
        layout: {
          duration: 0.35,
          ease: [0.4, 0.0, 0.2, 1]
        }
      }}
    >
      <div className="pointer-events-none">
        {children}
      </div>
    </motion.div>
  );
};

export default ProjectCardLayout;
