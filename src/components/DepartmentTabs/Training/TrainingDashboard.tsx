import React, { useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { BaseTabContent } from '@/components/shared';
import { dashboardTabsByKey } from '@/config/departmentDashboardTabs';
import { OverviewTab } from './OverviewTab';
import { CoursesTab } from './CoursesTab';
import { LMSTab } from './LMSTab';
import { SchedulingTab } from './SchedulingTab';
import { CertificationsTab } from './CertificationsTab';
import { AnalyticsTab } from './AnalyticsTab';
import { CorporateTab } from './CorporateTab';
import { PartnershipsTab } from './PartnershipsTab';
import { TemplatesTab } from './TemplatesTab';
import { ReportsTab } from './ReportsTab';

export const TrainingDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const tabItems = dashboardTabsByKey.TrainingDashboard;

  return (
    <DashboardLayout
      title="إدارة التدريب"
      tabs={tabItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <BaseTabContent value="overview">
        <OverviewTab />
      </BaseTabContent>

      <BaseTabContent value="courses">
        <CoursesTab />
      </BaseTabContent>

      <BaseTabContent value="lms">
        <LMSTab />
      </BaseTabContent>

      <BaseTabContent value="scheduling">
        <SchedulingTab />
      </BaseTabContent>

      <BaseTabContent value="certifications">
        <CertificationsTab />
      </BaseTabContent>

      <BaseTabContent value="analytics">
        <AnalyticsTab />
      </BaseTabContent>

      <BaseTabContent value="corporate">
        <CorporateTab />
      </BaseTabContent>

      <BaseTabContent value="partnerships">
        <PartnershipsTab />
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
