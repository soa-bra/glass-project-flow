
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';
import ProjectWorkspace from './ProjectWorkspace';
import DepartmentsWorkspace from './DepartmentsWorkspace';
import ArchiveWorkspace from './ArchiveWorkspace';

const MainContent = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('home'); // 'home', 'departments', 'archive', etc.

  const renderWorkspace = () => {
    switch (activeSection) {
      case 'departments':
        return <DepartmentsWorkspace isSidebarCollapsed={isSidebarCollapsed} />;
      case 'archive':
        return <ArchiveWorkspace isSidebarCollapsed={isSidebarCollapsed} />;
      default:
        return <ProjectWorkspace isSidebarCollapsed={isSidebarCollapsed} />;
    }
  };

  return (
    <div className="flex h-screen pt-[var(--header-height)] overflow-hidden px-[22px]">
      <div style={{
        transition: 'all var(--animation-duration-main) var(--animation-easing)',
        background: '#dfecf2'
      }} className="fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] z-sidebar sidebar-layout">
        <Sidebar 
          onToggle={setIsSidebarCollapsed} 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </div>

      {renderWorkspace()}
    </div>
  );
};

export default MainContent;
