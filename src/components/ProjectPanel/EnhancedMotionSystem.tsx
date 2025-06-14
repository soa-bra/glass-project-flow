
import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface EnhancedMotionSystemProps {
  children: React.ReactNode;
  isVisible: boolean;
  onClose: () => void;
  isSidebarCollapsed: boolean;
}

const entryMotionVariants: Variants = {
  hidden: { 
    x: '100%',
    opacity: 0
  },
  visible: { 
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1] as const
    }
  },
  exit: { 
    x: '100%',
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 1, 1] as const
    }
  }
};

export const EnhancedMotionSystem: React.FC<EnhancedMotionSystemProps> = ({
  children,
  isVisible,
  onClose,
  isSidebarCollapsed
}) => {
  const panelClasses = `fixed transition-all duration-500 ease-in-out ${
    isSidebarCollapsed ? 'operations-board-collapsed' : 'operations-board-expanded'
  }`;

  const panelStyles = {
    height: 'calc(100vh - 60px)',
    top: 'var(--sidebar-top-offset)',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.25) 100%)',
    backdropFilter: 'blur(20px) saturate(180%)',
    overflow: 'hidden' as const,
    zIndex: 50,
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: `
      0 25px 50px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.4),
      0 0 40px rgba(255, 255, 255, 0.1)
    `
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className={panelClasses}
          style={panelStyles}
          variants={entryMotionVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
