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
  return <div dir="rtl" className="relative min-h-screen w-full bg-soabra-solid-bg font-arabic px-0 mx-[5px]">
      {/* Header */}
      <div className="fixed top-0 inset-x-0 bg-soabra-solid-bg z-header">
        <HeaderBar />
      </div>

      <div className="flex h-screen pt-[60px] px-[240px] mx-0">
        {/* Sidebar */}
        <div style={{
        width: selectedProject ? '80px' : '80px'
      }} className="fixed top-[60px] right-0 h-[calc(100vh-60px)] bg-soabra-solid-bg z-sidebar transition-width duration-300 my-[51px] py-0 px-[6px]">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        
      </div>

      {/* Project Dashboard Panel */}
      {isDashboardOpen && selectedProject && <ProjectDashboard project={selectedProject} onClose={handleCloseDashboard} />}
    </div>;
};
export default Index;