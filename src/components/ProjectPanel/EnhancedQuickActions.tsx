
import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Zap, Edit3 } from 'lucide-react';

interface EnhancedQuickActionsProps {
  onAddTask: () => void;
  onSmartGenerate: () => void;
  onEditProject: () => void;
}

export const EnhancedQuickActions: React.FC<EnhancedQuickActionsProps> = ({
  onAddTask,
  onSmartGenerate,
  onEditProject
}) => {
  const actions = [
    {
      text: 'إضافة مهمة',
      icon: Plus,
      onClick: onAddTask,
      className: 'bg-sky-500 hover:bg-sky-600'
    },
    {
      text: 'توليد ذكي',
      icon: Zap,
      onClick: onSmartGenerate,
      className: 'bg-amber-500 hover:bg-amber-600'
    },
    {
      text: 'تعديل المشروع',
      icon: Edit3,
      onClick: onEditProject,
      className: 'bg-gray-500 hover:bg-gray-600'
    }
  ];

  return (
    <motion.div
      className="grid grid-cols-3 md:flex gap-3 p-4 bg-white/20 backdrop-blur-[10px] rounded-[20px] border border-white/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      style={{ gridColumn: '1 / 4', gridRow: 2 }}
    >
      {actions.map((action, index) => (
        <motion.button
          key={action.text}
          onClick={action.onClick}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-[15px] text-white font-medium transition-colors font-arabic ${action.className}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.3, 
            delay: 0.3 + (index * 0.1),
            type: "spring",
            stiffness: 200,
            damping: 20
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <action.icon size={20} />
          <span className="hidden md:inline">{action.text}</span>
        </motion.button>
      ))}
    </motion.div>
  );
};
