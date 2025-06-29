
import React, { useState } from 'react';
import DepartmentsSidebar from './DepartmentsSidebar';
import DepartmentPanel from './DepartmentPanel';

interface DepartmentsWorkspaceProps {
  isSidebarCollapsed: boolean;
}

const DepartmentsWorkspace: React.FC<DepartmentsWorkspaceProps> = ({ isSidebarCollapsed }) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [isDepartmentsSidebarCollapsed, setIsDepartmentsSidebarCollapsed] = useState(false);

  // حساب المواضع بناءً على حالة الانطواء مع هامش 10 بكسل
  const departmentsSidebarRight = isSidebarCollapsed ? 'var(--projects-right-collapsed)' : 'var(--projects-right-expanded)';
  const departmentsSidebarWidth = 'var(--projects-width)';
  const departmentPanelRight = isSidebarCollapsed ? 'calc(var(--projects-right-collapsed) + var(--projects-width) + 10px)' : 'calc(var(--projects-right-expanded) + var(--projects-width) + 10px)';
  const departmentPanelWidth = isSidebarCollapsed ? 'calc(100vw - var(--projects-right-collapsed) - var(--projects-width) - 18px)' : 'calc(100vw - var(--projects-right-expanded) - var(--projects-width) - 18px)';

  return (
    <>
      {/* العمود الثاني: سايدبار الإدارات */}
      <div
        className="fixed h-[calc(100vh-var(--sidebar-top-offset))]"
        style={{
          top: 'var(--sidebar-top-offset)',
          right: departmentsSidebarRight,
          width: departmentsSidebarWidth,
          transition: 'all var(--animation-duration-main) var(--animation-easing)',
          zIndex: 110,
        }}
      >
        <div className="w-full h-full p-2 py-0 mx-0 px-[5px]">
          <DepartmentsSidebar
            selectedDepartment={selectedDepartment}
            onDepartmentSelect={setSelectedDepartment}
            isCollapsed={isDepartmentsSidebarCollapsed}
            onToggleCollapse={setIsDepartmentsSidebarCollapsed}
          />
        </div>
      </div>

      {/* العمود الثالث: لوحة الإدارة */}
      <div
        style={{
          right: departmentPanelRight,
          width: departmentPanelWidth,
          transition: 'all var(--animation-duration-main) var(--animation-easing)'
        }}
        className="fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] mx-0"
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
