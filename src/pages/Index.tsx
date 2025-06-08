
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
      {/* Main Layout Container - Three Column Layout */}
      <div className="flex h-screen w-full">
        {/* Sidebar - Right side, expanded */}
        <Sidebar />
        
        {/* Projects Column - Middle */}
        <ProjectsList 
          onProjectSelect={handleProjectSelect}
          isCompressed={isDashboardOpen}
        />
        
        {/* Calendar Column - Left side, largest */}
        <CalendarColumn isCompressed={isDashboardOpen} />
        
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
