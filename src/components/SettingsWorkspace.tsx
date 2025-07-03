import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SettingsSidebar from './SettingsSidebar';
import SettingsPanel from './SettingsPanel';

interface SettingsWorkspaceProps {
  isSidebarCollapsed: boolean;
}

const SettingsWorkspace: React.FC<SettingsWorkspaceProps> = ({ isSidebarCollapsed }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSettingsSidebarCollapsed, setIsSettingsSidebarCollapsed] = useState(false);

  // Animation variants
  const sidebarVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  const panelVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 40 }
  };

  const transition = {
    duration: 0.5,
    ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    delay: 0.1
  };

  return (
    <>
      {/* Settings Categories Sidebar */}
      <motion.div
        variants={sidebarVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={transition}
        className={`fixed h-[calc(100vh-var(--sidebar-top-offset))] ${
          isSidebarCollapsed ? 'departments-sidebar-collapsed' : 'departments-sidebar-expanded'
        }`}
        style={{
          top: 'var(--sidebar-top-offset)',
          zIndex: 110,
        }}
      >
        <SettingsSidebar
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          isCollapsed={isSettingsSidebarCollapsed}
          onToggleCollapse={setIsSettingsSidebarCollapsed}
        />
      </motion.div>

      {/* Settings Content Panel */}
      <motion.div
        variants={panelVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ ...transition, delay: 0.2 }}
        className={`fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] ${
          isSidebarCollapsed 
            ? (isSettingsSidebarCollapsed ? 'departments-panel-both-collapsed' : 'departments-panel-main-collapsed') 
            : (isSettingsSidebarCollapsed ? 'departments-panel-departments-collapsed' : 'departments-panel-both-expanded')
        }`}
      >
        <SettingsPanel 
          selectedCategory={selectedCategory}
          isMainSidebarCollapsed={isSidebarCollapsed}
          isSettingsSidebarCollapsed={isSettingsSidebarCollapsed}
        />
      </motion.div>
    </>
  );
};

export default SettingsWorkspace;