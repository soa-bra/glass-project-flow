
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

      {/* العمود الثالث: لوحة الإدارة - مربوطة من اليمين بالشاشة ومن اليسار بشريط الإدارات */}
      <div
        className="fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))]"
        style={{
          right: '0px',
          left: isDepartmentsSidebarCollapsed 
            ? isSidebarCollapsed 
              ? 'calc(var(--sidebar-width-collapsed) + var(--departments-sidebar-width-collapsed) + 22px)'
              : 'calc(var(--sidebar-width-expanded) + var(--departments-sidebar-width-collapsed) + 22px)'
            : isSidebarCollapsed
              ? 'calc(var(--sidebar-width-collapsed) + var(--departments-sidebar-width-expanded) + 22px)'
              : 'calc(var(--sidebar-width-expanded) + var(--departments-sidebar-width-expanded) + 22px)',
          transition: 'all var(--animation-duration-main) var(--animation-easing)',
        }}
      >
        <div className="h-full px-[22px]">
          <DepartmentPanel 
            selectedDepartment={selectedDepartment}
            isSidebarCollapsed={isSidebarCollapsed}
            isDepartmentsSidebarCollapsed={isDepartmentsSidebarCollapsed}
          />
        </div>
      </div>
    </>
  );
};

export default DepartmentsWorkspace;
