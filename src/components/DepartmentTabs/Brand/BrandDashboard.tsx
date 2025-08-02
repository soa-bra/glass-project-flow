import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { AnimatedTabs } from '@/components/ui/AnimatedTabs';
import { OverviewTab } from './OverviewTab';
import { CulturalIdentityTab } from './CulturalIdentityTab';
import { VisualAssetsTab } from './VisualAssetsTab';
import { ContentMessagingTab } from './ContentMessagingTab';
import { CulturalResearchTab } from './CulturalResearchTab';
import { EventsTab } from './EventsTab';
import { TemplatesTab } from './TemplatesTab';
import { ReportsTab } from './ReportsTab';
export const BrandDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const tabItems = [{
    value: 'overview',
    label: 'نظرة عامة'
  }, {
    value: 'identity',
    label: 'الهوية الثقافية'
  }, {
    value: 'assets',
    label: 'الأصول البصرية'
  }, {
    value: 'content',
    label: 'المحتوى والرسائل'
  }, {
    value: 'research',
    label: 'البحث والتطوير الثقافي'
  }, {
    value: 'events',
    label: 'الفعاليات'
  }, {
    value: 'templates',
    label: 'النماذج والقوالب'
  }, {
    value: 'reports',
    label: 'التقارير'
  }];
  return <div className="h-full flex flex-col bg-#d9e7ed ">
      {/* Header with Title and Tabs */}
      <div className="flex items-center justify-between px-6 py-[24px] my-[24px]">
        <h2 className="font-medium text-black font-arabic text-3xl whitespace-nowrap px-[24px]">
          إدارة العلامة التجارية
        </h2>
        <div className="w-fit">
          <AnimatedTabs tabs={tabItems} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 pb-6  bg-[#d9e7ed]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
          <TabsContent value="overview" className="space-y-6">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="identity" className="space-y-6">
            <CulturalIdentityTab />
          </TabsContent>

          <TabsContent value="assets" className="space-y-6">
            <VisualAssetsTab />
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <ContentMessagingTab />
          </TabsContent>

          <TabsContent value="research" className="space-y-6">
            <CulturalResearchTab />
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <EventsTab />
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <TemplatesTab />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <ReportsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>;
};