
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import HeaderBar from '@/components/HeaderBar';
import ProjectsList from '@/components/ProjectsList';
import MainCalendar from '@/components/calendar/MainCalendar';
import ProjectDashboard from '@/components/ProjectDashboard';
import { Project } from '@/types/project';

const Index = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setShowDashboard(true);
  };

  const handleCloseDashboard = () => {
    setShowDashboard(false);
    setSelectedProject(null);
  };

  return (
    <div dir="rtl" className="relative min-h-screen w-full bg-soabra-solid-bg font-arabic overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 inset-x-0 bg-soabra-solid-bg z-header border-b border-gray-200/30">
        <HeaderBar />
      </div>

      <div className="flex h-screen pt-[60px]">
        {/* Sidebar - Clean background */}
        <div className="fixed top-[60px] right-0 h-[calc(100vh-60px)] bg-soabra-solid-bg z-sidebar w-[10%] min-w-[80px] border-l border-gray-200/30">
          <Sidebar />
        </div>

        {/* Projects Column - Clean background */}
        <div className="fixed top-[60px] right-[10%] w-[30%] h-[calc(100vh-60px)] z-projects bg-soabra-solid-bg border-l border-gray-200/30">
          <ProjectsList 
            onProjectSelect={handleProjectSelect}
            isCompressed={showDashboard}
          />
        </div>

        {/* Calendar/Dashboard Column - Gradient background */}
        <div className="fixed top-[60px] left-0 w-[60%] h-[calc(100vh-60px)] z-calendar calendar-gradient">
          {/* Calendar */}
          <div className={`
            absolute inset-0 transition-all duration-500 ease-in-out
            ${showDashboard ? 'transform translate-x-full opacity-0' : 'transform translate-x-0 opacity-100'}
          `}>
            <MainCalendar />
          </div>

          {/* Dashboard */}
          {selectedProject && (
            <div className={`
              absolute inset-0 transition-all duration-500 ease-in-out
              ${showDashboard ? 'transform translate-x-0 opacity-100' : 'transform translate-x-full opacity-0'}
            `}>
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
