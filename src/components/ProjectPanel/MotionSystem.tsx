
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
      ease: [0.4, 0.0, 0.2, 1] as const
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.25,
      ease: [0.4, 0.0, 1, 1] as const
    }
  }
};

const panelVariants = {
  hidden: { 
    x: '-100%',
    scale: 0.96,
    opacity: 0
  },
  visible: { 
    x: 0,
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 240,
      damping: 28,
      duration: 0.5
    }
  },
  exit: { 
    x: '-100%',
    scale: 0.96,
    opacity: 0,
    transition: {
      duration: 0.25,
      ease: [0.4, 0.0, 0.2, 1] as const
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
          className="fixed inset-0 z-[1300] flex items-center justify-start"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          style={{
            background: 'rgba(0, 0, 0, 0.08)',
            backdropFilter: 'blur(4px)'
          }}
        >
          <motion.div
            className="w-[75vw] h-full flex flex-col"
            variants={panelVariants}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.25) 100%)',
              backdropFilter: 'blur(20px) saturate(180%)',
              borderRadius: '0 20px 20px 0',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: `
                4px 0 20px rgba(0, 0, 0, 0.08),
                inset -1px 0 0 rgba(255, 255, 255, 0.4),
                0 0 40px rgba(255, 255, 255, 0.1)
              `
            }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
