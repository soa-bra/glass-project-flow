
import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Zap, Edit, Share, Settings } from 'lucide-react';
import { useLovableConfig } from '../../hooks/useLovableConfig';

const iconMap = {
  plus: Plus,
  zap: Zap,
  edit: Edit,
  share: Share,
  settings: Settings
};

export const RedesignedQuickActionsGrid: React.FC = () => {
  const config = useLovableConfig();
  return (
    <motion.div
      className="grid grid-cols-5 gap-3 px-4 py-2 rounded-[20px]"
      style={{
        background: config.theme.glass.bg,
        backdropFilter: config.theme.glass.backdrop,
        border: config.theme.glass.border,
        boxShadow: config.theme.glass.shadow,
        alignItems: 'end'
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: config.theme.ease as [number, number, number, number]
      }}
    >
      {config.quickActions.map((action, idx) => {
        const IconComponent = iconMap[action.icon as keyof typeof iconMap];
        return (
          <motion.button
            type="button"
            key={action.text}
            className="flex flex-col items-center justify-end gap-2 p-3 rounded-[14px] font-bold border-none transition-all duration-150 shadow-md hover:scale-105 hover:shadow-lg active:scale-95"
            style={{
              background: action.color,
              color: 'white',
              fontFamily: config.theme.font,
              minHeight: 72
            }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.27, delay: idx * 0.1,
              ease: config.theme.ease as [number, number, number, number]
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
          >
            <IconComponent size={22} />
            <span className="text-xs text-center">{action.text}</span>
          </motion.button>
        )
      })}
    </motion.div>
  );
};
