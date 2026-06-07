import React, { useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { BaseTabContent } from '@/components/shared';
import { OverviewTab } from './OverviewTab';
import { BudgetsTab } from './BudgetsTab';
import { TransactionsTab } from './TransactionsTab';
import { InvoicesTab } from './InvoicesTab';
import { AnalysisTab } from './AnalysisTab';
import { TemplatesTab } from './TemplatesTab';
import { ReportsTab } from './ReportsTab';

export const FinancialDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const tabItems = [
    { value: 'overview', label: 'نظرة عامة' },
    { value: 'budgets', label: 'الميزانية' },
    { value: 'transactions', label: 'المعاملات' },
    { value: 'invoices', label: 'الفواتير والمدفوعات' },
    { value: 'analysis', label: 'مركز القرار المالي' },
    { value: 'templates', label: 'النماذج والقوالب' },
    { value: 'reports', label: 'التقارير' }
  ];

  return (
    <DashboardLayout
      title="إدارة العمليات المالية"
      tabs={tabItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <BaseTabContent value="overview">
        <OverviewTab />
      </BaseTabContent>

      <BaseTabContent value="budgets">
        <BudgetsTab />
      </BaseTabContent>

      <BaseTabContent value="transactions">
        <TransactionsTab />
      </BaseTabContent>

      <BaseTabContent value="invoices">
        <InvoicesTab />
      </BaseTabContent>

      <BaseTabContent value="analysis">
        <AnalysisTab />
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