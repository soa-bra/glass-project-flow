
import React, { useState, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import HeaderBar from '@/components/HeaderBar';
import ProjectsColumn from '@/components/ProjectsColumn';
import ProjectPanel from '@/components/ProjectPanel';
import OperationsBoard from '@/components/OperationsBoard';

const Index: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  console.log('Index render - panelOpen:', panelOpen, 'selectedProjectId:', selectedProjectId);

  const handleSidebarToggle = useCallback((collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  }, []);

  const openProjectPanel = useCallback((projectId: string) => {
    console.log('فتح لوحة المشروع:', projectId);
    setSelectedProjectId(projectId);
    setPanelOpen(true);
  }, []);

  const closeProjectPanel = useCallback(() => {
    console.log('إغلاق لوحة المشروع');
    setPanelOpen(false);
    setTimeout(() => {
      setSelectedProjectId(null);
    }, 300);
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
          }`} 
          style={{
            top: 'var(--sidebar-top-offset)'
          }}
        >
          <div className="w-full h-full p-2 py-0 mx-0 px-[5px] transition-all var(--animation-duration-main) var(--animation-easing)">
            <ProjectsColumn onProjectSelect={openProjectPanel} />
          </div>
        </div>

        {/* لوحة العمليات - تظهر عندما لا تكون لوحة المشروع مفتوحة */}
        {!panelOpen && (
          <OperationsBoard isSidebarCollapsed={isSidebarCollapsed} />
        )}

        {/* لوحة تحكم المشروع - تحل محل OperationsBoard */}
        {panelOpen && selectedProjectId && (
          <ProjectPanel
            projectId={selectedProjectId}
            isVisible={panelOpen}
            onClose={closeProjectPanel}
            isSidebarCollapsed={isSidebarCollapsed}
          />
        )}
      </div>
    </div>
  );
};

export { Index };
export default Index;
