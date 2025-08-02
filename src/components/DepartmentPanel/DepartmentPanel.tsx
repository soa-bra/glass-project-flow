import React from 'react';
import { DepartmentPanelLayout } from './DepartmentPanelLayout';
import { SpecializedDepartmentPanel } from './SpecializedDepartmentPanel';
import { GenericDepartmentPanel } from './GenericDepartmentPanel';
import { EmptyDepartmentState } from './EmptyDepartmentState';
interface DepartmentPanelProps {
  selectedDepartment: string | null;
  isMainSidebarCollapsed: boolean;
  isDepartmentsSidebarCollapsed: boolean;
}
const DepartmentPanel: React.FC<DepartmentPanelProps> = ({
  selectedDepartment,
  isMainSidebarCollapsed,
  isDepartmentsSidebarCollapsed
}) => {
  // Early return for no selection
  if (!selectedDepartment) {
    return <EmptyDepartmentState />;
  }

  // Departments with specialized dashboards
  const specializedDepartments = ['financial', 'legal', 'marketing', 'hr', 'crm', 'social', 'training'];
  if (specializedDepartments.includes(selectedDepartment)) {
    return <DepartmentPanelLayout>
        <SpecializedDepartmentPanel selectedDepartment={selectedDepartment} />
      </DepartmentPanelLayout>;
  }

  // Generic departments with tabbed interface
  return <div style={{
    background: 'var(--backgrounds-admin-ops-board-bg)'
  }} className="flex-1 overflow-auto px-0 mx-0 bg-[#d9e7ed] rounded-3xl">
      <GenericDepartmentPanel selectedDepartment={selectedDepartment} />
    </div>;
};
export default DepartmentPanel;