import React, { useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { UnifiedTabContent } from '@/components/shared/UnifiedTabContent';
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
      <UnifiedTabContent value="overview">
        <OverviewTab />
      </UnifiedTabContent>

      <UnifiedTabContent value="campaigns">
        <CampaignsChannelsTab />
      </UnifiedTabContent>

      <UnifiedTabContent value="content">
        <ContentAssetsTab />
      </UnifiedTabContent>

      <UnifiedTabContent value="performance">
        <PerformanceAnalyticsTab />
      </UnifiedTabContent>

      <UnifiedTabContent value="budgets">
        <BudgetsTab />
      </UnifiedTabContent>

      <UnifiedTabContent value="pr">
        <PublicRelationsTab />
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