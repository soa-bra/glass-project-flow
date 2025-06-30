
import React from 'react';
import { FinancialDepartment } from './FinancialDepartment';
import { LegalDepartment } from './LegalDepartment';
import { MarketingDepartment } from './MarketingDepartment';
import { GenericDepartment } from './GenericDepartment';

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
  if (!selectedDepartment) {
    return (
      <div style={{
        background: 'var(--backgrounds-admin-ops-board-bg)'
      }} className="h-full rounded-3xl flex items-center justify-center">
        <div className="text-center text-gray-600 font-arabic">
          <h3 className="text-2xl font-semibold mb-2">اختر إدارة للبدء</h3>
          <p className="text-lg">قم بتحديد إدارة من القائمة الجانبية لعرض المحتوى</p>
        </div>
      </div>
    );
  }

  // Special handling for specific departments
  if (selectedDepartment === 'financial') {
    return <FinancialDepartment />;
  }

  if (selectedDepartment === 'legal') {
    return <LegalDepartment />;
  }

  if (selectedDepartment === 'marketing') {
    return <MarketingDepartment />;
  }

  // Generic department handling
  return <GenericDepartment selectedDepartment={selectedDepartment} />;
};

export default DepartmentPanel;
