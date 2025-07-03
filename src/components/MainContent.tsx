
import Sidebar from '@/components/Sidebar';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ProjectWorkspace from './ProjectWorkspace';
import DepartmentsWorkspace from './DepartmentsWorkspace';
import ArchiveWorkspace from './ArchiveWorkspace';
import SettingsWorkspace from './SettingsWorkspace';
import PlanningWorkspace from './PlanningWorkspace';

const MainContent = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('home'); // 'home', 'departments', 'archive', etc.
  const [previousSidebarState, setPreviousSidebarState] = useState(false);

  // Handle section changes and sidebar state
  const handleSectionChange = (section: string) => {
    if (section === 'planning' && activeSection !== 'planning') {
      // Entering planning section - save current state and force collapse
      setPreviousSidebarState(isSidebarCollapsed);
    } else if (activeSection === 'planning' && section !== 'planning') {
      // Leaving planning section - restore previous state
      setIsSidebarCollapsed(previousSidebarState);
    }
    setActiveSection(section);
  };

  // Force collapsed state for planning section
  const forceCollapsed = activeSection === 'planning';
  const effectiveCollapsed = forceCollapsed || isSidebarCollapsed;

  // Animation variants for smooth section transitions
  const sectionVariants = {
    initial: { 
      opacity: 0, 
      x: 60,
      scale: 0.95
    },
    animate: { 
      opacity: 1, 
      x: 0,
      scale: 1
    },
    exit: { 
      opacity: 0, 
      x: -40,
      scale: 0.98
    }
  };

  const sectionTransition = {
    duration: 0.4,
    ease: [0.4, 0, 0.2, 1] as [number, number, number, number]
  };

  const renderWorkspace = () => {
    const workspaceComponents = {
      departments: <DepartmentsWorkspace isSidebarCollapsed={effectiveCollapsed} />,
      planning: <PlanningWorkspace isSidebarCollapsed={effectiveCollapsed} />,
      archive: <ArchiveWorkspace isSidebarCollapsed={effectiveCollapsed} />,
      settings: <SettingsWorkspace isSidebarCollapsed={effectiveCollapsed} />,
      home: <ProjectWorkspace isSidebarCollapsed={effectiveCollapsed} />
    };

    const currentComponent = workspaceComponents[activeSection] || workspaceComponents.home;

    return (
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeSection}
          variants={sectionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={sectionTransition}
          className="w-full h-full"
        >
          {currentComponent}
        </motion.div>
      </AnimatePresence>
    );
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
          onSectionChange={handleSectionChange}
          forceCollapsed={forceCollapsed}
        />
      </div>

      {renderWorkspace()}
    </div>
  );
};

export default MainContent;
