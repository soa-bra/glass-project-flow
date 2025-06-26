
import Sidebar from '@/components/Sidebar';
import DepartmentsSidebar from '@/components/DepartmentsSidebar';
import { useState } from 'react';
import { useDepartmentsSidebar } from '@/hooks/useDepartmentsSidebar';
import ProjectWorkspace from './ProjectWorkspace';

const MainContent = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { 
    isDepartmentsSidebarVisible, 
    openDepartmentsSidebar, 
    closeDepartmentsSidebar 
  } = useDepartmentsSidebar();

  return (
    <div className="flex h-screen pt-[var(--header-height)] overflow-hidden px-[22px]">
      <div style={{
        transition: 'all var(--animation-duration-main) var(--animation-easing)',
        background: '#dfecf2'
      }} className="fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] z-sidebar sidebar-layout">
        <Sidebar 
          onToggle={setIsSidebarCollapsed} 
          onDepartmentsClick={openDepartmentsSidebar}
          isDepartmentsSidebarVisible={isDepartmentsSidebarVisible}
        />
      </div>

      {/* شريط الإدارات */}
      <DepartmentsSidebar 
        isVisible={isDepartmentsSidebarVisible}
        onClose={closeDepartmentsSidebar}
      />

      {/* المحتوى الرئيسي - يخفى عند ظهور شريط الإدارات */}
      {!isDepartmentsSidebarVisible && (
        <ProjectWorkspace isSidebarCollapsed={isSidebarCollapsed} />
      )}
    </div>
  );
};

export default MainContent;
