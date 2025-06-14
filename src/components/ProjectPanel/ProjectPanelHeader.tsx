
import React from 'react';
import { motion } from 'framer-motion';
import { X, MoreVertical, Star } from 'lucide-react';
import { useLovableConfig } from '../../hooks/useLovableConfig';

interface ProjectPanelHeaderProps {
  title: string;
  status: 'success' | 'warning' | 'error' | 'info';
  onClose: () => void;
}

const statusColors = {
  success: 'from-green-500 to-green-600',
  warning: 'from-amber-500 to-amber-600',
  error: 'from-red-500 to-red-600',
  info: 'from-blue-500 to-blue-600'
};

const statusLabels = {
  success: 'مكتمل',
  warning: 'تحذير',
  error: 'خطأ',
  info: 'قيد التنفيذ'
};

export const ProjectPanelHeader: React.FC<ProjectPanelHeaderProps> = ({
  title,
  status,
  onClose
}) => {
  const config = useLovableConfig();

  return (
    <motion.div
      className="flex items-center justify-between p-6 border-b border-white/20"
      style={{
        background: config.theme.glass.bg,
        backdropFilter: config.theme.glass.backdrop,
        fontFamily: config.theme.font
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="flex items-center gap-4">
        <motion.button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/40 hover:bg-white/60 backdrop-blur-[20px] border border-white/30 flex items-center justify-center transition-all duration-200 group"
          aria-label="إغلاق"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <X size={18} className="text-gray-700 group-hover:text-gray-900" />
        </motion.button>

        <button className="w-10 h-10 rounded-full bg-white/40 hover:bg-white/60 backdrop-blur-[20px] border border-white/30 flex items-center justify-center transition-all duration-200">
          <MoreVertical size={18} className="text-gray-700" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 px-3 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-[10px] rounded-full transition-colors">
          <Star size={16} className="text-amber-500" />
          <span className="text-sm text-gray-700" style={{ fontFamily: config.theme.font }}>مفضل</span>
        </button>

        <motion.div
          className={`px-4 py-2 rounded-full text-sm font-medium text-white backdrop-blur-[10px] bg-gradient-to-r ${statusColors[status]} shadow-lg`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          style={{ fontFamily: config.theme.font }}
        >
          {statusLabels[status]}
        </motion.div>
        
        <motion.h1
          className="text-2xl font-bold text-gray-800"
          style={{ fontFamily: config.theme.font }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          {title}
        </motion.h1>
      </div>
    </motion.div>
  );
};
