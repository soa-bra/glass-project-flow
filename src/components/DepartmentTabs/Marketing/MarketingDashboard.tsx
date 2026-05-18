import React, { useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { BaseTabContent } from '@/components/shared';
import { OverviewTab } from './OverviewTab';
import { CampaignsChannelsTab } from './CampaignsChannelsTab';
import { ContentAssetsTab } from './ContentAssetsTab';
import { PerformanceAnalyticsTab, BudgetsTab, PublicRelationsTab, TemplatesTab, ReportsTab } from './index';
export const MarketingDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const tabItems = [{
    value: 'overview',
    label: 'نظرة عامة'
  }, {
    value: 'campaigns',
    label: 'الحملات والقنوات'
  }, {
    value: 'content',
    label: 'المحتوى والأصول'
  }, {
    value: 'performance',
    label: 'الأداء والتحليلات'
  }, {
    value: 'budgets',
    label: 'الميزانيات'
  }, {
    value: 'pr',
    label: 'العلاقات العامة'
  }, {
    value: 'templates',
    label: 'النماذج والقوالب'
  }, {
    value: 'reports',
    label: 'التقارير'
  }];
  return (
    <DashboardLayout
      title="إدارة الأنشطة التسويقية"
      tabs={tabItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <BaseTabContent value="overview">
        <OverviewTab />
      </BaseTabContent>

      <BaseTabContent value="campaigns">
        <CampaignsChannelsTab />
      </BaseTabContent>

      <BaseTabContent value="content">
        <ContentAssetsTab />
      </BaseTabContent>

      <BaseTabContent value="performance">
        <PerformanceAnalyticsTab />
      </BaseTabContent>

      <BaseTabContent value="budgets">
        <BudgetsTab />
      </BaseTabContent>

      <BaseTabContent value="pr">
        <PublicRelationsTab />
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