import React, { useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { BaseTabContent } from '@/components/shared';
import { dashboardTabsByKey } from '@/config/departmentDashboardTabs';
import { OverviewTab } from './OverviewTab';
import { KnowledgeRepositoryTab } from './KnowledgeRepositoryTab';
import { AuthoringVersionsTab } from './AuthoringVersionsTab';
import { AnalyticsImpactTab } from './AnalyticsImpactTab';
import { ModelsTemplatesTab } from './ModelsTemplatesTab';
import { ReportsTab } from './ReportsTab';
export const KMPADashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const tabItems = dashboardTabsByKey.KMPADashboard;
  return (
    <DashboardLayout
      title="إدارة المعرفة والنشر والبحث العلمي"
      tabs={tabItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <BaseTabContent value="overview">
        <OverviewTab />
      </BaseTabContent>

      <BaseTabContent value="repository">
        <KnowledgeRepositoryTab />
      </BaseTabContent>

      <BaseTabContent value="authoring">
        <AuthoringVersionsTab />
      </BaseTabContent>

      <BaseTabContent value="analytics">
        <AnalyticsImpactTab />
      </BaseTabContent>

      <BaseTabContent value="templates">
        <ModelsTemplatesTab />
      </BaseTabContent>

      <BaseTabContent value="reports">
        <ReportsTab />
      </BaseTabContent>
    </DashboardLayout>
  );
};