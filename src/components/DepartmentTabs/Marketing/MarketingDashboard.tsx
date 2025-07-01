
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { AnimatedTabs } from '@/components/ui/AnimatedTabs';
import { OverviewTab } from './OverviewTab';
import { CampaignsChannelsTab } from './CampaignsChannelsTab';
import { ContentAssetsTab } from './ContentAssetsTab';
import { PerformanceAnalyticsTab, BudgetsTab, PublicRelationsTab, TemplatesTab, ReportsTab } from './index';

export const MarketingDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabItems = [
    { value: 'overview', label: 'نظرة عامة' },
    { value: 'campaigns', label: 'الحملات والقنوات' },
    { value: 'content', label: 'المحتوى والأصول' },
    { value: 'performance', label: 'الأداء والتحليلات' },
    { value: 'budgets', label: 'الميزانيات' },
    { value: 'pr', label: 'العلاقات العامة' },
    { value: 'templates', label: 'النماذج والقوالب' },
    { value: 'reports', label: 'التقارير' }
  ];

  return (
    <div className="h-full flex flex-col bg-transparent">
      {/* Header with Title and Tabs */}
      <div className="flex items-center justify-between px-6 py-[24px] my-[24px]">
        <h2 className="font-medium text-black font-arabic text-3xl whitespace-nowrap px-[24px]">
          إدارة الأنشطة التسويقية
        </h2>
        <div className="w-fit">
          <AnimatedTabs 
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

          <TabsContent value="campaigns" className="space-y-6">
            <CampaignsChannelsTab />
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <ContentAssetsTab />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <PerformanceAnalyticsTab />
          </TabsContent>

          <TabsContent value="budgets" className="space-y-6">
            <BudgetsTab />
          </TabsContent>

          <TabsContent value="pr" className="space-y-6">
            <PublicRelationsTab />
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <TemplatesTab />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <ReportsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
