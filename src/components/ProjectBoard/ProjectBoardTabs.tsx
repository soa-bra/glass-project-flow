
import React, { Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectCardProps } from '@/components/ProjectCard/types';

// Lazy load tabs
const TasksTab = lazy(() => import('./tabs/TasksTab'));
const FinanceTab = lazy(() => import('./tabs/FinanceTab'));
const LegalTab = lazy(() => import('./tabs/LegalTab'));
const ClientTab = lazy(() => import('./tabs/ClientTab'));
const ReportsTab = lazy(() => import('./tabs/ReportsTab'));
const CalendarTab = lazy(() => import('./tabs/CalendarTab'));

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface ProjectBoardTabsProps {
  tabs: Tab[];
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  project: ProjectCardProps;
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/60"></div>
  </div>
);

export const ProjectBoardTabs: React.FC<ProjectBoardTabsProps> = ({
  tabs,
  activeTab,
  setActiveTab,
  project
}) => {
  const renderTabContent = (tabId: string) => {
    const commonProps = { project };
    
    switch (tabId) {
      case 'tasks': return <TasksTab {...commonProps} />;
      case 'finance': return <FinanceTab {...commonProps} />;
      case 'legal': return <LegalTab {...commonProps} />;
      case 'client': return <ClientTab {...commonProps} />;
      case 'reports': return <ReportsTab {...commonProps} />;
      case 'calendar': return <CalendarTab {...commonProps} />;
      default: return <TasksTab {...commonProps} />;
    }
  };

  const activeTabIndex = tabs.findIndex(tab => tab.id === activeTab);
  const previousTabIndex = React.useRef(activeTabIndex);
  const direction = activeTabIndex > previousTabIndex.current ? 1 : -1;
  
  React.useEffect(() => {
    previousTabIndex.current = activeTabIndex;
  }, [activeTabIndex]);

  return (
    <motion.div
      className="flex-1 flex flex-col h-[calc(100%-200px)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0, duration: 0.2 }}
    >
      {/* Tab Navigation */}
      <div className="relative px-6 py-4 border-b border-white/20">
        <div className="flex items-center gap-2 overflow-x-auto">
          {tabs.map((tab, index) => {
            const IconComponent = tab.icon;
            const isActive = tab.id === activeTab;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative flex items-center gap-2 px-6 py-3 rounded-full text-sm font-arabic transition-all duration-300 whitespace-nowrap
                  ${isActive 
                    ? 'bg-white/40 text-white border border-white/60' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }
                `}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + (index * 0.05) }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <IconComponent size={18} strokeWidth={1.5} />
                <span>{tab.label}</span>
                
                {/* Neon underline for active tab */}
                {isActive && (
                  <motion.div
                    className="absolute -bottom-1 left-1/2 w-1/2 h-0.5 bg-white rounded-full"
                    style={{
                      boxShadow: '0 0 6px currentColor',
                    }}
                    layoutId="activeTabIndicator"
                    initial={false}
                    transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 relative overflow-hidden">
        <Suspense fallback={<LoadingSpinner />}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeTab}
              custom={direction}
              initial={{ 
                x: direction > 0 ? '100%' : '-100%',
                opacity: 0 
              }}
              animate={{ 
                x: 0,
                opacity: 1 
              }}
              exit={{ 
                x: direction > 0 ? '-100%' : '100%',
                opacity: 0 
              }}
              transition={{ 
                duration: 0.4,
                ease: [0.4, 0.0, 0.2, 1]
              }}
              className="absolute inset-0 p-6"
            >
              {renderTabContent(activeTab)}
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </div>
    </motion.div>
  );
};
