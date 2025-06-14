
import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Zap, Edit, Share, Settings } from 'lucide-react';
import { useLovableConfig } from '../../hooks/useLovableConfig';

interface EnhancedQuickActionsGridProps {
  onAddTask?: () => void;
  onSmartGen?: () => void;
  onEditProj?: () => void;
  onShare?: () => void;
  onSettings?: () => void;
}

const iconMap = {
  plus: Plus,
  zap: Zap,
  edit: Edit,
  share: Share,
  settings: Settings
};

export const EnhancedQuickActionsGrid: React.FC<EnhancedQuickActionsGridProps> = ({
  onAddTask,
  onSmartGen,
  onEditProj,
  onShare,
  onSettings
}) => {
  const config = useLovableConfig();
  
  const handlers = {
    onAddTask,
    onSmartGen,
    onEditProj,
    onShare,
    onSettings
  };

  return (
    <motion.div
      className="grid grid-cols-5 gap-3 p-4 rounded-[20px]"
      style={{
        background: config.theme.glass.bg,
        backdropFilter: config.theme.glass.backdrop,
        border: config.theme.glass.border,
        boxShadow: config.theme.glass.shadow
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        ease: config.theme.ease as [number, number, number, number] 
      }}
    >
      {config.quickActions.map((action, index) => {
        const IconComponent = iconMap[action.icon as keyof typeof iconMap];
        const handler = handlers[action.handler as keyof typeof handlers];
        
        return (
          <motion.button
            key={action.text}
            onClick={handler}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-[15px] text-white font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ 
              backgroundColor: action.color,
              fontFamily: config.theme.font
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.1,
              ease: config.theme.ease as [number, number, number, number]
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <IconComponent size={20} />
            <span className="text-xs text-center leading-tight">{action.text}</span>
          </motion.button>
        );
      })}
    </motion.div>
  );
};
