
import React from 'react';
import { Plus, Calendar, Clock, FileText, Download, Edit } from 'lucide-react';
import { ProjectCardProps } from '@/components/ProjectCard/types';
import { motion } from 'framer-motion';

interface ProjectBoardActionBarProps {
  project: ProjectCardProps;
  tint: string;
}

const actions = [
  { id: 'edit', label: 'تعديل المشروع', icon: Edit },
  { id: 'add-task', label: 'إضافة مهمة', icon: Plus },
  { id: 'generate-days', label: 'فوائد الأيام', icon: Calendar },
  { id: 'time-tracker', label: 'تتبع الوقت', icon: Clock },
  { id: 'documents', label: 'المستندات', icon: FileText },
  { id: 'export', label: 'تصدير', icon: Download },
];

export const ProjectBoardActionBar: React.FC<ProjectBoardActionBarProps> = ({ project, tint }) => {
  return (
    <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
      {actions.map((action, index) => {
        const IconComponent = action.icon;
        return (
          <motion.button
            key={action.id}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-arabic text-gray-700 transition-all duration-200 hover:scale-105 border border-white/20"
            style={{
              '--hover-tint': tint,
            } as React.CSSProperties}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.25 }}
            whileHover={{
              backgroundColor: `${tint}40`,
              borderColor: `${tint}60`,
            }}
          >
            <IconComponent size={16} strokeWidth={1.5} />
            {action.label}
          </motion.button>
        );
      })}
    </div>
  );
};
