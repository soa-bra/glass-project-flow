
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
    <div dir="rtl" className="relative min-h-screen w-full bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 font-arabic overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 inset-x-0 bg-white/80 backdrop-blur-sm z-header border-b border-gray-200/30">
        <HeaderBar />
      </div>

      <div className="flex h-screen pt-[60px]">
        {/* Sidebar */}
        <div className="fixed top-[60px] right-0 h-[calc(100vh-60px)] bg-white/80 backdrop-blur-sm z-sidebar w-[10%] min-w-[80px] border-l border-gray-200/30">
          <Sidebar />
        </div>

        {/* Projects Column */}
        <div className="fixed top-[60px] right-[10%] w-[30%] h-[calc(100vh-60px)] z-projects bg-white/60 backdrop-blur-sm border-l border-gray-200/30">
          <ProjectsList 
            onProjectSelect={handleProjectSelect}
            isCompressed={showDashboard}
          />
        </div>

        {/* Calendar/Dashboard Column with gradient background */}
        <div className="fixed top-[60px] left-0 w-[60%] h-[calc(100vh-60px)] z-calendar bg-gradient-to-br from-pink-200/30 via-purple-200/30 to-blue-200/30">
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
