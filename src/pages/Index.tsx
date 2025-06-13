
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import HeaderBar from '@/components/HeaderBar';
import ProjectsColumn from '@/components/ProjectsColumn';
import OperationsBoard from '@/components/OperationsBoard';

const Index: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const layoutStyles = React.useMemo(() => ({
    transition: 'all var(--animation-duration-main) var(--animation-easing)'
  }), []);

  const handleSidebarToggle = React.useCallback((collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  }, []);

  return (
    <div dir="rtl" className="relative min-h-screen w-full bg-soabra-solid-bg font-arabic overflow-hidden">
      <div className="fixed top-0 inset-x-0 bg-soabra-solid-bg z-header">
        <HeaderBar />
      </div>

      <div className="flex h-screen pt-[var(--header-height)] overflow-hidden mx-0 px-0">
        <div 
          style={layoutStyles} 
          className="fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] bg-soabra-solid-bg z-sidebar sidebar-layout px-0 mx-0"
        >
          <Sidebar onToggle={handleSidebarToggle} />
        </div>

        <div 
          className={`fixed h-[calc(100vh-var(--sidebar-top-offset))] ${
            isSidebarCollapsed ? 'projects-layout-collapsed' : 'projects-layout-expanded'
          }`} 
          style={{
            top: 'var(--sidebar-top-offset)',
            ...layoutStyles
          }}
        >
          <div style={layoutStyles} className="w-full h-full p-2 py-0 mx-0 px-[5px]">
            <ProjectsColumn />
          </div>
        </div>

        <div style={layoutStyles} className="mx-0">
          <OperationsBoard isSidebarCollapsed={isSidebarCollapsed} />
        </div>
      </div>
    </div>
  );
};

export { Index };
export default Index;
