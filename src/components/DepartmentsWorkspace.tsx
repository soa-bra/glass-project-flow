
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

      {/* العمود الثالث: لوحة الإدارة - مربوطة بحالة شريط الإدارات */}
      <div
        className="fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))]"
        style={{
          right: '22px',
          left: isDepartmentsSidebarCollapsed 
            ? isSidebarCollapsed 
              ? 'calc(var(--sidebar-width-collapsed) + var(--departments-sidebar-width-collapsed) + 44px)'
              : 'calc(var(--sidebar-width-expanded) + var(--departments-sidebar-width-collapsed) + 44px)'
            : isSidebarCollapsed
              ? 'calc(var(--sidebar-width-collapsed) + var(--departments-sidebar-width-expanded) + 44px)'
              : 'calc(var(--sidebar-width-expanded) + var(--departments-sidebar-width-expanded) + 44px)',
          transition: 'all var(--animation-duration-main) var(--animation-easing)',
        }}
      >
        <DepartmentPanel 
          selectedDepartment={selectedDepartment}
          isSidebarCollapsed={isSidebarCollapsed}
          isDepartmentsSidebarCollapsed={isDepartmentsSidebarCollapsed}
        />
      </div>
    </>
  );
};

export default DepartmentsWorkspace;
