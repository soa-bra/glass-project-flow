
import React from 'react';
import { DepartmentPanelLayout } from './DepartmentPanelLayout';
import { FeatureDepartmentPanel } from './FeatureDepartmentPanel';
import { BaseDepartmentPanel } from './BaseDepartmentPanel';
import { EmptyDepartmentState } from './EmptyDepartmentState';
import { ManagedBox, type BoxStatus } from '@/components/common/ManagedBox';

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
  const status: BoxStatus = selectedDepartment ? 'data' : 'empty';

  // Departments with specialized dashboards
  const specializedDepartments = ['financial', 'legal', 'marketing', 'hr', 'crm', 'partnerships', 'social', 'training', 'research', 'knowledge', 'brand', 'brand-community'];
  
  return (
    <ManagedBox
      boxRef="departments-box"
      title="الإدارات"
      status={status}
      emptyState={<EmptyDepartmentState />}
    >
      {selectedDepartment ? (
        specializedDepartments.includes(selectedDepartment) ? (
          <DepartmentPanelLayout>
            <FeatureDepartmentPanel selectedDepartment={selectedDepartment} />
          </DepartmentPanelLayout>
        ) : (
          <div className="h-full rounded-3xl overflow-hidden" style={{ background: 'var(--sb-column-2-bg)' }}>
            <BaseDepartmentPanel selectedDepartment={selectedDepartment} />
          </div>
        )
      ) : null}
    </ManagedBox>
  );
};

export default DepartmentPanel;
