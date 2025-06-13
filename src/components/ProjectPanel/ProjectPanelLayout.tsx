
import React from 'react';
import { motion, Variants } from 'framer-motion';

interface ProjectPanelLayoutProps {
  children: React.ReactNode;
}

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1] as const,
      staggerChildren: 0.1
    }
  }
};

export const ProjectPanelLayout: React.FC<ProjectPanelLayoutProps> = ({
  children
}) => {
  return (
    <motion.div
      className="h-full w-full grid gap-4 p-6"
      style={{
        gridTemplate: '35% 4% 61%',
        gridTemplateColumns: '35% 4% 61%',
        rowGap: '1rem'
      }}
      variants={contentVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
};
