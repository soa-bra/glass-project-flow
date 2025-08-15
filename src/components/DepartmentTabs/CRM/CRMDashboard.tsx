import React, { useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { UnifiedTabContent } from '@/components/shared/UnifiedTabContent';
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
      <UnifiedTabContent value="overview">
        <OverviewTab />
      </UnifiedTabContent>

      <UnifiedTabContent value="customers">
        <CustomersTab />
      </UnifiedTabContent>

      <UnifiedTabContent value="opportunities">
        <OpportunitiesTab />
      </UnifiedTabContent>

      <UnifiedTabContent value="service">
        <ServiceTab />
      </UnifiedTabContent>

      <UnifiedTabContent value="analytics">
        <AnalyticsTab />
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