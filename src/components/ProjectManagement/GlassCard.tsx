
import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  expanded?: boolean;
  onClick?: () => void;
  layoutId?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  expanded = false,
  onClick,
  layoutId
}) => {
  return (
    <motion.div
      layoutId={layoutId}
      onClick={onClick}
      className={`
        bg-white/10 backdrop-blur-md border border-white/6 rounded-[22px]
        shadow-inner shadow-white/5 transition-all duration-200
        hover:bg-white/15 hover:shadow-md overflow-hidden
        ${onClick ? 'cursor-pointer' : ''}
        ${expanded ? 'col-span-4 row-span-2' : ''}
        ${className}
      `}
      initial={expanded ? { scale: 0.9, opacity: 0 } : false}
      animate={expanded ? { scale: 1, opacity: 1 } : {}}
      transition={{
        duration: 0.35,
        ease: [0.25, 0.8, 0.25, 1]
      }}
      whileHover={{ scale: onClick ? 1.02 : 1 }}
      whileTap={{ scale: onClick ? 0.98 : 1 }}
    >
      {children}
    </motion.div>
  );
};
