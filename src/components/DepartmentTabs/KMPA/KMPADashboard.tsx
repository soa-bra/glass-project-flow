
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OverviewTab } from './OverviewTab';
import { KnowledgeRepositoryTab } from './KnowledgeRepositoryTab';
import { AuthoringVersionsTab } from './AuthoringVersionsTab';
import { AnalyticsImpactTab } from './AnalyticsImpactTab';
import { ModelsTemplatesTab } from './ModelsTemplatesTab';
import { ReportsTab } from './ReportsTab';

export const KMPADashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="h-full flex flex-col bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-[24px] my-[24px]">
        <h2 className="font-medium text-black font-arabic text-3xl whitespace-nowrap px-[24px]">
          إدارة المعرفة والنشر والبحث العلمي
        </h2>
        <div className="w-fit">
          <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl" className="w-full">
            <TabsList className="grid w-full bg-transparent rounded-full p-1 grid-cols-6">
              <TabsTrigger 
                value="overview" 
                className="text-sm font-arabic rounded-full py-2 px-4 transition-all duration-300 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-700 data-[state=inactive]:border data-[state=inactive]:border-black hover:bg-gray-100 hover:text-gray-800 whitespace-nowrap data-[state=active]:bg-black"
              >
                نظرة عامة
              </TabsTrigger>
              <TabsTrigger 
                value="repository" 
                className="text-sm font-arabic rounded-full py-2 px-4 transition-all duration-300 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-700 data-[state=inactive]:border data-[state=inactive]:border-black hover:bg-gray-100 hover:text-gray-800 whitespace-nowrap data-[state=active]:bg-black"
              >
                مستودع المعرفة
              </TabsTrigger>
              <TabsTrigger 
                value="authoring" 
                className="text-sm font-arabic rounded-full py-2 px-4 transition-all duration-300 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-700 data-[state=inactive]:border data-[state=inactive]:border-black hover:bg-gray-100 hover:text-gray-800 whitespace-nowrap data-[state=active]:bg-black"
              >
                التأليف والإصدارات
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="text-sm font-arabic rounded-full py-2 px-4 transition-all duration-300 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-700 data-[state=inactive]:border data-[state=inactive]:border-black hover:bg-gray-100 hover:text-gray-800 whitespace-nowrap data-[state=active]:bg-black"
              >
                التحليلات والتأثير
              </TabsTrigger>
              <TabsTrigger 
                value="templates" 
                className="text-sm font-arabic rounded-full py-2 px-4 transition-all duration-300 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-700 data-[state=inactive]:border data-[state=inactive]:border-black hover:bg-gray-100 hover:text-gray-800 whitespace-nowrap data-[state=active]:bg-black"
              >
                النماذج والقوالب
              </TabsTrigger>
              <TabsTrigger 
                value="reports" 
                className="text-sm font-arabic rounded-full py-2 px-4 transition-all duration-300 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-700 data-[state=inactive]:border data-[state=inactive]:border-black hover:bg-gray-100 hover:text-gray-800 whitespace-nowrap data-[state=active]:bg-black"
              >
                التقارير
              </TabsTrigger>
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
