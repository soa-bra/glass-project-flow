import React, { useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { BaseTabContent } from '@/components/shared';
import { OverviewTab } from './OverviewTab';
import { ResearchPipelineTab } from './ResearchPipelineTab';
import { PublicationsTab } from './PublicationsTab';
import { KnowledgeRepositoryTab } from './KnowledgeRepositoryTab';
import { AuthoringVersionsTab } from './AuthoringVersionsTab';
import { PeerReviewTab } from './PeerReviewTab';
import { AnalyticsImpactTab } from './AnalyticsImpactTab';
import { ModelsTemplatesTab } from './ModelsTemplatesTab';
import { ReportsTab } from './ReportsTab';

export const KMPADashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const tabItems = [
    { value: 'overview', label: 'نظرة عامة' },
    { value: 'research-pipeline', label: 'مسار الأبحاث' },
    { value: 'publications', label: 'النشر' },
    { value: 'repository', label: 'المستودع البحثي' },
    { value: 'authoring', label: 'التأليف والإصدارات' },
    { value: 'peer-review', label: 'التحكيم والمراجعة' },
    { value: 'analytics', label: 'التحليلات والتأثير' },
    { value: 'templates', label: 'النماذج والقوالب' },
    { value: 'reports', label: 'التقارير' },
  ];

  return (
    <DashboardLayout
      title="إدارة المعرفة والنشر والبحث العلمي"
      tabs={tabItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <BaseTabContent value="overview"><OverviewTab /></BaseTabContent>
      <BaseTabContent value="research-pipeline"><ResearchPipelineTab /></BaseTabContent>
      <BaseTabContent value="publications"><PublicationsTab /></BaseTabContent>
      <BaseTabContent value="repository"><KnowledgeRepositoryTab /></BaseTabContent>
      <BaseTabContent value="authoring"><AuthoringVersionsTab /></BaseTabContent>
      <BaseTabContent value="peer-review"><PeerReviewTab /></BaseTabContent>
      <BaseTabContent value="analytics"><AnalyticsImpactTab /></BaseTabContent>
      <BaseTabContent value="templates"><ModelsTemplatesTab /></BaseTabContent>
      <BaseTabContent value="reports"><ReportsTab /></BaseTabContent>
    </DashboardLayout>
  );
};
