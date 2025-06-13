
import React, { useState, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import HeaderBar from '@/components/HeaderBar';
import ProjectsColumn from '@/components/ProjectsColumn';
import OperationsBoard from '@/components/OperationsBoard';
import ProjectPanel from '@/components/ProjectPanel';
import { useProjectSelection } from '@/hooks/useProjectSelection';

const Index: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { selectedProjectId, isPanelVisible, closePanel } = useProjectSelection();

  console.log('Index render - selectedProjectId:', selectedProjectId, 'isPanelVisible:', isPanelVisible);

  const handleSidebarToggle = useCallback((collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  }, []);

  return (
    <div dir="rtl" className="relative min-h-screen w-full bg-soabra-solid-bg font-arabic overflow-hidden">
      <div className="fixed top-0 inset-x-0 bg-soabra-solid-bg z-header">
        <HeaderBar />
      </div>

      <div className="flex h-screen pt-[var(--header-height)] overflow-hidden mx-0 px-0">
        <div 
          className="fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] bg-soabra-solid-bg z-sidebar sidebar-layout px-0 mx-0 transition-all var(--animation-duration-main) var(--animation-easing)"
        >
          <Sidebar onToggle={handleSidebarToggle} />
        </div>

        <div 
          className={`fixed h-[calc(100vh-var(--sidebar-top-offset))] transition-all var(--animation-duration-main) var(--animation-easing) ${
            isSidebarCollapsed ? 'projects-layout-collapsed' : 'projects-layout-expanded'
          } ${isPanelVisible ? 'w-[22vw] blur-[2px]' : ''}`} 
          style={{
            top: 'var(--sidebar-top-offset)'
          }}
        >
          <div className="w-full h-full p-2 py-0 mx-0 px-[5px] transition-all var(--animation-duration-main) var(--animation-easing)">
            <ProjectsColumn />
          </div>
        </div>

        {/* لوحة العمليات - تنزلق خارج الإطار عند فتح لوحة المشروع */}
        <div 
          className={`mx-0 transition-all duration-500 ease-in-out ${
            selectedProjectId && isPanelVisible 
              ? 'translate-x-full opacity-0 pointer-events-none' 
              : 'translate-x-0 opacity-100 pointer-events-auto'
          }`}
        >
          <OperationsBoard isSidebarCollapsed={isSidebarCollapsed} />
        </div>
      </div>

      {/* لوحة تحكم المشروع */}
      {selectedProjectId && (
        <ProjectPanel
          projectId={selectedProjectId}
          isVisible={isPanelVisible}
          onClose={closePanel}
        />
      )}
    </div>
  );
};

export { Index };
export default Index;
