
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { ScrollableAnimatedTabs } from '@/components/ui/ScrollableAnimatedTabs';
import { OverviewTab } from './OverviewTab';
import { CustomersTab } from './CustomersTab';
import { OpportunitiesTab } from './OpportunitiesTab';
import { ServiceTab } from './ServiceTab';
import { AnalyticsTab } from './AnalyticsTab';
import { TemplatesTab } from './TemplatesTab';
import { ReportsTab } from './ReportsTab';

export const CRMDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabItems = [
    { value: 'overview', label: 'نظرة عامة' },
    { value: 'customers', label: 'العملاء' },
    { value: 'opportunities', label: 'الفرص والعروض' },
    { value: 'service', label: 'خدمة العملاء والدعم' },
    { value: 'analytics', label: 'التحليلات' },
    { value: 'templates', label: 'النماذج والقوالب' },
    { value: 'reports', label: 'التقارير' }
  ];

  return (
    <div className="h-full flex flex-col bg-transparent">
      {/* Header with Title and Tabs */}
      <div className="flex items-center justify-between px-6 py-[24px] my-[24px]">
        <h2 className="font-medium text-black font-arabic text-3xl whitespace-nowrap px-[24px]">
          إدارة علاقات العملاء
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

          <TabsContent value="customers" className="space-y-6">
            <CustomersTab />
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-6">
            <OpportunitiesTab />
          </TabsContent>

          <TabsContent value="service" className="space-y-6">
            <ServiceTab />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsTab />
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
