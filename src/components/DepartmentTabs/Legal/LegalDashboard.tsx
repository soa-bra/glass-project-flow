import React, { useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { BaseTabContent } from '@/components/shared';
import { dashboardTabsByKey } from '@/config/departmentDashboardTabs';
import { OverviewTab } from './OverviewTab';
import { ContractsTab } from './ContractsTab';
import { ComplianceTab } from './ComplianceTab';
import { RisksTab } from './RisksTab';
import { LicensesTab } from './LicensesTab';
import { TemplatesTab } from './TemplatesTab';
import { ReportsTab } from './ReportsTab';

export const LegalDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const tabItems = dashboardTabsByKey.LegalDashboard;

  return (
    <DashboardLayout
      title="إدارة الأحوال القانونية"
      tabs={tabItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <BaseTabContent value="overview">
        <OverviewTab />
      </BaseTabContent>

      <BaseTabContent value="contracts">
        <ContractsTab />
      </BaseTabContent>

      <BaseTabContent value="compliance">
        <ComplianceTab />
      </BaseTabContent>

      <BaseTabContent value="risks">
        <RisksTab />
      </BaseTabContent>

      <BaseTabContent value="licenses">
        <LicensesTab />
      </BaseTabContent>

      <BaseTabContent value="templates">
        <TemplatesTab />
      </BaseTabContent>

      <BaseTabContent value="reports">
        <ReportsTab />
      </BaseTabContent>
    </DashboardLayout>
  );
};