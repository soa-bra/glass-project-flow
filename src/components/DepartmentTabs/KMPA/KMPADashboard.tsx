
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { ScrollableAnimatedTabs } from '@/components/ui/ScrollableAnimatedTabs';
import { OverviewTab } from './OverviewTab';
import { KnowledgeRepositoryTab } from './KnowledgeRepositoryTab';
import { AuthoringVersionsTab } from './AuthoringVersionsTab';
import { AnalyticsImpactTab } from './AnalyticsImpactTab';
import { ModelsTemplatesTab } from './ModelsTemplatesTab';
import { ReportsTab } from './ReportsTab';

export const KMPADashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabItems = [
    { value: 'overview', label: 'نظرة عامة' },
    { value: 'repository', label: 'مستودع المعرفة' },
    { value: 'authoring', label: 'التأليف والإصدارات' },
    { value: 'analytics', label: 'التحليلات والتأثير' },
    { value: 'templates', label: 'النماذج والقوالب' },
    { value: 'reports', label: 'التقارير' }
  ];

  return (
    <div className="h-full flex flex-col bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-[24px] my-[24px]">
        <h2 className="font-medium text-black font-arabic text-3xl whitespace-nowrap px-[24px]">
          إدارة المعرفة والنشر والبحث العلمي
        </h2>
        <div className="flex-1 max-w-full">
          <ScrollableAnimatedTabs 
            tabs={tabItems}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
          <TabsContent value="overview" className="space-y-6">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="repository" className="space-y-6">
            <KnowledgeRepositoryTab />
          </TabsContent>

          <TabsContent value="authoring" className="space-y-6">
            <AuthoringVersionsTab />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsImpactTab />
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <ModelsTemplatesTab />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <ReportsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
