
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
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
    <div className="min-h-screen w-full bg-soabra-solid-bg font-arabic" dir="rtl">
      {/* Floating Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-soabra-primary-blue/10 to-soabra-calendar-start/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 left-32 w-96 h-96 bg-gradient-to-br from-soabra-calendar-mid/15 to-soabra-calendar-end/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-gradient-to-br from-soabra-success/10 to-soabra-warning/10 rounded-full blur-2xl animate-pulse delay-500" />
      </div>

      {/* Main Layout Container - Three Column Layout */}
      <div className="flex h-screen w-full relative z-10">
        {/* Sidebar - Right side, expanded */}
        <div className="transform transition-all duration-500 ease-in-out hover:scale-[1.01]">
          <Sidebar />
        </div>
        
        {/* Projects Column - Middle */}
        <div className="transform transition-all duration-300 ease-in-out">
          <ProjectsList 
            onProjectSelect={handleProjectSelect}
            isCompressed={isDashboardOpen}
          />
        </div>
        
        {/* Calendar Column - Left side, largest */}
        <div className="transform transition-all duration-300 ease-in-out">
          <CalendarColumn isCompressed={isDashboardOpen} />
        </div>
        
        {/* Project Dashboard Panel - Slide overlay */}
        {isDashboardOpen && selectedProject && (
          <ProjectDashboard 
            project={selectedProject}
            onClose={handleCloseDashboard}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
