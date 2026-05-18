import React, { useState, useEffect } from 'react';
import { useNavigation } from '@/contexts/NavigationContext';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { BaseTabContent } from '@/components/shared';
import { dashboardTabsByKey } from '@/config/departmentDashboardTabs';
import { OverviewTab } from './OverviewTab';
import { CustomersTab } from './CustomersTab';
import { OpportunitiesTab } from './OpportunitiesTab';
import { ServiceTab } from './ServiceTab';
import { AnalyticsTab } from './AnalyticsTab';
import { TemplatesTab } from './TemplatesTab';
import { ReportsTab } from './ReportsTab';
export const CRMDashboard: React.FC = () => {
  const { navigationState } = useNavigation();
  const [activeTab, setActiveTab] = useState('overview');

  // Switch to customers tab when navigating with a selected customer
  useEffect(() => {
    if (navigationState.selectedCustomer) {
      setActiveTab('customers');
    }
  }, [navigationState.selectedCustomer]);
  const tabItems = dashboardTabsByKey.CRMDashboard;
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