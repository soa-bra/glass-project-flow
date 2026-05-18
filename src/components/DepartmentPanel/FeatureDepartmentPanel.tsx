import React from 'react';
import { usePermission } from '@/hooks/usePermission';
import { canRunAction } from '@/auth/permissions';
import {
  getDepartmentCoverageReport,
  logDepartmentImplementationGaps,
  resolveDepartment
} from '../DepartmentTabs/shared/departmentResolver';

interface FeatureDepartmentPanelProps {
  selectedDepartment: string;
}

export const FeatureDepartmentPanel: React.FC<FeatureDepartmentPanelProps> = ({
  selectedDepartment
}) => {
  const financialRead = usePermission('financial.read');
  const legalRead = usePermission('legal.read');
  const hrRead = usePermission('hr.read');

  const granted = new Set<string>();
  if (financialRead.allowed) granted.add('financial.read');
  if (legalRead.allowed) granted.add('legal.read');
  if (hrRead.allowed) granted.add('hr.read');

  const resolved = resolveDepartment(selectedDepartment);
  logDepartmentImplementationGaps(selectedDepartment);

  if (!resolved) {
    return <div className="p-6 text-sm text-red-600">قسم غير معروف: {selectedDepartment}</div>;
  }

  const { specification, dashboardComponent: DashboardComponent } = resolved;

  if (selectedDepartment === 'financial' && !canRunAction('financial.open', granted)) {
    return <div className="p-6 text-sm text-gray-500">لا تملك صلاحية عرض قسم المالية.</div>;
  }

  if (selectedDepartment === 'legal' && !canRunAction('legal.open', granted)) {
    return <div className="p-6 text-sm text-gray-500">لا تملك صلاحية عرض القسم القانوني.</div>;
  }

  if (selectedDepartment === 'hr' && !canRunAction('hr.open', granted)) {
    return <div className="p-6 text-sm text-gray-500">لا تملك صلاحية عرض قسم الموارد البشرية.</div>;
  }

  if (!DashboardComponent) {
    console.error(`[Departments] Dashboard component is not implemented for key: ${selectedDepartment}`);
    const coverage = getDepartmentCoverageReport().find((item) => item.key === selectedDepartment);
    return (
      <div className="p-6 text-sm text-gray-600 space-y-2">
        <div>{`Dashboard ${specification.dashboard} غير منفذ حتى الآن.`}</div>
        {coverage && (
          <div className="text-xs text-gray-500">
            {`Coverage: ${coverage.implementedTabs}/${coverage.specifiedTabs} tabs`}
          </div>
        )}
      </div>
    );
  }

  return <DashboardComponent />;
};
