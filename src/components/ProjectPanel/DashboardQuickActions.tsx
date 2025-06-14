
import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Zap, Edit, FileText, Settings, Share } from 'lucide-react';

export const DashboardQuickActions: React.FC = () => {
  const actions = [
    { icon: Plus, label: 'مهمة جديدة', color: 'from-emerald-400 to-emerald-600', hoverColor: 'hover:from-emerald-500 hover:to-emerald-700' },
    { icon: Zap, label: 'توليد ذكي', color: 'from-amber-400 to-amber-600', hoverColor: 'hover:from-amber-500 hover:to-amber-700' },
    { icon: Edit, label: 'تعديل', color: 'from-violet-400 to-violet-600', hoverColor: 'hover:from-violet-500 hover:to-violet-700' },
    { icon: FileText, label: 'تقرير', color: 'from-cyan-400 to-cyan-600', hoverColor: 'hover:from-cyan-500 hover:to-cyan-700' },
    { icon: Settings, label: 'الإعدادات', color: 'from-slate-400 to-slate-600', hoverColor: 'hover:from-slate-500 hover:to-slate-700' },
    { icon: Share, label: 'مشاركة', color: 'from-rose-400 to-rose-600', hoverColor: 'hover:from-rose-500 hover:to-rose-700' }
  ];

  return (
    <div className="h-full bg-white/40 backdrop-blur-[20px] border border-white/30 rounded-[20px] p-6 flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 font-arabic" style={{ fontFamily: 'IBM Plex Sans Arabic' }}>
          إجراءات سريعة
        </h3>
        <p className="text-sm text-gray-600 font-arabic mt-1">أدوات سريعة لإدارة المشروع</p>
      </div>

      {/* Actions Grid */}
      <div className="flex-1 grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <motion.button
            key={action.label}
            className={`bg-gradient-to-br ${action.color} ${action.hoverColor} rounded-[16px] p-4 flex flex-col items-center justify-center text-white transition-all duration-300 shadow-lg hover:shadow-xl`}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <action.icon size={24} className="mb-2" />
            <span className="text-xs font-medium font-arabic text-center leading-tight" style={{ fontFamily: 'IBM Plex Sans Arabic' }}>
              {action.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
