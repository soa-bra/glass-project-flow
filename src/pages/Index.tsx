
import Sidebar from '@/components/Sidebar';
import HeaderBar from '@/components/HeaderBar';
import ProjectsColumn from '@/components/ProjectsColumn';
import OperationsBoard from '@/components/OperationsBoard';
import { useState } from 'react';

const Index = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  // لإدارة إظهار اللوحة بالكامل، ننقل الحالة للعمود الرئيسي
  const [isProjectPanelOpen, setIsProjectPanelOpen] = useState(false);
  // نحفظ projectPanelWidth لتعرف العمليات متى تخرج
  const [projectPanelMode, setProjectPanelMode] = useState<"closed" | "opening" | "open" | "closing">("closed");

  return (
    <div
      dir="rtl"
      className="relative min-h-screen w-full bg-soabra-solid-bg font-arabic overflow-hidden"
    >
      <div className="fixed top-0 inset-x-0 bg-soabra-solid-bg z-header">
        <HeaderBar />
      </div>
      <div className="flex h-screen pt-[var(--header-height)] overflow-hidden mx-0 px-0 relative">
        {/* Sidebar مع تحسين حركة التزامن */}
        <div
          style={{ transition: 'all var(--animation-duration-main) var(--animation-easing)' }}
          className="fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] bg-soabra-solid-bg z-sidebar sidebar-layout px-0 mx-0"
        >
          <Sidebar onToggle={setIsSidebarCollapsed} />
        </div>

        {/* Projects + Operations منطقة متجاورة وليس fixed */}
        <div
          className={`flex w-full h-[calc(100vh-var(--sidebar-top-offset))] ml-[var(--sidebar-width)]`}
          style={{ top: 'var(--sidebar-top-offset)', position: "relative", transition: 'all var(--animation-duration-main) var(--animation-easing)' }}
        >
          {/* عمود المشاريع (يمرر حالة فتح ProjectPanel) */}
          <div
            className={`transition-all duration-400 flex-shrink-0`}
            style={{
              width: isProjectPanelOpen && projectPanelMode !== "closing" ? 0 : (isSidebarCollapsed ? 80 : 370),
              minWidth: 0,
              opacity: isProjectPanelOpen && projectPanelMode !== "closing" ? 0 : 1,
              pointerEvents: isProjectPanelOpen && projectPanelMode !== "closing" ? "none" : "auto",
            }}
          >
            <ProjectsColumn
              onProjectPanelChange={setIsProjectPanelOpen}
              onProjectPanelModeChange={setProjectPanelMode}
              isProjectPanelOpen={isProjectPanelOpen}
            />
          </div>
          {/* ProjectPanel (سيتم وضعه بعرض كامل إذا مفتوح) */}
          <div
            className={`transition-all duration-400`}
            style={{
              flexGrow: isProjectPanelOpen ? 1 : 0,
              width: isProjectPanelOpen ? '100%' : 0,
              minWidth: isProjectPanelOpen ? 0 : 'unset',
              zIndex: 0,
            }}
          >
            {/* ProjectPanel تضاف مع الشرط من ProjectsColumn داخليًا */}
            {/* توجه التحكم لفتح اللوحة للعمود */}
          </div>
          {/* لوحة العمليات (OperationsBoard) مع أنيميشن الخروج لليسار */}
          <div
            className={`
              transition-all duration-400
              ${isProjectPanelOpen ? 'animate-slide-out-left pointer-events-none' : 'animate-slide-in-left'}
              flex-shrink-0 h-full
            `}
            style={{
              width: 700,
              maxWidth: '100vw',
              opacity: isProjectPanelOpen ? 0 : 1,
              zIndex: 12,
            }}
          >
            <OperationsBoard isSidebarCollapsed={isSidebarCollapsed} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
