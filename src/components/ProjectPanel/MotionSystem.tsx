
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MotionSystemProps {
  children: React.ReactNode;
  isVisible: boolean;
  onClose: () => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

const panelVariants = {
  hidden: { 
    x: '100%',
    scale: 0.95,
    opacity: 0
  },
  visible: { 
    x: 0,
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 200,
      duration: 0.5,
      staggerChildren: 0.1
    }
  },
  exit: { 
    x: '100%',
    scale: 0.95,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

export const MotionSystem: React.FC<MotionSystemProps> = ({
  children,
  isVisible,
  onClose
}) => {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[1200] flex items-center justify-end"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          style={{
            background: 'rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <motion.div
            className="w-[60vw] h-full flex flex-col"
            variants={panelVariants}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.25) 100%)',
              backdropFilter: 'blur(20px) saturate(180%)',
              borderRadius: '20px 0 0 20px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: `
                -4px 0 20px rgba(0, 0, 0, 0.08),
                inset 0 1px 0 rgba(255, 255, 255, 0.4),
                0 0 40px rgba(255, 255, 255, 0.1)
              `
            }}
          >
            <motion.div variants={contentVariants} className="flex-1 overflow-hidden">
              {children}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
