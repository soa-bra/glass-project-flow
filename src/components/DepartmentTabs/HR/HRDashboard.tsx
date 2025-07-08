
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { ScrollableAnimatedTabs } from '@/components/ui/ScrollableAnimatedTabs';
import { OverviewTab } from './OverviewTab';
import { EmployeesTab } from './EmployeesTab';
import { AttendanceTab } from './AttendanceTab';
import { PerformanceTab } from './PerformanceTab';
import { RecruitmentTab } from './RecruitmentTab';
import { TrainingTab } from './TrainingTab';
import { TemplatesTab } from './TemplatesTab';
import { ReportsTab } from './ReportsTab';

export const HRDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabItems = [
    { value: 'overview', label: 'نظرة عامة' },
    { value: 'employees', label: 'ملفات الموظفين' },
    { value: 'attendance', label: 'الحضور والإجازات' },
    { value: 'performance', label: 'الأداء والتقييم' },
    { value: 'recruitment', label: 'التوظيف والمواهب' },
    { value: 'training', label: 'التدريب والتطوير' },
    { value: 'templates', label: 'النماذج والقوالب' },
    { value: 'reports', label: 'التقارير' }
  ];

  return (
    <div className="h-full flex flex-col bg-transparent">
      {/* Header with Title and Tabs */}
      <div className="flex items-center justify-between px-6 py-[24px] my-[24px]">
        <h2 className="font-medium text-black font-arabic text-3xl whitespace-nowrap px-[24px]">
          إدارة الطاقات البشرية
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

          <TabsContent value="employees" className="space-y-6">
            <EmployeesTab />
          </TabsContent>

          <TabsContent value="attendance" className="space-y-6">
            <AttendanceTab />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <PerformanceTab />
          </TabsContent>

          <TabsContent value="recruitment" className="space-y-6">
            <RecruitmentTab />
          </TabsContent>

          <TabsContent value="training" className="space-y-6">
            <TrainingTab />
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
