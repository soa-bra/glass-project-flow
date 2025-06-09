
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
      <div className="fixed top-0 inset-x-0 bg-soabra-solid-bg z-header">
        <HeaderBar />
      </div>

      <div className="flex h-screen pt-[60px]">
        {/* Sidebar - 10% width */}
        <div className="fixed top-[60px] right-0 h-[calc(100vh-60px)] bg-soabra-solid-bg z-sidebar w-[10%] min-w-[80px]">
          <Sidebar />
        </div>

        {/* Projects Column - 30% width */}
        <div className="fixed top-[60px] right-[calc(10%+20px)] w-[30%] h-[85%] z-projects">
          <ProjectsList 
            onProjectSelect={handleProjectSelect}
            isCompressed={showDashboard}
          />
        </div>

        {/* Calendar/Dashboard Column - 60% width */}
        <div className="fixed top-[60px] left-[10%] w-[60%] h-[90%] z-calendar">
          {/* Calendar */}
          <div className={`
            absolute inset-0 transition-all duration-300 ease-in-out
            ${showDashboard ? 'transform translate-x-full opacity-0' : 'transform translate-x-0 opacity-100'}
          `}>
            <MainCalendar />
          </div>

          {/* Dashboard */}
          {selectedProject && (
            <div className={`
              absolute inset-0 transition-all duration-300 ease-in-out
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
