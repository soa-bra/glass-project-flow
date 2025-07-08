
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { AnimatedTabs } from '@/components/ui/AnimatedTabs';
import { OverviewTab } from './OverviewTab';
import { InitiativesTab } from './InitiativesTab';
import { PartnershipsTab } from './PartnershipsTab';
import { MonitoringTab } from './MonitoringTab';
import { StoriesTab } from './StoriesTab';
import { TemplatesTab } from './TemplatesTab';
import { ReportsTab } from './ReportsTab';

export const CSRDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabItems = [
    { value: 'overview', label: 'نظرة عامة' },
    { value: 'initiatives', label: 'المبادرات' },
    { value: 'partnerships', label: 'الشراكات والموارد' },
    { value: 'monitoring', label: 'المراقبة والتقييم' },
    { value: 'stories', label: 'قصص الأثر' },
    { value: 'templates', label: 'النماذج والقوالب' },
    { value: 'reports', label: 'التقارير' }
  ];

  return (
    <div className="h-full flex flex-col bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-[24px] my-[24px]">
        <h2 className="font-medium text-black font-arabic text-3xl whitespace-nowrap px-[24px]">
          إدارة المسؤولية الاجتماعية
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
          
          <TabsContent value="initiatives" className="space-y-6">
            <InitiativesTab />
          </TabsContent>
          
          <TabsContent value="partnerships" className="space-y-6">
            <PartnershipsTab />
          </TabsContent>
          
          <TabsContent value="monitoring" className="space-y-6">
            <MonitoringTab />
          </TabsContent>
          
          <TabsContent value="stories" className="space-y-6">
            <StoriesTab />
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
