import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DepartmentsSidebar from './DepartmentsSidebar';
import DepartmentPanel from './DepartmentPanel';

interface DepartmentsWorkspaceProps {
  isSidebarCollapsed: boolean;
}

const DepartmentsWorkspace: React.FC<DepartmentsWorkspaceProps> = ({ isSidebarCollapsed }) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [isDepartmentsSidebarCollapsed, setIsDepartmentsSidebarCollapsed] = useState(false);

  // Animation variants for departments components
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
      {/* العمود الثاني: سايدبار الإدارات */}
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
        <DepartmentsSidebar
          selectedDepartment={selectedDepartment}
          onDepartmentSelect={setSelectedDepartment}
          isCollapsed={isDepartmentsSidebarCollapsed}
          onToggleCollapse={setIsDepartmentsSidebarCollapsed}
        />
      </motion.div>

      {/* العمود الثالث: لوحة الإدارة */}
      <motion.div
        variants={panelVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ ...transition, delay: 0.2 }}
        className={`fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] ${
          isSidebarCollapsed 
            ? (isDepartmentsSidebarCollapsed ? 'departments-panel-both-collapsed' : 'departments-panel-main-collapsed') 
            : (isDepartmentsSidebarCollapsed ? 'departments-panel-departments-collapsed' : 'departments-panel-both-expanded')
        }`}
      >
        <DepartmentPanel 
          selectedDepartment={selectedDepartment}
          isMainSidebarCollapsed={isSidebarCollapsed}
          isDepartmentsSidebarCollapsed={isDepartmentsSidebarCollapsed}
        />
      </motion.div>
    </>
  );
};

export default DepartmentsWorkspace;
