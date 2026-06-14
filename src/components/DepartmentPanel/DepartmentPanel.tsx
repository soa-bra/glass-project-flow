
import React from 'react';
import { DepartmentPanelLayout } from './DepartmentPanelLayout';
import { FeatureDepartmentPanel } from './FeatureDepartmentPanel';
import { BaseDepartmentPanel } from './BaseDepartmentPanel';
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
  const specializedDepartments = ['financial', 'legal', 'marketing', 'hr', 'crm', 'csr', 'training', 'kmpa', 'brand', 'bcm', 'partnerships', 'knowledge'];
  
  if (specializedDepartments.includes(selectedDepartment)) {
    return (
      <DepartmentPanelLayout>
        <FeatureDepartmentPanel selectedDepartment={selectedDepartment} />
      </DepartmentPanelLayout>
    );
  }

  // Generic departments with tabbed interface
  return (
    <div className="flex h-full min-h-0 flex-col rounded-3xl" style={{ background: 'var(--sb-column-2-bg)' }}>
      <BaseDepartmentPanel selectedDepartment={selectedDepartment} />
    </div>
  );
};

export default DepartmentPanel;
