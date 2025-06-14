
import React, { useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useLovableConfig } from '../../hooks/useLovableConfig';

interface EnhancedMotionSystemProps {
  children: React.ReactNode;
  isVisible: boolean;
  onClose: () => void;
  isSidebarCollapsed: boolean;
}

export const EnhancedMotionSystem: React.FC<EnhancedMotionSystemProps> = ({
  children,
  isVisible,
  onClose,
  isSidebarCollapsed
}) => {
  const config = useLovableConfig();

  // معالجة النقر خارج اللوحة
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      console.log('إغلاق اللوحة بالنقر خارجها');
      onClose();
    }
  };

  const entryMotionVariants: Variants = {
    hidden: { 
      clipPath: 'inset(0 100% 0 0)',
      opacity: 0
    },
    visible: { 
      clipPath: 'inset(0 0 0 0)',
      opacity: 1,
      transition: {
        duration: config.entryMotion.panelGrow.duration,
        ease: config.entryMotion.panelGrow.easing as [number, number, number, number]
      }
    },
    exit: { 
      clipPath: 'inset(0 100% 0 0)',
      opacity: 0,
      transition: {
        duration: config.exitMotion.duration,
        ease: config.exitMotion.easing as [number, number, number, number]
      }
    }
  };

  const panelClasses = `fixed transition-all duration-500 ease-in-out ${
    isSidebarCollapsed ? 'operations-board-collapsed' : 'operations-board-expanded'
  }`;

  const panelStyles = {
    height: 'calc(100vh - 60px)',
    top: 'var(--sidebar-top-offset)',
    borderRadius: config.theme.radius,
    background: config.theme.glass.bg,
    backdropFilter: config.theme.glass.backdrop,
    overflow: 'hidden' as const,
    zIndex: 50,
    border: config.theme.glass.border,
    boxShadow: config.theme.glass.shadow
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[60]"
          style={{
            background: 'rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(4px)'
          }}
          onClick={handleBackdropClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className={panelClasses}
            style={panelStyles}
            variants={entryMotionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
