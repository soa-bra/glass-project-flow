import Sidebar from '@/components/Sidebar';
import HeaderBar from '@/components/HeaderBar';
import ProjectsColumn from '@/components/ProjectsColumn';
import OperationsBoard from '@/components/OperationsBoard';
import { useState } from 'react';
const Index = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  return <div dir="rtl" className="relative min-h-screen w-full bg-soabra-solid-bg font-arabic overflow-hidden">
      <div className="fixed top-0 inset-x-0 bg-soabra-solid-bg z-header">
        <HeaderBar />
      </div>

      <div className="flex h-screen pt-[var(--header-height)] overflow-hidden mx-0 px-0">
        {/* Sidebar with enhanced animation synchronization */}
        <div style={{
        transition: 'all var(--animation-duration-main) var(--animation-easing)'
      }} className="fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] bg-soabra-solid-bg z-sidebar sidebar-layout px-0 mx-0">
          <Sidebar onToggle={setIsSidebarCollapsed} />
        </div>

        {/* Projects Column with synchronized animation */}
        <div className={`fixed h-[calc(100vh-var(--sidebar-top-offset))] ${isSidebarCollapsed ? 'projects-layout-collapsed' : 'projects-layout-expanded'}`} style={{
        top: 'var(--sidebar-top-offset)',
        transition: 'all var(--animation-duration-main) var(--animation-easing)'
      }}>
          <div style={{
          transition: 'all var(--animation-duration-main) var(--animation-easing)'
        }} className="w-full h-full p-2 py-0 px-[25px] mx-[20px]">
            <ProjectsColumn />
          </div>
        </div>

        {/* Operations Board with synchronized animation */}
        <div style={{
        transition: 'all var(--animation-duration-main) var(--animation-easing)'
      }}>
          <OperationsBoard isSidebarCollapsed={isSidebarCollapsed} />
        </div>
      </div>
    </div>;
};
export default Index;