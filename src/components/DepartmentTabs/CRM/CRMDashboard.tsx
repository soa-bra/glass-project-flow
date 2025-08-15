import React, { useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { UnifiedTabContent } from '@/components/shared/UnifiedTabContent';
import { SoaReveal } from '@/components/ui';
import { OverviewTab } from './OverviewTab';
import { CustomersTab } from './CustomersTab';
import { OpportunitiesTab } from './OpportunitiesTab';
import { ServiceTab } from './ServiceTab';
import { AnalyticsTab } from './AnalyticsTab';
import { TemplatesTab } from './TemplatesTab';
import { ReportsTab } from './ReportsTab';
export const CRMDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const tabItems = [{
    value: 'overview',
    label: 'نظرة عامة'
  }, {
    value: 'customers',
    label: 'العملاء'
  }, {
    value: 'opportunities',
    label: 'الفرص والعروض'
  }, {
    value: 'service',
    label: 'خدمة العملاء والدعم'
  }, {
    value: 'analytics',
    label: 'التحليلات'
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
        title="إدارة علاقات العملاء"
        tabs={tabItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        <UnifiedTabContent value="overview">
          <SoaReveal delay={0.1}>
            <OverviewTab />
          </SoaReveal>
        </UnifiedTabContent>

        <UnifiedTabContent value="customers">
          <SoaReveal delay={0.1}>
            <CustomersTab />
          </SoaReveal>
        </UnifiedTabContent>

        <UnifiedTabContent value="opportunities">
          <SoaReveal delay={0.1}>
            <OpportunitiesTab />
          </SoaReveal>
        </UnifiedTabContent>

        <UnifiedTabContent value="service">
          <SoaReveal delay={0.1}>
            <ServiceTab />
          </SoaReveal>
        </UnifiedTabContent>

        <UnifiedTabContent value="analytics">
          <SoaReveal delay={0.1}>
            <AnalyticsTab />
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