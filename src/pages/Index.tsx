
import { useState } from 'react';
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
}

const Index = () => {
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
    <div dir="rtl" className="min-h-screen w-full bg-soabra-solid-bg font-arabic">
      {/* Floating Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-soabra-primary-blue/10 to-soabra-calendar-start/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 left-32 w-96 h-96 bg-gradient-to-br from-soabra-calendar-mid/15 to-soabra-calendar-end/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-gradient-to-br from-soabra-success/10 to-soabra-warning/10 rounded-full blur-2xl animate-pulse delay-500" />
      </div>

      {/* Main Layout Container */}
      <div className="flex flex-col h-screen w-full relative z-10">
        {/* Header Bar */}
        <HeaderBar />
        
        {/* Main Content - Three Column Layout */}
        <div className="flex flex-1 overflow-hidden gap-4 p-4">
          {/* Sidebar - Right side (25% width) */}
          <div className="w-1/4 min-w-[300px]">
            <Sidebar />
          </div>
          
          {/* Projects Column - Middle (35% width) */}
          <div className={`${isDashboardOpen ? 'w-[30%]' : 'w-[40%]'} transition-all duration-500`}>
            <ProjectsList onProjectSelect={handleProjectSelect} isCompressed={isDashboardOpen} />
          </div>
          
          {/* Calendar Column - Left side (40% width when no dashboard, 30% when dashboard open) */}
          <div className={`${isDashboardOpen ? 'w-[30%]' : 'w-[35%]'} transition-all duration-500`}>
            <CalendarColumn isCompressed={isDashboardOpen} />
          </div>
          
          {/* Project Dashboard Panel - Slide overlay (takes 40% when open) */}
          {isDashboardOpen && selectedProject && (
            <div className="w-[10%] transition-all duration-500">
              <ProjectDashboard project={selectedProject} onClose={handleCloseDashboard} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
