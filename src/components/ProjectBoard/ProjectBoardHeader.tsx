
import React from 'react';
import { X, Settings, ChevronRight } from 'lucide-react';
import { ProjectCardProps } from '@/components/ProjectCard/types';
import { motion } from 'framer-motion';

interface ProjectBoardHeaderProps {
  project: ProjectCardProps;
  onClose: () => void;
}

const stages = ['التخطيط', 'التحليل', 'التطوير', 'المراجعة', 'الاختبار', 'التسليم'];

export const ProjectBoardHeader: React.FC<ProjectBoardHeaderProps> = ({ project, onClose }) => {
  const currentStage = 2; // This should come from project data

  return (
    <motion.div 
      className="flex items-center justify-between p-6 border-b border-white/20"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex-1">
        {/* Project Title and Description */}
        <motion.div 
          className="mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <h1 className="text-[32px] font-bold font-arabic text-gray-800 leading-tight mb-2">
            {project.title}
          </h1>
          <p className="text-gray-600 font-arabic text-base">
            {project.description}
          </p>
        </motion.div>

        {/* Stage Tracker */}
        <motion.div 
          className="flex items-center gap-2 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {stages.map((stage, index) => (
            <React.Fragment key={stage}>
              <div className={`
                px-3 py-1.5 rounded-full text-sm font-arabic transition-all duration-300 border
                ${index <= currentStage 
                  ? 'bg-white/40 text-gray-800 border-white/60 shadow-sm' 
                  : 'bg-white/20 text-gray-500 border-white/30'
                }
              `}>
                {stage}
              </div>
              {index < stages.length - 1 && (
                <ChevronRight 
                  size={14} 
                  className={index < currentStage ? 'text-gray-600' : 'text-gray-400'} 
                />
              )}
            </React.Fragment>
          ))}
        </motion.div>

        {/* Project Meta */}
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <span className="px-3 py-1 bg-white/30 rounded-full text-sm text-gray-700 font-arabic border border-white/20">
            {project.daysLeft} يوم متبقي
          </span>
          <span className="px-3 py-1 bg-white/30 rounded-full text-sm text-gray-700 font-arabic border border-white/20">
            {project.tasksCount} مهام
          </span>
          <span className="px-3 py-1 bg-white/30 rounded-full text-sm text-gray-700 font-arabic border border-white/20">
            {project.value}
          </span>
        </motion.div>
      </div>

      {/* Controls */}
      <motion.div 
        className="flex items-center gap-3"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <button className="p-2.5 rounded-full bg-white/30 hover:bg-white/40 transition-colors duration-200 text-gray-700 border border-white/20">
          <Settings size={18} strokeWidth={1.5} />
        </button>
        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-white/30 hover:bg-white/40 transition-colors duration-200 text-gray-700 border border-white/20"
        >
          <X size={18} strokeWidth={1.5} />
        </button>
      </motion.div>
    </motion.div>
  );
};
