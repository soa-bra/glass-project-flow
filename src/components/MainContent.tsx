import Sidebar from '@/components/Sidebar';
import { useState } from 'react';
import ProjectWorkspace from './ProjectWorkspace';
import DepartmentsWorkspace from './DepartmentsWorkspace';
import ArchiveWorkspace from './ArchiveWorkspace';
import SettingsWorkspace from './SettingsWorkspace';
const MainContent = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('home'); // 'home', 'departments', 'archive', etc.
  const [previousSidebarState, setPreviousSidebarState] = useState(false);

  // Handle section changes and sidebar state
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  // Force collapsed can be set to false or used for future sections
  const forceCollapsed = false;
  const effectiveCollapsed = forceCollapsed || isSidebarCollapsed;
  const renderWorkspace = () => {
    switch (activeSection) {
      case 'departments':
        return <DepartmentsWorkspace isSidebarCollapsed={effectiveCollapsed} />;
      case 'archive':
        return <ArchiveWorkspace isSidebarCollapsed={effectiveCollapsed} />;
      case 'settings':
        return <SettingsWorkspace isSidebarCollapsed={effectiveCollapsed} />;
      default:
        return <ProjectWorkspace isSidebarCollapsed={effectiveCollapsed} />;
    }
  };
  return <div className="flex h-screen pt-[var(--header-height)] overflow-hidden px-0 mx-0 bg-slate-100">
      <div style={{
      transition: 'all var(--animation-duration-main) var(--animation-easing)'
    }} className="fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] z-sidebar sidebar-layout bg-slate-100">
        <Sidebar onToggle={setIsSidebarCollapsed} activeSection={activeSection} onSectionChange={handleSectionChange} forceCollapsed={forceCollapsed} />
      </div>

      {renderWorkspace()}
    </div>;
};
export default MainContent;