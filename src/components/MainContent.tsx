
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';
import ProjectWorkspace from './ProjectWorkspace';
import DepartmentsWorkspace from './DepartmentsWorkspace';
import ArchiveWorkspace from './ArchiveWorkspace';
import SettingsWorkspace from './SettingsWorkspace';
import PlanningWorkspace from './PlanningWorkspace';

const MainContent = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('home'); // 'home', 'departments', 'archive', etc.

  const renderWorkspace = () => {
    switch (activeSection) {
      case 'departments':
        return <DepartmentsWorkspace isSidebarCollapsed={isSidebarCollapsed} />;
      case 'planning':
        return <PlanningWorkspace isSidebarCollapsed={true} />;
      case 'archive':
        return <ArchiveWorkspace isSidebarCollapsed={isSidebarCollapsed} />;
      case 'settings':
        return <SettingsWorkspace isSidebarCollapsed={isSidebarCollapsed} />;
      default:
        return <ProjectWorkspace isSidebarCollapsed={isSidebarCollapsed} />;
    }
  };

  return (
    <div className="flex h-screen pt-[var(--header-height)] overflow-hidden px-[22px]">
      <div 
        style={{
          transition: 'all var(--animation-duration-main) var(--animation-easing)',
          background: '#dfecf2',
          width: activeSection === 'planning' ? '4%' : undefined
        }} 
        className={`fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] z-sidebar ${
          activeSection === 'planning' ? '' : 'sidebar-layout'
        }`}
      >
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
