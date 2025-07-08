
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { ScrollableAnimatedTabs } from '@/components/ui/ScrollableAnimatedTabs';
import { OverviewTab } from './OverviewTab';
import { CoursesTab } from './CoursesTab';
import { LMSTab } from './LMSTab';
import { SchedulingTab } from './SchedulingTab';
import { CertificationsTab } from './CertificationsTab';
import { AnalyticsTab } from './AnalyticsTab';
import { CorporateTab } from './CorporateTab';
import { PartnershipsTab } from './PartnershipsTab';
import { TemplatesTab } from './TemplatesTab';
import { ReportsTab } from './ReportsTab';

export const TrainingDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabItems = [
    { value: 'overview', label: 'نظرة عامة' },
    { value: 'courses', label: 'الدورات التدريبية' },
    { value: 'lms', label: 'نظام إدارة التعلم' },
    { value: 'scheduling', label: 'الجدولة والتسجيل' },
    { value: 'certifications', label: 'الشهادات والمهارات' },
    { value: 'analytics', label: 'التحليلات والأداء' },
    { value: 'corporate', label: 'البرامج المؤسسية' },
    { value: 'partnerships', label: 'الشراكات الأكاديمية' },
    { value: 'templates', label: 'النماذج والقوالب' },
    { value: 'reports', label: 'التقارير' }
  ];

  return (
    <div className="h-full flex flex-col bg-transparent">
      {/* Header with Title and Tabs */}
      <div className="flex items-center justify-between px-0 py-[10px] my-[25px]">
        <h2 className="font-medium text-black font-arabic text-3xl whitespace-nowrap px-[10px]">
          إدارة التدريب
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
      <div className="flex-1 overflow-auto pb-6 px-0 my-[25px]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
          <TabsContent value="overview" className="space-y-6">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <CoursesTab />
          </TabsContent>

          <TabsContent value="lms" className="space-y-6">
            <LMSTab />
          </TabsContent>

          <TabsContent value="scheduling" className="space-y-6">
            <SchedulingTab />
          </TabsContent>

          <TabsContent value="certifications" className="space-y-6">
            <CertificationsTab />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsTab />
          </TabsContent>

          <TabsContent value="corporate" className="space-y-6">
            <CorporateTab />
          </TabsContent>

          <TabsContent value="partnerships" className="space-y-6">
            <PartnershipsTab />
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
