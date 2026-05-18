import React, { useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { BaseTabContent } from '@/components/shared';
import { dashboardTabsByKey } from '@/config/departmentDashboardTabs';
import { OverviewTab } from './OverviewTab';
import { CulturalIdentityTab } from './CulturalIdentityTab';
import { VisualAssetsTab } from './VisualAssetsTab';
import { ContentMessagingTab } from './ContentMessagingTab';
import { CulturalResearchTab } from './CulturalResearchTab';
import { EventsTab } from './EventsTab';
import { TemplatesTab } from './TemplatesTab';
import { ReportsTab } from './ReportsTab';

export const BrandDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const tabItems = dashboardTabsByKey.BrandDashboard;

  return (
    <DashboardLayout
      title="إدارة العلامة التجارية"
      tabs={tabItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <BaseTabContent value="overview">
        <OverviewTab />
      </BaseTabContent>

      <BaseTabContent value="identity">
        <CulturalIdentityTab />
      </BaseTabContent>

      <BaseTabContent value="assets">
        <VisualAssetsTab />
      </BaseTabContent>

      <BaseTabContent value="content">
        <ContentMessagingTab />
      </BaseTabContent>

      <BaseTabContent value="research">
        <CulturalResearchTab />
      </BaseTabContent>

      <BaseTabContent value="events">
        <EventsTab />
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
