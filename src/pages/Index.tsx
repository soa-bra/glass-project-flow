
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import HeaderBar from '@/components/HeaderBar';
import ProjectsList from '@/components/ProjectsList';
import CalendarColumn from '@/components/CalendarColumn';
import ProjectDashboard from '@/components/ProjectDashboard';

export interface Project {
  id: string;
  title: string;
  assignee: string;
  value: string;
  status: 'success' | 'warning' | 'error' | 'neutral';
  phase: string;
  phaseColor: string;
  daysLeft?: number;
  tasksCount?: number;
  description?: string;
}

const Index: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setIsDashboardOpen(true);
  };

  const handleCloseDashboard = () => {
    setIsDashboardOpen(false);
    setSelectedProject(null);
  };

  return (
    <div dir="rtl" className="relative min-h-screen w-full font-arabic"
         style={{
           background: 'linear-gradient(135deg, #E8F2FE 0%, #F9DBF8 35%, #DAD4FC 70%, #E8F2FE 100%)',
         }}>
      {/* Header */}
      <div className="fixed top-0 inset-x-0 bg-white/30 backdrop-blur-xl border-b border-white/20 z-header">
        <HeaderBar />
      </div>

      <div className="flex h-screen pt-[60px]">
        {/* Sidebar - 10% width */}
        <div 
          className={`fixed top-[60px] right-0 h-[calc(100vh-60px)] z-sidebar transition-all duration-300 ${
            isDashboardOpen ? 'w-[60px]' : 'w-[10%]'
          }`}
        >
          <Sidebar isCollapsed={isDashboardOpen} />
        </div>

        {/* Projects Column - 30% width */}
        <div 
          className={`fixed top-[60px] h-[calc(100vh-60px)] w-[30%] z-projects transition-all duration-300 ${
            isDashboardOpen ? 'right-[60px]' : 'right-[10%]'
          } p-4`}
        >
          <ProjectsList 
            onProjectSelect={handleProjectSelect} 
            isCompressed={isDashboardOpen}
            selectedProjectId={selectedProject?.id}
          />
        </div>

        {/* Calendar Column - 60% width (hidden when dashboard is open) */}
        <div 
          className={`fixed top-[60px] h-[calc(100vh-60px)] w-[60%] left-0 z-calendar transition-all duration-300 p-4 ${
            isDashboardOpen ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
          }`}
        >
          <CalendarColumn isCompressed={false} />
        </div>

        {/* Project Dashboard Panel - 60% width (shown when project is selected) */}
        {isDashboardOpen && selectedProject && (
          <div 
            className={`fixed top-[60px] h-[calc(100vh-60px)] w-[60%] left-0 z-dashboard-panel transition-all duration-300 p-4 ${
              isDashboardOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}
          >
            <ProjectDashboard project={selectedProject} onClose={handleCloseDashboard} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
