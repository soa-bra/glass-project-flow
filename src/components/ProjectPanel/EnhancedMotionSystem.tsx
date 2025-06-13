
import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface EnhancedMotionSystemProps {
  children: React.ReactNode;
  isVisible: boolean;
  onClose: () => void;
}

const entryMotionVariants: Variants = {
  hidden: { 
    x: '-100%',
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
    x: '-100%',
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 1, 1] as const
    }
  }
};

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

export const EnhancedMotionSystem: React.FC<EnhancedMotionSystemProps> = ({
  children,
  isVisible,
  onClose
}) => {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-start"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          style={{
            backdropFilter: 'blur(20px)',
            background: 'rgba(0, 0, 0, 0.15)'
          }}
        >
          <motion.div
            className="h-full flex flex-col"
            variants={entryMotionVariants}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 'calc(100% - var(--projects-width))',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.25) 100%)',
              backdropFilter: 'blur(20px) saturate(180%)',
              borderRadius: '0 20px 20px 0',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: `
                4px 0 20px rgba(0, 0, 0, 0.08),
                inset 0 1px 0 rgba(255, 255, 255, 0.4),
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
