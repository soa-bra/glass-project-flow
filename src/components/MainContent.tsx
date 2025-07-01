
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';
import ProjectWorkspace from './ProjectWorkspace';
import DepartmentsWorkspace from './DepartmentsWorkspace';
import { CollaborativePlanningModule } from './CollaborativePlanning';

const MainContent = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('home'); // 'home', 'departments', 'planning', etc.

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

      {activeSection === 'departments' ? (
        <DepartmentsWorkspace isSidebarCollapsed={isSidebarCollapsed} />
      ) : activeSection === 'planning' ? (
        <div className={`fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] overflow-y-auto ${
          isSidebarCollapsed ? 'left-[var(--sidebar-collapsed-width)]' : 'left-[var(--sidebar-expanded-width)]'
        } right-0 transition-all duration-300`}>
          <CollaborativePlanningModule />
        </div>
      ) : (
        <ProjectWorkspace isSidebarCollapsed={isSidebarCollapsed} />
      )}
    </div>
  );
};

export default MainContent;
