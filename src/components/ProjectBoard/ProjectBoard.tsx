
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Calendar, Clock, FileText, Users, BarChart3, DollarSign } from 'lucide-react';
import { ProjectCardProps } from '@/components/ProjectCard/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProjectBoardHeader } from './ProjectBoardHeader';
import { ProjectBoardActionBar } from './ProjectBoardActionBar';
import TasksTab from './tabs/TasksTab';
import { FinanceDetailsTab } from './tabs/FinanceDetailsTab';
import LegalTab from './tabs/LegalTab';
import { ClientInfoTab } from './tabs/ClientInfoTab';
import ReportsTab from './tabs/ReportsTab';
import { ProjectCalendarTab } from './tabs/ProjectCalendarTab';
import { ProjectSidebar } from './ProjectSidebar';

interface ProjectBoardProps {
  project: ProjectCardProps;
  onClose: () => void;
  isSidebarCollapsed: boolean;
}

const tabs = [
  { id: 'tasks', label: 'قائمة المهام', icon: FileText },
  { id: 'finance', label: 'التفاصيل المالية', icon: DollarSign },
  { id: 'legal', label: 'الشؤون القانونية', icon: Settings },
  { id: 'client', label: 'معلومات العميل', icon: Users },
  { id: 'reports', label: 'تقارير المشروع', icon: BarChart3 },
  { id: 'calendar', label: 'تقويم المشروع', icon: Calendar },
];

export const ProjectBoard: React.FC<ProjectBoardProps> = ({ 
  project, 
  onClose, 
  isSidebarCollapsed 
}) => {
  const [activeTab, setActiveTab] = useState('tasks');

  const getProjectTint = (status: string) => {
    const tints = {
      success: '#22c55e',
      warning: '#f59e0b', 
      error: '#ef4444',
      info: '#3b82f6',
    };
    return tints[status as keyof typeof tints] || tints.info;
  };

  const projectTint = getProjectTint(project.status);

  return (
    <motion.div
      layoutId={`project-piece-${project.id}`}
      className={`fixed h-[calc(100vh-60px)] ${
        isSidebarCollapsed ? 'operations-board-collapsed' : 'operations-board-expanded'
      } flex`}
      style={{
        top: 'var(--sidebar-top-offset)',
        background: 'rgba(255, 255, 255, 0.35)',
        backdropFilter: 'blur(14px)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: 'inset 0 0 24px rgba(255,255,255,0.15)',
        overflow: 'hidden',
        zIndex: 30,
        '--project-tint': projectTint,
      } as React.CSSProperties}
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{
        duration: 0.35,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <ProjectBoardHeader project={project} onClose={onClose} />
        
        {/* Action Bar */}
        <ProjectBoardActionBar project={project} tint={projectTint} />
        
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl" className="flex-1 flex flex-col">
          <div className="px-6 py-4 border-b border-white/10">
            <TabsList className="gap-2 justify-start bg-transparent">
              {tabs.map((tab, index) => {
                const IconComponent = tab.icon;
                return (
                  <motion.div
                    key={tab.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.25 }}
                  >
                    <TabsTrigger 
                      value={tab.id}
                      className="text-sm font-arabic rounded-full py-3 px-5 transition-all duration-300 data-[state=active]:text-white data-[state=inactive]:bg-white/20 data-[state=inactive]:text-gray-700 data-[state=inactive]:border data-[state=inactive]:border-white/30 hover:bg-white/30 hover:text-gray-800 whitespace-nowrap flex items-center gap-2"
                      style={{
                        '--active-bg': projectTint,
                      } as React.CSSProperties}
                    >
                      <IconComponent size={16} strokeWidth={1.5} />
                      {tab.label}
                    </TabsTrigger>
                  </motion.div>
                );
              })}
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <TabsContent value="tasks" className="h-full">
                <TasksTab project={project} tint={projectTint} />
              </TabsContent>
              <TabsContent value="finance" className="h-full">
                <FinanceDetailsTab project={project} tint={projectTint} />
              </TabsContent>
              <TabsContent value="legal" className="h-full">
                <LegalTab project={project} tint={projectTint} />
              </TabsContent>
              <TabsContent value="client" className="h-full">
                <ClientInfoTab project={project} tint={projectTint} />
              </TabsContent>
              <TabsContent value="reports" className="h-full">
                <ReportsTab project={project} tint={projectTint} />
              </TabsContent>
              <TabsContent value="calendar" className="h-full">
                <ProjectCalendarTab project={project} tint={projectTint} />
              </TabsContent>
            </AnimatePresence>
          </div>
        </Tabs>
      </div>

      {/* Sidebar */}
      <ProjectSidebar project={project} tint={projectTint} />
    </motion.div>
  );
};
