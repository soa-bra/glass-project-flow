
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { OverviewTab } from './OverviewTab';
import { InitiativesTab } from './InitiativesTab';
import { PartnershipsTab } from './PartnershipsTab';
import { MonitoringTab } from './MonitoringTab';
import { StoriesTab } from './StoriesTab';
import { TemplatesTab } from './TemplatesTab';
import { ReportsTab } from './ReportsTab';

export const CSRDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'نظرة عامة' },
    { id: 'initiatives', label: 'المبادرات' },
    { id: 'partnerships', label: 'الشراكات والموارد' },
    { id: 'monitoring', label: 'المراقبة والتقييم' },
    { id: 'stories', label: 'قصص الأثر' },
    { id: 'templates', label: 'النماذج والقوالب' },
    { id: 'reports', label: 'التقارير' }
  ];

  return (
    <div className="h-full flex flex-col bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-[24px] my-[24px]">
        <h2 className="font-medium text-black font-arabic text-3xl whitespace-nowrap px-[24px]">
          إدارة المسؤولية الاجتماعية
        </h2>
        <div className="w-fit">
          <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl" className="w-full">
            <TabsList className="grid w-full bg-transparent rounded-full p-1" style={{
              gridTemplateColumns: `repeat(${tabs.length}, 1fr)`
            }}>
              {tabs.map(tab => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id} 
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
