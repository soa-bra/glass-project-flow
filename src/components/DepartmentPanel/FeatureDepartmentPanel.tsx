
import React from 'react';
import { usePermission } from '@/hooks/usePermission';
import { canRunAction } from '@/auth/permissions';
import { FinancialDashboard } from '../DepartmentTabs/Financial';
import { LegalDashboard } from '../DepartmentTabs/Legal';
import { MarketingDashboard } from '../DepartmentTabs/Marketing';
import { HRDashboard } from '../DepartmentTabs/HR';
import { CRMDashboard } from '../DepartmentTabs/CRM';
import { CSRDashboard } from '../DepartmentTabs/CSR';
import { TrainingDashboard } from '../DepartmentTabs/Training';

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
      case 'financial':
        return canRunAction('financial.open', granted) ? <FinancialDashboard /> : <div className="p-6 text-sm text-gray-500">لا تملك صلاحية عرض قسم المالية.</div>;
      case 'legal':
        return canRunAction('legal.open', granted) ? <LegalDashboard /> : <div className="p-6 text-sm text-gray-500">لا تملك صلاحية عرض القسم القانوني.</div>;
      case 'marketing':
        return <MarketingDashboard />;
      case 'hr':
        return canRunAction('hr.open', granted) ? <HRDashboard /> : <div className="p-6 text-sm text-gray-500">لا تملك صلاحية عرض قسم الموارد البشرية.</div>;
      case 'crm':
        return <CRMDashboard />;
      case 'social':
        return <CSRDashboard />;
      case 'training':
        return <TrainingDashboard />;
      default:
        return null;
    }
  };

  return renderDepartmentDashboard();
};
