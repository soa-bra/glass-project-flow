import React, { useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { BaseTabContent } from '@/components/shared';
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
    <DashboardLayout
      title="إدارة علاقات العملاء"
      tabs={tabItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <BaseTabContent value="overview">
        <OverviewTab />
      </BaseTabContent>

      <BaseTabContent value="customers">
        <CustomersTab />
      </BaseTabContent>

      <BaseTabContent value="opportunities">
        <OpportunitiesTab />
      </BaseTabContent>

      <BaseTabContent value="service">
        <ServiceTab />
      </BaseTabContent>

      <BaseTabContent value="analytics">
        <AnalyticsTab />
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