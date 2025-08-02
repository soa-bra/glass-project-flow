import React, { useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { UnifiedTabContent } from '@/components/shared/UnifiedTabContent';
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
  const tabItems = [{
    value: 'overview',
    label: 'نظرة عامة'
  }, {
    value: 'employees',
    label: 'ملفات الموظفين'
  }, {
    value: 'attendance',
    label: 'الحضور والإجازات'
  }, {
    value: 'performance',
    label: 'الأداء والتقييم'
  }, {
    value: 'recruitment',
    label: 'التوظيف والمواهب'
  }, {
    value: 'training',
    label: 'التدريب والتطوير'
  }, {
    value: 'templates',
    label: 'النماذج والقوالب'
  }, {
    value: 'reports',
    label: 'التقارير'
  }];
  return (
    <DashboardLayout
      title="إدارة الطاقات البشرية"
      tabs={tabItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <UnifiedTabContent value="overview">
        <OverviewTab />
      </UnifiedTabContent>

      <UnifiedTabContent value="employees">
        <EmployeesTab />
      </UnifiedTabContent>

      <UnifiedTabContent value="attendance">
        <AttendanceTab />
      </UnifiedTabContent>

      <UnifiedTabContent value="performance">
        <PerformanceTab />
      </UnifiedTabContent>

      <UnifiedTabContent value="recruitment">
        <RecruitmentTab />
      </UnifiedTabContent>

      <UnifiedTabContent value="training">
        <TrainingTab />
      </UnifiedTabContent>

      <UnifiedTabContent value="templates">
        <TemplatesTab />
      </UnifiedTabContent>

      <UnifiedTabContent value="reports">
        <ReportsTab />
      </UnifiedTabContent>
    </DashboardLayout>
  );
};