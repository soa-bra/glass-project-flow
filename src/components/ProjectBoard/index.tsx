
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Wallet, Scale, FileText, BarChart3, Settings } from 'lucide-react';
import { useProjectSelection } from '@/contexts/ProjectSelectionContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProjectBoardHeader } from './ProjectBoardHeader';
import { ProjectBoardToolbar } from './ProjectBoardToolbar';
import { DaysPanel } from './panels/DaysPanel';
import { FinancePanel } from './panels/FinancePanel';
import { LegalPanel } from './panels/LegalPanel';
import { WorkInfoPanel } from './panels/WorkInfoPanel';
import { ReportsPanel } from './panels/ReportsPanel';
import { CustomPanel } from './panels/CustomPanel';

const tabs = [
  { id: 'days', label: 'قائمة الأيام', icon: Calendar },
  { id: 'finance', label: 'التفاصيل المالية', icon: Wallet },
  { id: 'legal', label: 'الشؤون القانونية', icon: Scale },
  { id: 'work-info', label: 'معلومات العمل', icon: FileText },
  { id: 'reports', label: 'تقرير المشروع', icon: BarChart3 },
  { id: 'custom', label: 'تبويب مخصص', icon: Settings },
];

export const ProjectBoard = ({
  isSidebarCollapsed
}: {
  isSidebarCollapsed: boolean;
}) => {
  const { activeProject, setActiveProject, boardColor, isProjectBoardOpen } = useProjectSelection();
  const [activeTab, setActiveTab] = useState('days');

  if (!activeProject) return null;

  const handleClose = () => {
    setActiveProject(null);
  };

  return (
    <motion.div
      className={`fixed h-[calc(100vh-60px)] ${isSidebarCollapsed ? 'project-board-collapsed' : 'project-board-expanded'}`}
      style={{
        top: 'var(--sidebar-top-offset)',
        '--board-bg': boardColor,
        background: `linear-gradient(135deg, ${boardColor}, rgba(255, 255, 255, 0.5))`,
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        overflow: 'hidden',
        zIndex: 25,
      } as React.CSSProperties}
      initial={{ x: '-100%', opacity: 0 }}
      animate={{ x: isProjectBoardOpen ? 0 : '-100%', opacity: isProjectBoardOpen ? 1 : 0 }}
      exit={{ x: '-100%', opacity: 0 }}
      transition={{
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      <div className="w-full h-full bg-white/30 backdrop-blur-xl flex flex-col">
        {/* Header */}
        <ProjectBoardHeader project={activeProject} onClose={handleClose} />
        
        {/* Toolbar */}
        <ProjectBoardToolbar project={activeProject} />
        
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl" className="flex-1 flex flex-col">
          <TabsList className="gap-1 justify-start mr-[20px] bg-transparent mb-4">
            {tabs.map(tab => {
              const IconComponent = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id} 
                  className="text-sm font-arabic rounded-full py-3 transition-all duration-300 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-700 data-[state=inactive]:border data-[state=inactive]:border-gray-400 hover:bg-gray-100 hover:text-gray-800 whitespace-nowrap px-[20px] data-[state=active]:bg-black flex items-center gap-2"
                >
                  <IconComponent size={16} strokeWidth={1.5} />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <div className="flex-1 overflow-hidden px-6">
            <TabsContent value="days" className="h-full">
              <DaysPanel project={activeProject} />
            </TabsContent>
            <TabsContent value="finance" className="h-full">
              <FinancePanel project={activeProject} />
            </TabsContent>
            <TabsContent value="legal" className="h-full">
              <LegalPanel project={activeProject} />
            </TabsContent>
            <TabsContent value="work-info" className="h-full">
              <WorkInfoPanel project={activeProject} />
            </TabsContent>
            <TabsContent value="reports" className="h-full">
              <ReportsPanel project={activeProject} />
            </TabsContent>
            <TabsContent value="custom" className="h-full">
              <CustomPanel project={activeProject} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default ProjectBoard;
