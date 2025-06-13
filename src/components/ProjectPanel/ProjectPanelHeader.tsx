
import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface ProjectPanelHeaderProps {
  title: string;
  status: 'success' | 'warning' | 'error' | 'info';
  onClose: () => void;
}

const statusColors = {
  success: '#00bb88',
  warning: '#ffb500',
  error: '#f4767f',
  info: '#2f6ead'
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
  return (
    <motion.div
      className="flex items-center justify-between p-6 border-b border-white/30"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <motion.button
        onClick={onClose}
        className="w-10 h-10 rounded-full bg-white/40 hover:bg-white/60 backdrop-blur-[20px] border border-white/30 flex items-center justify-center transition-all duration-200"
        aria-label="إغلاق"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <X size={18} className="text-gray-700" />
      </motion.button>

      <div className="flex items-center gap-4">
        <motion.div
          className="px-4 py-2 rounded-full text-sm font-medium text-white backdrop-blur-[10px]"
          style={{ backgroundColor: statusColors[status] }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {statusLabels[status]}
        </motion.div>
        
        <motion.h1
          className="text-2xl font-bold text-gray-800 font-arabic"
          style={{ fontFamily: 'IBM Plex Sans Arabic' }}
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
