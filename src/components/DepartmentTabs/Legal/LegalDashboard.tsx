import React, { useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { UnifiedTabContent } from '@/components/shared/UnifiedTabContent';
import { OverviewTab } from './OverviewTab';
import { ContractsTab } from './ContractsTab';
import { ComplianceTab } from './ComplianceTab';
import { RisksTab } from './RisksTab';
import { LicensesTab } from './LicensesTab';
import { TemplatesTab } from './TemplatesTab';
import { ReportsTab } from './ReportsTab';

export const LegalDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const tabItems = [
    { value: 'overview', label: 'النظرة العامة' },
    { value: 'contracts', label: 'العقود والاتفاقيات' },
    { value: 'compliance', label: 'الامتثال' },
    { value: 'risks', label: 'المخاطر والنزاعات' },
    { value: 'licenses', label: 'التراخيص والملكية الفكرية' },
    { value: 'templates', label: 'النماذج والقوالب' },
    { value: 'reports', label: 'التقارير' }
  ];

  return (
    <DashboardLayout
      title="إدارة الأحوال القانونية"
      tabs={tabItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <UnifiedTabContent value="overview">
        <OverviewTab />
      </UnifiedTabContent>

      <UnifiedTabContent value="contracts">
        <ContractsTab />
      </UnifiedTabContent>

      <UnifiedTabContent value="compliance">
        <ComplianceTab />
      </UnifiedTabContent>

      <UnifiedTabContent value="risks">
        <RisksTab />
      </UnifiedTabContent>

      <UnifiedTabContent value="licenses">
        <LicensesTab />
      </UnifiedTabContent>

      <UnifiedTabContent value="templates">
        <TemplatesTab />
      </UnifiedTabContent>

      <UnifiedTabContent value="reports">
        <ReportsTab />
      </UnifiedTabContent>
    </DashboardLayout>
  );
};