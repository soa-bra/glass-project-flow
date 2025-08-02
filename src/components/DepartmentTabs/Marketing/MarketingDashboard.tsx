import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { AnimatedTabs } from '@/components/ui/AnimatedTabs';
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
  return <div className="h-full flex flex-col bg-transparent">
      {/* Header with Title and Tabs */}
      <div className="flex items-center justify-between my-0 py-0 px-0">
        <h2 className="font-medium text-black font-arabic text-3xl whitespace-nowrap px-[10px]">
          إدارة الأنشطة التسويقية
        </h2>
        <div className="w-fit">
          <AnimatedTabs tabs={tabItems} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto font-arabic py-0 px-0 my-[25px]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
          <TabsContent value="overview" className="mb-6 py-0 px-0 my-0">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="campaigns" className="mb-6 py-0 px-0 my-0">
            <CampaignsChannelsTab />
          </TabsContent>

          <TabsContent value="content" className="mb-6 py-0 px-0 my-0">
            <ContentAssetsTab />
          </TabsContent>

          <TabsContent value="performance" className="mb-6 py-0 px-0 my-0">
            <PerformanceAnalyticsTab />
          </TabsContent>

          <TabsContent value="budgets" className="mb-6 py-0 px-0 my-0">
            <BudgetsTab />
          </TabsContent>

          <TabsContent value="pr" className="mb-6 py-0 px-0 my-0">
            <PublicRelationsTab />
          </TabsContent>

          <TabsContent value="templates" className="mb-6 py-0 px-0 my-0">
            <TemplatesTab />
          </TabsContent>

          <TabsContent value="reports" className="mb-6 py-0 px-0 my-0">
            <ReportsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>;
};