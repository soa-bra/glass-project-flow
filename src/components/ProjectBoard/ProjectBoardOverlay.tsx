
import React, { Suspense, lazy } from 'react';
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

const tabs = [
  { id: 'dashboard', label: 'التحكم', icon: Settings },
  { id: 'tasks', label: 'المهام', icon: CheckSquare },
  { id: 'finance', label: 'التفاصيل المالية', icon: DollarSign },
  { id: 'legal', label: 'الشؤون القانونية', icon: Scale },
  { id: 'days', label: 'قائمة الأيام', icon: Calendar },
  { id: 'client', label: 'معلومات العميل', icon: Users },
  { id: 'reports', label: 'تقارير المشروع', icon: BarChart3 },
  { id: 'generate', label: 'توليد المهام', icon: Plus },
];

const stages = ['التخطيط', 'التطوير', 'المراجعة', 'التسليم'];

export const ProjectBoardOverlay: React.FC = () => {
  const { selectedProject, closeBoard, isBoardOpen, boardTheme } = useProjectBoard();
  const [activeTab, setActiveTab] = React.useState('dashboard');

  if (!selectedProject) return null;

  const currentStage = 1; // This should come from project data

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
      default: return <DashboardTab {...commonProps} />;
    }
  };

  return createPortal(
    <AnimatePresence mode="wait">
      {isBoardOpen && (
        <motion.div
          layoutId={`project-card-${selectedProject.id}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ 
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.45,
            ease: [0.25, 0.8, 0.25, 1]
          }}
        >
          <motion.div
            className="w-full max-w-6xl h-[90vh] rounded-[36px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,.12)]"
            style={{
              background: boardTheme.gradient,
              backdropFilter: 'blur(20px)',
            }}
            layoutId={`project-content-${selectedProject.id}`}
            transition={{ 
              duration: 0.45,
              ease: [0.25, 0.8, 0.25, 1]
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <div className="flex-1">
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
                      <div className={`
                        px-3 py-1 rounded-full text-sm font-arabic transition-all duration-300
                        ${index <= currentStage 
                          ? 'bg-white/40 text-white border border-white/60' 
                          : 'bg-white/10 text-white/60 border border-white/20'
                        }
                      `}>
                        {stage}
                      </div>
                      {index < stages.length - 1 && (
                        <div className="w-4 h-0.5 bg-white/30 rounded-full" />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Badges */}
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-white/30 rounded-full text-sm text-white font-arabic">
                    {selectedProject.daysLeft} يوم متبقي
                  </span>
                  <span className="px-3 py-1 bg-white/30 rounded-full text-sm text-white font-arabic">
                    {selectedProject.tasksCount} مهام
                  </span>
                  <span className="px-3 py-1 bg-white/30 rounded-full text-sm text-white font-arabic">
                    {selectedProject.value}
                  </span>
                </div>
              </div>

              <button
                onClick={closeBoard}
                className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 text-white"
                aria-label="إغلاق لوحة المشروع"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl" className="flex-1 flex flex-col h-full">
              <div className="px-6 py-4 border-b border-white/10">
                <TabsList className="grid grid-cols-4 lg:grid-cols-8 gap-2 bg-transparent h-auto">
                  {tabs.map(tab => {
                    const IconComponent = tab.icon;
                    return (
                      <TabsTrigger 
                        key={tab.id} 
                        value={tab.id} 
                        className="flex flex-col items-center gap-2 p-3 text-xs font-arabic rounded-2xl transition-all duration-300 data-[state=active]:bg-white/30 data-[state=active]:text-white data-[state=inactive]:bg-white/10 data-[state=inactive]:text-white/70 hover:bg-white/20"
                      >
                        <IconComponent size={18} strokeWidth={1.5} />
                        <span className="hidden sm:block">{tab.label}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </div>

              <div className="flex-1 overflow-hidden">
                <Suspense fallback={
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                }>
                  {tabs.map(tab => (
                    <TabsContent key={tab.id} value={tab.id} className="h-full m-0 p-6">
                      {renderTabContent(tab.id)}
                    </TabsContent>
                  ))}
                </Suspense>
              </div>
            </Tabs>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
