import React, { useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { UnifiedTabContent } from '@/components/shared/UnifiedTabContent';
import { SoaReveal } from '@/components/ui';
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
    <SoaReveal>
      <DashboardLayout
        title="إدارة الأنشطة التسويقية"
        tabs={tabItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        <UnifiedTabContent value="overview">
          <SoaReveal delay={0.1}>
            <OverviewTab />
          </SoaReveal>
        </UnifiedTabContent>

        <UnifiedTabContent value="campaigns">
          <SoaReveal delay={0.1}>
            <CampaignsChannelsTab />
          </SoaReveal>
        </UnifiedTabContent>

        <UnifiedTabContent value="content">
          <SoaReveal delay={0.1}>
            <ContentAssetsTab />
          </SoaReveal>
        </UnifiedTabContent>

        <UnifiedTabContent value="performance">
          <SoaReveal delay={0.1}>
            <PerformanceAnalyticsTab />
          </SoaReveal>
        </UnifiedTabContent>

        <UnifiedTabContent value="budgets">
          <SoaReveal delay={0.1}>
            <BudgetsTab />
          </SoaReveal>
        </UnifiedTabContent>

        <UnifiedTabContent value="pr">
          <SoaReveal delay={0.1}>
            <PublicRelationsTab />
          </SoaReveal>
        </UnifiedTabContent>

        <UnifiedTabContent value="templates">
          <SoaReveal delay={0.1}>
            <TemplatesTab />
          </SoaReveal>
        </UnifiedTabContent>

        <UnifiedTabContent value="reports">
          <SoaReveal delay={0.1}>
            <ReportsTab />
          </SoaReveal>
        </UnifiedTabContent>
      </DashboardLayout>
    </SoaReveal>
  );
};