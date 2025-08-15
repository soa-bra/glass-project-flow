import React, { useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { UnifiedTabContent } from '@/components/shared/UnifiedTabContent';
import { OverviewTab } from './OverviewTab';
import { BudgetsTab } from './BudgetsTab';
import { TransactionsTab } from './TransactionsTab';
import { InvoicesTab } from './InvoicesTab';
import { AnalysisTab } from './AnalysisTab';
import { SettingsTab } from './SettingsTab';
import { TemplatesTab } from './TemplatesTab';
import { ReportsTab } from './ReportsTab';

export const FinancialDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const tabItems = [
    { value: 'overview', label: 'النظرة العامة' },
    { value: 'budgets', label: 'الميزانيات' },
    { value: 'transactions', label: 'النفقات والإيرادات' },
    { value: 'invoices', label: 'الفواتير والمدفوعات' },
    { value: 'analysis', label: 'التحليل والتقارير' },
    { value: 'settings', label: 'الضبط' },
    { value: 'templates', label: 'النماذج والقوالب' },
    { value: 'reports', label: 'التقارير' }
  ];

  return (
    <DashboardLayout
      title="إدارة الأوضاع المالية"
      tabs={tabItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <UnifiedTabContent value="overview">
        <OverviewTab />
      </UnifiedTabContent>

      <UnifiedTabContent value="budgets">
        <BudgetsTab />
      </UnifiedTabContent>

      <UnifiedTabContent value="transactions">
        <TransactionsTab />
      </UnifiedTabContent>

      <UnifiedTabContent value="invoices">
        <InvoicesTab />
      </UnifiedTabContent>

      <UnifiedTabContent value="analysis">
        <AnalysisTab />
      </UnifiedTabContent>

      <UnifiedTabContent value="settings">
        <SettingsTab />
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