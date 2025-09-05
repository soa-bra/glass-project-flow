import React, { useState, useEffect } from 'react';
import { useNavigation } from '@/contexts/NavigationContext';
import DepartmentsSidebar from './DepartmentsSidebar';
import DepartmentPanel from './DepartmentPanel';

interface DepartmentsWorkspaceProps {
  isSidebarCollapsed: boolean;
}

const DepartmentsWorkspace: React.FC<DepartmentsWorkspaceProps> = ({ isSidebarCollapsed }) => {
  const { navigationState, setSelectedDepartment } = useNavigation();
  const [isDepartmentsSidebarCollapsed, setIsDepartmentsSidebarCollapsed] = useState(false);

  // Use navigation state for selected department
  const selectedDepartment = navigationState.selectedDepartment;

  return (
    <>
      {/* العمود الثاني: سايدبار الإدارات */}
      <div
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
      </div>

      {/* العمود الثالث: لوحة الإدارة */}
      <div
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
      </div>
    </>
  );
};

export default DepartmentsWorkspace;