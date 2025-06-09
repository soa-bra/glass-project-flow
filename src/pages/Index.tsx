
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
  daysLeft: number;
  tasksCount: number;
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
    <div dir="rtl" className="min-h-screen w-full bg-soabra-header-bg font-arabic overflow-hidden">
      {/* Fixed Header Bar */}
      <HeaderBar />
      
      {/* Main Layout Container - Fixed positioning for all elements */}
      <div className="flex h-screen w-full pt-[60px]">
        {/* Fixed Sidebar - Right side */}
        <div className="fixed top-[60px] right-0 bottom-0 z-sidebar">
          <Sidebar />
        </div>
        
        {/* Projects Column - Fixed with scroll only in content */}
        <div 
          className={`fixed top-[60px] bottom-0 w-[30%] transition-all duration-300 z-projects ${
            isDashboardOpen ? 'opacity-50' : 'opacity-100'
          }`}
          style={{ right: '80px' }}
        >
          <ProjectsList 
            onProjectSelect={handleProjectSelect} 
            isCompressed={isDashboardOpen} 
          />
        </div>
        
        {/* Calendar Column - Fixed, slides out when dashboard opens */}
        <div 
          className={`fixed top-[60px] bottom-0 left-0 transition-all duration-300 z-calendar ${
            isDashboardOpen 
              ? 'translate-x-full opacity-0' 
              : 'translate-x-0 opacity-100'
          }`}
          style={{ 
            right: 'calc(80px + 30%)',
            width: 'calc(70% - 80px)',
            marginRight: '10%'
          }}
        >
          <CalendarColumn isCompressed={isDashboardOpen} />
        </div>
        
        {/* Project Dashboard Panel - Slides in from right */}
        {isDashboardOpen && selectedProject && (
          <div 
            className="fixed top-[60px] bottom-0 right-[calc(80px+30%)] w-[70%] z-dashboard-panel animate-slide-in-right"
          >
            <ProjectDashboard 
              project={selectedProject} 
              onClose={handleCloseDashboard} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
