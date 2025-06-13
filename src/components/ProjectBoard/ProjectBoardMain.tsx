
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, FileText, Settings, Calendar, CheckSquare, DollarSign, Scale, Users, BarChart3 } from 'lucide-react';
import { ProjectCardProps } from '@/components/ProjectCard/types';
import { ProjectBoardHeader } from './ProjectBoardHeader';
import { ProjectBoardTabs } from './ProjectBoardTabs';

interface ProjectBoardMainProps {
  project: ProjectCardProps;
  onClose: () => void;
  isVisible: boolean;
}

const tabs = [
  { id: 'tasks', label: 'قائمة المهام', icon: CheckSquare },
  { id: 'finance', label: 'التفاصيل المالية', icon: DollarSign },
  { id: 'legal', label: 'الشؤون القانونية', icon: Scale },
  { id: 'client', label: 'معلومات العميل', icon: Users },
  { id: 'reports', label: 'تقارير المشروع', icon: BarChart3 },
  { id: 'calendar', label: 'تقويم المشروع', icon: Calendar },
];

const stages = ['التحضير', 'التخطيط', 'التنفيذ', 'المراجعة', 'المعالجة النهائية', 'التسليم'];

export const ProjectBoardMain: React.FC<ProjectBoardMainProps> = ({
  project,
  onClose,
  isVisible
}) => {
  const [activeTab, setActiveTab] = useState('tasks');
  const currentStage = 2;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ 
            background: 'rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(4px)'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.25,
            ease: [0.4, 0.0, 0.2, 1]
          }}
          onClick={handleOverlayClick}
        >
          <motion.div
            layoutId={`project-card-${project.id}`}
            className="relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
            style={{
              background: 'linear-gradient(135deg, rgba(125, 107, 255, 0.8) 0%, rgba(255, 200, 92, 0.6) 50%, rgba(125, 107, 255, 0.8) 100%)',
              backdropFilter: 'blur(14px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '24px',
              boxShadow: 'inset 0 0 24px rgba(255,255,255,0.25)',
            }}
            initial={{ 
              width: '380px',
              height: '200px',
              borderRadius: '40px'
            }}
            animate={{ 
              width: '85vw',
              height: '90vh',
              borderRadius: '24px'
            }}
            exit={{
              width: '380px',
              height: '200px',
              borderRadius: '40px'
            }}
            transition={{ 
              duration: 0.25,
              ease: [0.4, 0.0, 0.2, 1],
              layout: {
                duration: 0.35,
                ease: [0.4, 0.0, 0.2, 1],
                delay: 0.25
              }
            }}
          >
            {/* Header */}
            <motion.div 
              className="relative z-10 p-6 border-b border-white/20"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.2 }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  {/* Project Title */}
                  <div className="flex items-center gap-4 mb-4">
                    <h1 className="text-3xl font-bold font-arabic text-white">
                      {project.title}
                    </h1>
                    <div className="w-3 h-3 rounded-full bg-white/60" />
                  </div>

                  {/* Project Description */}
                  <p className="text-white/80 font-arabic text-lg mb-6 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Progress Stepper */}
                  <div className="flex items-center gap-2 mb-4">
                    {stages.map((stage, index) => (
                      <React.Fragment key={stage}>
                        <motion.div 
                          className={`
                            px-4 py-2 rounded-full text-sm font-arabic transition-all duration-300
                            ${index <= currentStage 
                              ? 'bg-white/40 text-white border border-white/60' 
                              : 'bg-white/10 text-white/60 border border-white/20'
                            }
                          `}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.7 + (index * 0.05) }}
                        >
                          {stage}
                        </motion.div>
                        {index < stages.length - 1 && (
                          <div className="w-4 h-0.5 bg-white/30 rounded-full" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <motion.div 
                    className="flex items-center gap-3 mb-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <motion.button 
                      className="flex items-center gap-2 px-4 py-2 bg-white/30 hover:bg-white/40 rounded-full text-sm text-white font-arabic transition-all duration-200"
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 1 }}
                    >
                      <Plus size={16} strokeWidth={1.5} />
                      إضافة مهمة
                    </motion.button>
                    
                    <motion.button 
                      className="flex items-center gap-2 px-4 py-2 bg-white/30 hover:bg-white/40 rounded-full text-sm text-white font-arabic transition-all duration-200"
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 1 }}
                    >
                      <FileText size={16} strokeWidth={1.5} />
                      توليد تقرير PDF
                    </motion.button>
                    
                    <motion.button 
                      className="flex items-center gap-2 px-4 py-2 bg-white/30 hover:bg-white/40 rounded-full text-sm text-white font-arabic transition-all duration-200"
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 1 }}
                    >
                      <Settings size={16} strokeWidth={1.5} />
                      تعديل المشروع
                    </motion.button>
                  </motion.div>

                  {/* Meta Badges */}
                  <motion.div 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <span className="px-4 py-2 bg-white/30 rounded-full text-sm text-white font-arabic">
                      {project.daysLeft} يوم متبقي
                    </span>
                    <span className="px-4 py-2 bg-white/30 rounded-full text-sm text-white font-arabic">
                      {project.tasksCount} مهام
                    </span>
                    <span className="px-4 py-2 bg-white/30 rounded-full text-sm text-white font-arabic">
                      {project.value}
                    </span>
                    <span className="px-4 py-2 bg-white/30 rounded-full text-sm text-white font-arabic">
                      المالك: {project.owner}
                    </span>
                  </motion.div>
                </div>

                <motion.button
                  onClick={onClose}
                  className="p-3 rounded-full bg-white/30 hover:bg-white/40 transition-colors duration-200 text-white"
                  aria-label="إغلاق لوحة المشروع"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={24} strokeWidth={1.5} />
                </motion.button>
              </div>
            </motion.div>

            {/* Tabs Section */}
            <ProjectBoardTabs 
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              project={project}
            />

            {/* Glassmorphism overlay effect */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '24px',
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
