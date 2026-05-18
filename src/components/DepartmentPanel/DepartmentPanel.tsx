
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
  // Departments with specialized dashboards
  const specializedDepartments = ['financial', 'legal', 'marketing', 'hr', 'crm', 'partnerships', 'social', 'training', 'research', 'knowledge', 'brand', 'brand-community'];
  
  if (!selectedDepartment) {
    return <EmptyDepartmentState />;
  }

  return specializedDepartments.includes(selectedDepartment) ? (
    <DepartmentPanelLayout>
      <FeatureDepartmentPanel selectedDepartment={selectedDepartment} />
    </DepartmentPanelLayout>
  ) : (
    <BaseDepartmentPanel selectedDepartment={selectedDepartment} />
  );
};

export default DepartmentPanel;
