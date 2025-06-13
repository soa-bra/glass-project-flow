
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
  const { openBoard, closeBoard, selectedProject, boardTheme } = useProjectBoard();

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!selectedProject) {
      openBoard(project);
    } else if (selectedProject?.id === id) {
      // إغلاق اللوحة عند النقر على البطاقة المحددة
      closeBoard();
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
        background: 'linear-gradient(135deg, rgba(125, 107, 255, 0.8) 0%, rgba(255, 200, 92, 0.6) 50%, rgba(125, 107, 255, 0.8) 100%)',
        backdropFilter: 'blur(14px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: 'inset 0 0 24px rgba(255,255,255,0.25)',
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
