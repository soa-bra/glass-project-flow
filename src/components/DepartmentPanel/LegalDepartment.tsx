
import React from 'react';
import { LegalOverviewTab, ContractsTab, ComplianceTab, RisksDisputesTab, LicensesIPTab } from '../DepartmentTabs/Legal';
import { TemplatesTab } from '../DepartmentTabs/TemplatesTab';
import { ReportsTab } from '../DepartmentTabs/ReportsTab';
import { DepartmentPanelHeader } from './DepartmentPanelHeader';
import { DepartmentContent } from './DepartmentContent';
import { legalTabs } from './departmentConfig';

export const LegalDepartment: React.FC = () => {
  const renderLegalTabContent = (tab: string) => {
    switch (tab) {
      case 'النظرة العامة':
        return <LegalOverviewTab />;
      case 'العقود والاتفاقيات':
        return <ContractsTab />;
      case 'الامتثال':
        return <ComplianceTab />;
      case 'المخاطر والنزاعات':
        return <RisksDisputesTab />;
      case 'التراخيص والملكية الفكرية':
        return <LicensesIPTab />;
      case 'النماذج والقوالب':
        return <TemplatesTab departmentTitle="إدارة الأحوال القانونية" />;
      case 'التقارير':
        return <ReportsTab departmentTitle="إدارة الأحوال القانونية" />;
      default:
        return (
          <div className="text-center text-gray-600 font-arabic p-8">
            <h3 className="text-xl font-semibold mb-2">{tab}</h3>
            <p className="text-base">محتوى تبويب {tab} سيتم تطويره هنا</p>
          </div>
        );
    }
  };

  return (
    <div style={{
      background: 'var(--backgrounds-admin-ops-board-bg)'
    }} className="h-full rounded-3xl overflow-hidden">
      <div className="h-full flex flex-col">
        <DepartmentPanelHeader title="إدارة الأحوال القانونية" tabs={legalTabs} />
        <DepartmentContent tabs={legalTabs} renderTabContent={renderLegalTabContent} />
      </div>
    </div>
  );
};
