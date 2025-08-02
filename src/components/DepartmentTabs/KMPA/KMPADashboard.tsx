import React, { useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { UnifiedTabContent } from '@/components/shared/UnifiedTabContent';
import { OverviewTab } from './OverviewTab';
import { KnowledgeRepositoryTab } from './KnowledgeRepositoryTab';
import { AuthoringVersionsTab } from './AuthoringVersionsTab';
import { AnalyticsImpactTab } from './AnalyticsImpactTab';
import { ModelsTemplatesTab } from './ModelsTemplatesTab';
import { ReportsTab } from './ReportsTab';
export const KMPADashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const tabItems = [{
    value: 'overview',
    label: 'نظرة عامة'
  }, {
    value: 'repository',
    label: 'مستودع المعرفة'
  }, {
    value: 'authoring',
    label: 'التأليف والإصدارات'
  }, {
    value: 'analytics',
    label: 'التحليلات والتأثير'
  }, {
    value: 'templates',
    label: 'النماذج والقوالب'
  }, {
    value: 'reports',
    label: 'التقارير'
  }];
  return (
    <DashboardLayout
      title="إدارة المعرفة والنشر والبحث العلمي"
      tabs={tabItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <UnifiedTabContent value="overview">
        <OverviewTab />
      </UnifiedTabContent>

      <UnifiedTabContent value="repository">
        <KnowledgeRepositoryTab />
      </UnifiedTabContent>

      <UnifiedTabContent value="authoring">
        <AuthoringVersionsTab />
      </UnifiedTabContent>

      <UnifiedTabContent value="analytics">
        <AnalyticsImpactTab />
      </UnifiedTabContent>

      <UnifiedTabContent value="templates">
        <ModelsTemplatesTab />
      </UnifiedTabContent>

      <UnifiedTabContent value="reports">
        <ReportsTab />
      </UnifiedTabContent>
    </DashboardLayout>
  );
};