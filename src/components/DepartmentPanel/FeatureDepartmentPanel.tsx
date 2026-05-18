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
  const financialRead = usePermission('financial.open');
  const legalRead = usePermission('legal.open');
  const hrRead = usePermission('hr.open');

  const granted = new Set<string>();
  if (financialRead.allowed) granted.add('financial.open');
  if (legalRead.allowed) granted.add('legal.open');
  if (hrRead.allowed) granted.add('hr.open');

  const renderStateBlock = (state: 'empty' | 'error', title: string, details: string) => (
    <section className="m-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm">
      <h3 className={`mb-2 font-semibold ${state === 'error' ? 'text-red-700' : 'text-amber-700'}`}>{title}</h3>
      <p className="text-slate-700">{details}</p>
    </section>
  );

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
      return renderStateBlock('error', 'Endpoint Error State', `مفتاح الإدارة غير موجود في departmentsSpecification: ${selectedDepartment}`);
    }

    const dashboardName = resolved.spec.dashboard;
    if (!resolved.dashboardComponent) {
      return renderStateBlock('error', 'Endpoint Error State', `لا يوجد تنفيذ Dashboard للمفتاح: ${selectedDepartment} (${dashboardName})`);
    }

    const unresolvedTabs = resolved.tabContracts.filter((tab) => tab.state !== 'ready');
    if (unresolvedTabs.length > 0) {
      return renderStateBlock(
        'empty',
        'Endpoint Empty State',
        `التبويبات غير المنفذة: ${unresolvedTabs.map((tab) => tab.tab).join('، ')}`,
      );
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
    const matrix = buildDepartmentVerificationMatrix(selectedDepartment);
    console.table(report);
    console.table(matrix);
  }, [selectedDepartment]);

  return renderDepartmentDashboard();
};
