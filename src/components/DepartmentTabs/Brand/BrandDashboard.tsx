
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

  const tabItems = [
    { value: 'overview', label: 'نظرة عامة' },
    { value: 'identity', label: 'الهوية الثقافية' },
    { value: 'assets', label: 'الأصول البصرية' },
    { value: 'content', label: 'المحتوى والرسائل' },
    { value: 'research', label: 'البحث والتطوير الثقافي' },
    { value: 'events', label: 'الفعاليات' },
    { value: 'templates', label: 'النماذج والقوالب' },
    { value: 'reports', label: 'التقارير' }
  ];

  return (
    <div className="h-full flex flex-col bg-transparent">
      {/* Header with Title and Tabs */}
      <div className="flex items-center justify-between px-0 py-[10px] my-[65px]">
        <h2 className="font-medium text-black font-arabic text-3xl whitespace-nowrap px-[10px]">
          إدارة العلامة التجارية
        </h2>
        <div className="w-fit">
          <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl" className="w-full">
            <TabsList className="grid w-full bg-transparent rounded-full p-1" style={{
              gridTemplateColumns: `repeat(${tabItems.length}, 1fr)`
            }}>
              {tabItems.map(tab => (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value} 
                  className="text-sm font-arabic rounded-full py-2 px-4 transition-all duration-300 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-700 data-[state=inactive]:border data-[state=inactive]:border-black hover:bg-gray-100 hover:text-gray-800 whitespace-nowrap data-[state=active]:bg-black"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto pb-6 px-0 my-[25px]">
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
    </div>
  );
};
