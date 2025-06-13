
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
    opacity: 0.4,
    transition: {
      duration: 0.25,
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
      duration: 0.4,
      delayChildren: 0.05,
      staggerChildren: 0.05
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

const contentVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
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
        <>
          {/* Backdrop للعمود الأوسط فقط */}
          <motion.div
            className="absolute inset-0 z-[999]"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              backdropFilter: 'blur(6px)',
              background: 'rgba(255, 255, 255, 0.1)'
            }}
          />
          
          {/* اللوحة الرئيسية */}
          <motion.div
            className="absolute top-0 left-0 h-full z-[1000] flex flex-col"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              width: 'calc(100% - var(--projects-width))',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.18) 100%)',
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
            <motion.div variants={contentVariants} className="flex-1 overflow-hidden">
              {children}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
