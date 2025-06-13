
import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Zap, Edit, FileText } from 'lucide-react';

export const DashboardQuickActions: React.FC = () => {
  const actions = [
    { icon: Plus, label: 'مهمة جديدة', color: 'from-green-400 to-green-600' },
    { icon: Zap, label: 'توليد ذكي', color: 'from-yellow-400 to-yellow-600' },
    { icon: Edit, label: 'تعديل المشروع', color: 'from-purple-400 to-purple-600' },
    { icon: FileText, label: 'تقرير جديد', color: 'from-indigo-400 to-indigo-600' }
  ];

  return (
    <div className="h-full bg-white/40 backdrop-blur-[20px] border border-white/30 rounded-[20px] p-6 flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 font-arabic" style={{ fontFamily: 'IBM Plex Sans Arabic' }}>
          إجراءات سريعة
        </h3>
      </div>

      {/* Actions Grid */}
      <div className="flex-1 grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <motion.button
            key={action.label}
            className={`bg-gradient-to-br ${action.color} rounded-[16px] p-4 flex flex-col items-center justify-center text-white transition-all duration-200 hover:scale-105 active:scale-95`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <action.icon size={24} className="mb-2" />
            <span className="text-xs font-medium font-arabic text-center" style={{ fontFamily: 'IBM Plex Sans Arabic' }}>
              {action.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
