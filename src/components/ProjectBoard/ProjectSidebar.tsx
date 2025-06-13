
import React from 'react';
import { motion } from 'framer-motion';
import { ProjectCardProps } from '@/components/ProjectCard/types';

interface ProjectSidebarProps {
  project: ProjectCardProps;
  tint: string;
}

export const ProjectSidebar: React.FC<ProjectSidebarProps> = ({ project, tint }) => {
  return (
    <motion.div 
      className="w-80 border-r border-white/20 p-6 bg-white/10"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.3 }}
    >
      <h3 className="text-lg font-bold font-arabic text-gray-800 mb-4">قائمة المهام المصغرة</h3>
      
      {/* Mini Project Card */}
      <motion.div 
        className="p-4 rounded-2xl border border-white/30 mb-4"
        style={{ 
          background: `linear-gradient(135deg, ${tint}20 0%, ${tint}10 100%)`,
          backdropFilter: 'blur(10px)'
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <h4 className="font-semibold font-arabic text-gray-800 mb-2">
          {project.title}
        </h4>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{project.daysLeft} يوم</span>
          <span>{project.tasksCount} مهام</span>
          <span>{project.value}</span>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div 
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/20">
          <div className="text-sm text-gray-600 font-arabic">التقدم الإجمالي</div>
          <div className="text-xl font-bold text-gray-800">67%</div>
        </div>
        
        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/20">
          <div className="text-sm text-gray-600 font-arabic">المهام المكتملة</div>
          <div className="text-xl font-bold" style={{ color: tint }}>
            {Math.floor(project.tasksCount * 0.6)}/{project.tasksCount}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
