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

      <div className="flex h-screen pt-[var(--header-height)] overflow-hidden">
        <div className="fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] bg-soabra-solid-bg z-sidebar transition-all duration-500 ease-in-out sidebar-layout">
          <Sidebar onToggle={setIsSidebarCollapsed} />
        </div>

        <div className={`fixed h-[calc(100vh-var(--sidebar-top-offset))] transition-all duration-500 ease-in-out ${isSidebarCollapsed ? 'projects-layout-collapsed' : 'projects-layout-expanded'}`} style={{
        top: 'var(--sidebar-top-offset)'
      }}>
          <div className="w-full h-full p-2 px-[6px] mx-0 py-0 my-[6px]">
            <ProjectsColumn />
          </div>
        </div>

        <OperationsBoard isSidebarCollapsed={isSidebarCollapsed} />
      </div>
    </div>;
};
export default Index;