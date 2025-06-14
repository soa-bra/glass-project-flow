
import Sidebar from '@/components/Sidebar';
import HeaderBar from '@/components/HeaderBar';
import ProjectsColumn from '@/components/ProjectsColumn';
import OperationsBoard from '@/components/OperationsBoard';
import ProjectPanel from '@/components/ProjectPanel/ProjectPanel';
import { useState } from 'react';

const Index = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  // نحدد العرض عند ظهور لوحة المشروع
  const isProjectPanelOpen = !!activeProjectId;

  return (
    <div dir="rtl" className="relative min-h-screen w-full bg-soabra-solid-bg font-arabic overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 inset-x-0 bg-soabra-solid-bg z-header">
        <HeaderBar />
      </div>
      <div className="flex h-screen pt-[var(--header-height)] overflow-hidden mx-0 px-0">
        {/* Sidebar */}
        <div style={{
          transition: 'all var(--animation-duration-main) var(--animation-easing)'
        }} className="fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] bg-soabra-solid-bg z-sidebar sidebar-layout px-0 mx-0">
          <Sidebar onToggle={setIsSidebarCollapsed} />
        </div>
        {/* Projects Column */}
        <div
          className={`fixed h-[calc(100vh-var(--sidebar-top-offset))] transition-all duration-500 ${isSidebarCollapsed ? 'projects-layout-collapsed' : 'projects-layout-expanded'}`}
          style={{
            top: 'var(--sidebar-top-offset)',
            right: 0,
            width: 'var(--projects-column-width)', // يمكن ضبط العرض كما في التصميم
            zIndex: 1010,
            transition: 'all var(--animation-duration-main) var(--animation-easing)'
          }}
        >
          <div className="w-full h-full p-2 py-0 mx-0 px-[5px]">
            <ProjectsColumn
              activeProjectId={activeProjectId}
              onProjectSelect={setActiveProjectId}
            />
          </div>
        </div>
        {/* الجزء الرئيسي: لوحة الإدارة أو لوحة المشروع */}
        <div
          className={`fixed transition-all duration-500 ease-in-out z-[1020]`}
          style={{
            top: 'var(--sidebar-top-offset)',
            right: `calc(var(--projects-column-width))`,
            height: 'calc(100vh - var(--sidebar-top-offset))',
            width: 'calc(100vw - var(--projects-column-width) - var(--sidebar-width-expanded))',
            // عند فتح لوحة المشروع، حرك لوحة الإدارة لليسار مع تقليل الشفافية
            transform: isProjectPanelOpen ? 'translateX(-40px) scale(0.97)' : 'translateX(0) scale(1)',
            opacity: isProjectPanelOpen ? 0.15 : 1,
            pointerEvents: isProjectPanelOpen ? 'none' : 'auto',
            transition:
              'transform 0.38s cubic-bezier(0.4,0,0.2,1), opacity 0.32s cubic-bezier(0.4,0,0.2,1)'
          }}
        >
          <OperationsBoard isSidebarCollapsed={isSidebarCollapsed} />
        </div>
        {/* لوحة المشروع، تظهر بتراكب وانزياح */}
        {isProjectPanelOpen && (
          <div
            className="fixed z-[1050] h-[calc(100vh-var(--sidebar-top-offset))]"
            style={{
              top: 'var(--sidebar-top-offset)',
              right: `calc(var(--projects-column-width))`,
              width: 'calc(100vw - var(--projects-column-width) - var(--sidebar-width-expanded))',
              animation: 'fade-in 0.33s cubic-bezier(0.4,0,0.2,1)'
            }}
          >
            <ProjectPanel
              projectId={activeProjectId}
              onClose={() => setActiveProjectId(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
