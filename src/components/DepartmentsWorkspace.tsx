
import React, { useState } from 'react';
import DepartmentsSidebar from './DepartmentsSidebar';
import DepartmentPanel from './DepartmentPanel';

interface DepartmentsWorkspaceProps {
  isSidebarCollapsed: boolean;
}

const DepartmentsWorkspace: React.FC<DepartmentsWorkspaceProps> = ({ isSidebarCollapsed }) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [isDepartmentsSidebarCollapsed, setIsDepartmentsSidebarCollapsed] = useState(false);

  return (
    <>
      {/* العمود الثاني: سايدبار الإدارات */}
      <div
        className={`fixed h-[calc(100vh-var(--sidebar-top-offset))] z-[110] ${
          isSidebarCollapsed ? 'departments-sidebar-collapsed' : 'departments-sidebar-expanded'
        }`}
        style={{
          top: 'var(--sidebar-top-offset)',
        }}
      >
        <DepartmentsSidebar
          selectedDepartment={selectedDepartment}
          onDepartmentSelect={setSelectedDepartment}
          isCollapsed={isDepartmentsSidebarCollapsed}
          onToggleCollapse={setIsDepartmentsSidebarCollapsed}
          enableTabNotch={true}
        />
      </div>

      {/* العمود الثالث: لوحة الإدارة */}
      <div
        className={`fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] z-[105] ${
          isSidebarCollapsed ? 'departments-panel-collapsed' : 'departments-panel-expanded'
        }`}
      >
        <DepartmentPanel 
          selectedDepartment={selectedDepartment}
          isSidebarCollapsed={isSidebarCollapsed}
        />
      </div>
    </>
  );
};

export default DepartmentsWorkspace;
