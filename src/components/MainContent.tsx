import Sidebar from '@/components/Sidebar';
import { useState } from 'react';
import ProjectWorkspace from './ProjectWorkspace';
const MainContent = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  return <div className="flex h-screen pt-[var(--header-height)] overflow-hidden mx-0 py-0 px-[22px] my-0">
      {/* Sidebar */}
      <div style={{
      transition: 'all var(--animation-duration-main) var(--animation-easing)',
      background: '#dfecf2'
    }} className="fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] z-sidebar sidebar-layout px-0 mx-0">
        <Sidebar onToggle={setIsSidebarCollapsed} />
      </div>

      <ProjectWorkspace isSidebarCollapsed={isSidebarCollapsed} />
    </div>;
};
export default MainContent;