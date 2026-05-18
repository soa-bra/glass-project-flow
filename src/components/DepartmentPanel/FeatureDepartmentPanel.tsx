import React from 'react';
import { usePermission } from '@/hooks/usePermission';
import { canRunAction } from '@/auth/permissions';
import { resolveDepartment, getDepartmentCoverageReport } from '../DepartmentTabs/shared/departmentResolver';
import { PartnershipsDashboard } from '../DepartmentTabs/Partnerships';
import { KnowledgeBaseDashboard } from '../DepartmentTabs/Knowledge';
import { BrandCommunityDashboard } from '../DepartmentTabs/BrandCommunity';

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

  const renderDepartmentDashboard = () => {
    switch (selectedDepartment) {
      case 'partnerships':
        return <PartnershipsDashboard />;
      case 'knowledge':
        return <KnowledgeBaseDashboard />;
      case 'brand-community':
        return <BrandCommunityDashboard />;
      default:
        break;
    }

    const resolved = resolveDepartment(selectedDepartment);
    if (!resolved) {
      return <div className="p-6 text-sm text-red-600">مفتاح الإدارة غير موجود في departmentsSpecification: {selectedDepartment}</div>;
    }

    const dashboardName = resolved.spec.dashboard;
    if (!resolved.dashboardComponent) {
      return <div className="p-6 text-sm text-red-600">لا يوجد تنفيذ Dashboard للمفتاح: {selectedDepartment} ({dashboardName})</div>;
    }

    if (selectedDepartment === 'financial' && !canRunAction('financial.open', granted)) {
      return <div className="p-6 text-sm text-gray-500">لا تملك صلاحية عرض قسم المالية.</div>;
    }
    if (selectedDepartment === 'legal' && !canRunAction('legal.open', granted)) {
      return <div className="p-6 text-sm text-gray-500">لا تملك صلاحية عرض القسم القانوني.</div>;
    }
    if (selectedDepartment === 'hr' && !canRunAction('hr.open', granted)) {
      return <div className="p-6 text-sm text-gray-500">لا تملك صلاحية عرض قسم الموارد البشرية.</div>;
    }

    const DashboardComponent = resolved.dashboardComponent;
    return <DashboardComponent />;
  };

  React.useEffect(() => {
    const report = getDepartmentCoverageReport();
    console.table(report);
  }, []);

  return renderDepartmentDashboard();
};
