
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
    <div dir="rtl" className="relative min-h-screen w-full bg-soabra-solid-bg font-arabic">
      {/* Header */}
      <div className="fixed top-0 inset-x-0 bg-soabra-solid-bg z-header">
        <HeaderBar />
      </div>

      <div className="flex h-screen pt-[60px]">
        {/* Sidebar */}
        <div
          className="fixed top-[60px] right-0 h-[calc(100vh-60px)] bg-soabra-solid-bg z-sidebar transition-width duration-300"
          style={{ width: selectedProject ? '80px' : '80px' }}
        >
          <Sidebar />
        </div>

        {/* Main Columns */}
        <div className="flex flex-1 overflow-hidden">
          {/* Projects List - scrollable only */}
          <div
            className="absolute top-[60px] right-[80px] bottom-0 bg-[#E3E3E3] z-projects overflow-y-auto p-4"
            style={{ width: '20%' }}
          >
            <ProjectsList
              onProjectSelect={handleProjectSelect}
              isCompressed={isDashboardOpen}
            />
          </div>

          {/* Calendar - fixed/hide when dashboard open */}
          {!isDashboardOpen && (
            <div
              className="absolute top-[60px] right-[calc(80px+20%)] bottom-0 bg-gradient-to-br from-soabra-calendar-start to-soabra-calendar-end z-calendar p-4"
              style={{ width: '70%' }}
            >
              <CalendarColumn isCompressed={false} />
            </div>
          )}

          {/* Dashboard Panel */}
          {isDashboardOpen && selectedProject && (
            <div
              className="absolute top-[60px] right-[calc(80px+20%)] bottom-0 bg-gradient-to-br from-soabra-calendar-start to-soabra-calendar-end z-dashboard-panel p-4 overflow-y-auto animate-slide-in-right"
              style={{ width: '70%' }}
            >
              <ProjectDashboard
                project={selectedProject}
                onClose={handleCloseDashboard}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
