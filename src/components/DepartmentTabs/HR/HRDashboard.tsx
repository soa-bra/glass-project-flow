import React, { useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { BaseTabContent } from '@/components/shared';
import { OverviewTab } from './OverviewTab';
import { EmployeesTab } from './EmployeesTab';
import { AttendanceTab } from './AttendanceTab';
import { PerformanceTab } from './PerformanceTab';
import { RecruitmentTab } from './RecruitmentTab';
import { TrainingTab } from './TrainingTab';
import { PartnersTab } from './PartnersTab';
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
    value: 'partners',
    label: 'الشركاء'
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
      <BaseTabContent value="overview">
        <OverviewTab />
      </BaseTabContent>

      <BaseTabContent value="employees">
        <EmployeesTab />
      </BaseTabContent>

      <BaseTabContent value="attendance">
        <AttendanceTab />
      </BaseTabContent>

      <BaseTabContent value="performance">
        <PerformanceTab />
      </BaseTabContent>

      <BaseTabContent value="recruitment">
        <RecruitmentTab />
      </BaseTabContent>

      <BaseTabContent value="training">
        <TrainingTab />
      </BaseTabContent>

      <BaseTabContent value="partners">
        <PartnersTab />
      </BaseTabContent>

      <BaseTabContent value="templates">
        <TemplatesTab />
      </BaseTabContent>

      <BaseTabContent value="reports">
        <ReportsTab />
      </BaseTabContent>
    </DashboardLayout>
  );
};