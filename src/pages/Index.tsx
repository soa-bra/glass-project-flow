
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
    <div dir="rtl" className="relative min-h-screen w-full bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 font-arabic overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 inset-x-0 bg-white shadow-lg z-header border-b border-gray-200">
        <HeaderBar />
      </div>

      <div className="flex h-screen pt-[70px] p-2">
        {/* Sidebar - 20% width */}
        <div className="w-[20%] h-[calc(100vh-80px)] bg-white rounded-2xl shadow-xl border border-gray-200 ml-2">
          <Sidebar />
        </div>

        {/* Projects Column - 30% width */}
        <div className="w-[30%] h-[calc(100vh-80px)] bg-white rounded-2xl shadow-xl border border-gray-200 mx-2">
          <ProjectsList 
            onProjectSelect={handleProjectSelect}
            isCompressed={showDashboard}
          />
        </div>

        {/* Calendar/Dashboard Column - 50% width */}
        <div className="w-[50%] h-[calc(100vh-80px)] bg-white rounded-2xl shadow-xl border border-gray-200 ml-2 overflow-hidden">
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
