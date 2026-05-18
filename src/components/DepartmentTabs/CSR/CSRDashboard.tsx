import React, { useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { BaseTabContent } from '@/components/shared';
import { dashboardTabsByKey } from '@/config/departmentDashboardTabs';
import { OverviewTab } from './OverviewTab';
import { InitiativesTab } from './InitiativesTab';
import { PartnershipsTab } from './PartnershipsTab';
import { MonitoringTab } from './MonitoringTab';
import { StoriesTab } from './StoriesTab';
import { TemplatesTab } from './TemplatesTab';
import { ReportsTab } from './ReportsTab';

export const CSRDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const tabItems = dashboardTabsByKey.CSRDashboard;

  return (
    <DashboardLayout
      title="إدارة المسؤولية الاجتماعية"
      tabs={tabItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <BaseTabContent value="overview">
        <OverviewTab />
      </BaseTabContent>

      <BaseTabContent value="initiatives">
        <InitiativesTab />
      </BaseTabContent>

      <BaseTabContent value="partnerships">
        <PartnershipsTab />
      </BaseTabContent>

      <BaseTabContent value="monitoring">
        <MonitoringTab />
      </BaseTabContent>

      <BaseTabContent value="stories">
        <StoriesTab />
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
