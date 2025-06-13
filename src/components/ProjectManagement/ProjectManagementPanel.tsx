
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Escape } from 'lucide-react';
import chroma from 'chroma-js';
import { ProjectHeader } from './ProjectHeader';
import { ProjectStepper } from './ProjectStepper';
import { ProjectToolbar } from './ProjectToolbar';
import { ProjectGrid } from './ProjectGrid';
import { ProjectPanelContext } from './ProjectPanelContext';

interface ProjectManagementPanelProps {
  project: {
    id: string;
    title: string;
    description: string;
    hex?: string;
    budget: number;
    status: 'success' | 'warning' | 'error' | 'info';
    progress: number;
  };
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectManagementPanel: React.FC<ProjectManagementPanelProps> = ({
  project,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);

  // إنشاء اللون الديناميكي
  const projectColor = useMemo(() => {
    if (!project.hex) return '#6366f1'; // fallback indigo
    try {
      return chroma(project.hex).brighten(0.4).hex();
    } catch {
      return '#6366f1';
    }
  }, [project.hex]);

  // إنشاء التدرج للخلفية
  const bgGradient = useMemo(() => {
    const color = chroma(projectColor);
    const hsl = color.hsl();
    return `linear-gradient(135deg, 
      hsl(${hsl[0]}, ${hsl[1] * 100}%, 96%, 0.8) 0%, 
      hsl(${(hsl[0] + 20) % 360}, ${hsl[1] * 100}%, 97%, 0.8) 50%, 
      hsl(${(hsl[0] + 40) % 360}, ${hsl[1] * 100}%, 95%, 0.8) 100%)`;
  }, [projectColor]);

  // معالجة إغلاق اللوحة بالـ Esc
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // تركيز لوحة المفاتيح عند الفتح
  useEffect(() => {
    if (isOpen) {
      const firstHeading = document.querySelector('[data-project-title]') as HTMLElement;
      if (firstHeading) {
        firstHeading.focus();
      }
    }
  }, [isOpen]);

  return (
    <ProjectPanelContext.Provider value={{
      project,
      activeTab,
      setActiveTab,
      isLoading,
      setIsLoading,
      projectColor
    }}>
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            role="dialog"
            aria-labelledby="project-title"
            className="fixed top-0 right-0 z-50 h-full font-arabic"
            style={{
              width: 'min(88vw, 960px)',
              background: bgGradient,
              backdropFilter: 'blur(20px)'
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
              duration: 0.45, 
              ease: [0.25, 0.1, 0.25, 1] 
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={(event, info) => {
              if (info.offset.x > 200) {
                onClose();
              }
            }}
          >
            {/* زر الإغلاق */}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 p-2 rounded-full bg-white/20 hover:bg-white/30 
                       backdrop-blur-sm border border-white/30 transition-all duration-200
                       hover:scale-105 active:scale-95 z-10"
              aria-label="إغلاق لوحة المشروع"
            >
              <X size={18} className="text-gray-700" />
            </button>

            {/* محتوى اللوحة */}
            <div className="h-full flex flex-col p-6 pt-16 overflow-hidden">
              {/* Header */}
              <div className="flex-shrink-0 mb-6">
                <ProjectHeader />
              </div>

              {/* Stepper */}
              <div className="flex-shrink-0 mb-6">
                <ProjectStepper />
              </div>

              {/* Toolbar */}
              <div className="flex-shrink-0 mb-6">
                <ProjectToolbar />
              </div>

              {/* Main Grid */}
              <div className="flex-1 min-h-0">
                <ProjectGrid />
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </ProjectPanelContext.Provider>
  );
};
