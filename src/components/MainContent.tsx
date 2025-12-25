import Sidebar from '@/components/Sidebar';
import { useState, useEffect } from 'react';
import { useNavigation } from '@/contexts/NavigationContext';
import ProjectWorkspace from './ProjectWorkspace';
import DepartmentsWorkspace from './DepartmentsWorkspace';
import ArchiveWorkspace from './ArchiveWorkspace';
import SettingsWorkspace from './SettingsWorkspace';
import PlanningWorkspace from './PlanningWorkspace';
const MainContent = () => {
  const { navigationState, setActiveSection } = useNavigation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [previousSidebarState, setPreviousSidebarState] = useState(false);

  // Update local state when navigation state changes
  useEffect(() => {
    if (navigationState.activeSection !== 'planning') {
      setIsSidebarCollapsed(previousSidebarState);
    }
  }, [navigationState.activeSection, previousSidebarState]);

  // Handle section changes and sidebar state
  const handleSectionChange = (section: string) => {
    if (section === 'planning' && navigationState.activeSection !== 'planning') {
      // Entering planning section - save current state and force collapse
      setPreviousSidebarState(isSidebarCollapsed);
    } else if (navigationState.activeSection === 'planning' && section !== 'planning') {
      // Leaving planning section - restore previous state
      setIsSidebarCollapsed(previousSidebarState);
    }
    setActiveSection(section);
  };

  // Force collapsed state for planning section
  const forceCollapsed = navigationState.activeSection === 'planning';
  const effectiveCollapsed = forceCollapsed || isSidebarCollapsed;
  const renderWorkspace = () => {
    switch (navigationState.activeSection) {
      case 'departments':
        return <DepartmentsWorkspace isSidebarCollapsed={effectiveCollapsed} />;
      case 'planning':
        return <PlanningWorkspace isSidebarCollapsed={effectiveCollapsed} />;
      case 'archive':
        return <ArchiveWorkspace isSidebarCollapsed={effectiveCollapsed} />;
      case 'settings':
        return <SettingsWorkspace isSidebarCollapsed={effectiveCollapsed} />;
      default:
        return <ProjectWorkspace isSidebarCollapsed={effectiveCollapsed} />;
    }
  };
  return <div className="flex h-screen pt-[var(--header-height)] overflow-hidden px-0 mx-0 bg-[hsl(var(--ds-color-panel))]">
      <div style={{
      transition: 'var(--ds-transition-smooth)'
    }} className="fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] z-sidebar sidebar-layout bg-[hsl(var(--ds-color-panel))]">
        <Sidebar onToggle={setIsSidebarCollapsed} activeSection={navigationState.activeSection} onSectionChange={handleSectionChange} forceCollapsed={forceCollapsed} />
      </div>

      {renderWorkspace()}
    </div>;
};
export default MainContent;