
import React from 'react';
import DepartmentsSidebar from './DepartmentsSidebar';
import DepartmentPanel from './DepartmentPanel';
import { useDepartmentPanelAnimation } from '@/hooks/useDepartmentPanelAnimation';

interface DepartmentsWorkspaceProps {
  isSidebarCollapsed: boolean;
}

const DepartmentsWorkspace: React.FC<DepartmentsWorkspaceProps> = ({ isSidebarCollapsed }) => {
  const {
    panelStage,
    selectedDepartmentId,
    displayedDepartmentId,
    operationsBoardClass,
    departmentsColumnClass,
    handleDepartmentSelect,
    closePanel,
  } = useDepartmentPanelAnimation();

  return (
    <>
      {/* العمود الثاني: سايدبار الإدارات */}
      <div
        className={`fixed h-[calc(100vh-var(--sidebar-top-offset))] ${
          isSidebarCollapsed ? 'departments-sidebar-collapsed' : 'departments-sidebar-expanded'
        } ${departmentsColumnClass}`}
        style={{
          top: 'var(--sidebar-top-offset)',
          zIndex: 110,
        }}
      >
        <DepartmentsSidebar
          selectedDepartment={selectedDepartmentId}
          onDepartmentSelect={handleDepartmentSelect}
        />
      </div>

      {/* العمود الثالث: لوحة الإدارة */}
      <div
        className={`fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] ${
          isSidebarCollapsed ? 'departments-panel-collapsed' : 'departments-panel-expanded'
        } ${operationsBoardClass}`}
      >
        <DepartmentPanel 
          selectedDepartment={displayedDepartmentId}
          panelStage={panelStage}
          onClose={closePanel}
        />
      </div>
    </>
  );
};

export default DepartmentsWorkspace;
