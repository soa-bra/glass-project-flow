import Sidebar from '@/components/Sidebar';
import { useState } from 'react';
import ProjectWorkspace from './ProjectWorkspace';
import DepartmentsWorkspace from './DepartmentsWorkspace';
const MainContent = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('home'); // 'home', 'departments', etc.

  return <div className="flex h-screen pt-[var(--header-height)] overflow-hidden px-0">
      <div style={{
      transition: 'all var(--animation-duration-main) var(--animation-easing)',
      background: '#dfecf2'
    }} className="fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] z-sidebar sidebar-layout">
        <Sidebar onToggle={setIsSidebarCollapsed} activeSection={activeSection} onSectionChange={setActiveSection} />
      </div>

      {activeSection === 'departments' ? <DepartmentsWorkspace isSidebarCollapsed={isSidebarCollapsed} /> : <ProjectWorkspace isSidebarCollapsed={isSidebarCollapsed} />}
    </div>;
};
export default MainContent;