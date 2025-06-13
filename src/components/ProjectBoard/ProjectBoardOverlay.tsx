
import React, { Suspense, lazy, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { X, Settings, CheckSquare, DollarSign, Scale, Calendar, Users, BarChart3, Plus } from 'lucide-react';
import { useProjectBoard } from '@/contexts/ProjectBoardContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Lazy load tabs
const DashboardTab = lazy(() => import('./tabs/DashboardTab'));
const TasksTab = lazy(() => import('./tabs/TasksTab'));
const FinanceTab = lazy(() => import('./tabs/FinanceTab'));
const LegalTab = lazy(() => import('./tabs/LegalTab'));
const DaysTab = lazy(() => import('./tabs/DaysTab'));
const ClientTab = lazy(() => import('./tabs/ClientTab'));
const ReportsTab = lazy(() => import('./tabs/ReportsTab'));
const GenerateTab = lazy(() => import('./tabs/GenerateTab'));
const CalendarTab = lazy(() => import('./tabs/CalendarTab'));

const tabs = [
  { id: 'tasks', label: 'قائمة المهام', icon: CheckSquare },
  { id: 'finance', label: 'التفاصيل المالية', icon: DollarSign },
  { id: 'legal', label: 'الشؤون القانونية', icon: Scale },
  { id: 'client', label: 'معلومات العميل', icon: Users },
  { id: 'reports', label: 'تقارير المشروع', icon: BarChart3 },
  { id: 'calendar', label: 'تقويم المشروع', icon: Calendar },
];

const stages = ['التحضير', 'التخطيط', 'التنفيذ', 'المراجعة', 'المعالجة النهائية', 'التسليم'];

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/60"></div>
  </div>
);

export const ProjectBoardOverlay: React.FC = () => {
  const { selectedProject, closeBoard, isBoardOpen, boardTheme } = useProjectBoard();
  const [activeTab, setActiveTab] = useState('tasks');

  if (!selectedProject) return null;

  const currentStage = 2; // This should come from project data

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeBoard();
    }
  };

  const renderTabContent = (tabId: string) => {
    const commonProps = { project: selectedProject };
    
    switch (tabId) {
      case 'dashboard': return <DashboardTab {...commonProps} />;
      case 'tasks': return <TasksTab {...commonProps} />;
      case 'finance': return <FinanceTab {...commonProps} />;
      case 'legal': return <LegalTab {...commonProps} />;
      case 'days': return <DaysTab {...commonProps} />;
      case 'client': return <ClientTab {...commonProps} />;
      case 'reports': return <ReportsTab {...commonProps} />;
      case 'generate': return <GenerateTab {...commonProps} />;
      case 'calendar': return <CalendarTab {...commonProps} />;
      default: return <TasksTab {...commonProps} />;
    }
  };

  return createPortal(
    <AnimatePresence mode="wait">
      {isBoardOpen && (
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
            duration: 0.45,
            ease: [0.45, 0, 0.55, 1]
          }}
          onClick={handleOverlayClick}
        >
          <motion.div
            layoutId={`project-card-${selectedProject.id}`}
            className="relative rounded-[32px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
            style={{
              background: boardTheme.gradient,
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              width: '60vw',
              height: '85vh',
              maxWidth: '1200px',
              minWidth: '900px',
            }}
            initial={{ 
              width: '400px',
              height: '200px',
              borderRadius: '40px'
            }}
            animate={{ 
              width: '60vw',
              height: '85vh',
              borderRadius: '32px'
            }}
            exit={{
              width: '400px',
              height: '200px',
              borderRadius: '40px'
            }}
            transition={{ 
              duration: 0.45,
              ease: [0.45, 0, 0.55, 1]
            }}
          >
            {/* Header */}
            <motion.div 
              className="flex items-center justify-between p-6 border-b border-white/10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <div className="flex-1">
                {/* Project Title */}
                <div className="flex items-center gap-4 mb-4">
                  <h1 className="text-2xl font-bold font-arabic text-white">
                    {selectedProject.title}
                  </h1>
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: boardTheme.main }}
                  />
                </div>

                {/* Progress Stepper */}
                <div className="flex items-center gap-2 mb-3">
                  {stages.map((stage, index) => (
                    <React.Fragment key={stage}>
                      <motion.div 
                        className={`
                          px-3 py-1 rounded-full text-sm font-arabic transition-all duration-300
                          ${index <= currentStage 
                            ? 'bg-white/40 text-white border border-white/60' 
                            : 'bg-white/10 text-white/60 border border-white/20'
                          }
                        `}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 + (index * 0.03) }}
                      >
                        {stage}
                      </motion.div>
                      {index < stages.length - 1 && (
                        <div className="w-3 h-0.5 bg-white/30 rounded-full" />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Quick Actions */}
                <motion.div 
                  className="flex items-center gap-2 mb-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-sm text-white font-arabic transition-all duration-200 hover:scale-105">
                    <Plus size={14} strokeWidth={1.5} />
                    إضافة مهمة
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-sm text-white font-arabic transition-all duration-200 hover:scale-105">
                    <Settings size={14} strokeWidth={1.5} />
                    توليد المهام
                  </button>
                </motion.div>

                {/* Meta Badges */}
                <motion.div 
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <span className="px-3 py-1 bg-white/30 rounded-full text-sm text-white font-arabic">
                    {selectedProject.daysLeft} يوم متبقي
                  </span>
                  <span className="px-3 py-1 bg-white/30 rounded-full text-sm text-white font-arabic">
                    {selectedProject.tasksCount} مهام
                  </span>
                  <span className="px-3 py-1 bg-white/30 rounded-full text-sm text-white font-arabic">
                    {selectedProject.value}
                  </span>
                  <span className="px-3 py-1 bg-white/30 rounded-full text-sm text-white font-arabic">
                    المالك: {selectedProject.owner}
                  </span>
                </motion.div>
              </div>

              <motion.button
                onClick={closeBoard}
                className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 text-white hover:scale-110"
                aria-label="إغلاق لوحة المشروع"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={20} strokeWidth={1.5} />
              </motion.button>
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
              className="flex-1 flex flex-col h-[calc(100%-120px)]"
            >
              <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl" className="flex-1 flex flex-col h-full">
                <div className="px-6 py-4 border-b border-white/10">
                  <TabsList className="grid grid-cols-6 gap-2 bg-transparent h-auto p-1">
                    {tabs.map((tab, index) => {
                      const IconComponent = tab.icon;
                      return (
                        <motion.div
                          key={tab.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + (index * 0.03) }}
                        >
                          <TabsTrigger 
                            value={tab.id}
                            className="flex flex-col items-center gap-2 p-3 text-xs font-arabic rounded-2xl transition-all duration-300 data-[state=active]:bg-white/30 data-[state=active]:text-white data-[state=inactive]:bg-white/10 data-[state=inactive]:text-white/70 hover:bg-white/20 hover:scale-105"
                          >
                            <IconComponent size={18} strokeWidth={1.5} />
                            <span>{tab.label}</span>
                          </TabsTrigger>
                        </motion.div>
                      );
                    })}
                  </TabsList>
                </div>

                <div className="flex-1 overflow-hidden">
                  <Suspense fallback={<LoadingSpinner />}>
                    <AnimatePresence mode="wait">
                      {tabs.map(tab => (
                        <TabsContent key={tab.id} value={tab.id} className="h-full m-0 p-6">
                          <motion.div
                            key={`${tab.id}-content`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ 
                              duration: 0.3,
                              ease: [0.45, 0, 0.55, 1]
                            }}
                            className="h-full"
                          >
                            {renderTabContent(tab.id)}
                          </motion.div>
                        </TabsContent>
                      ))}
                    </AnimatePresence>
                  </Suspense>
                </div>
              </Tabs>
            </motion.div>

            {/* Glassmorphism overlay effect */}
            <div 
              className="absolute inset-0 pointer-events-none rounded-[32px]"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
