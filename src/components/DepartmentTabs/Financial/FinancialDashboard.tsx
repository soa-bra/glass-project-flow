import React, { useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { UnifiedTabContent } from '@/components/shared/UnifiedTabContent';
import { SoaReveal } from '@/components/ui';
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
    <SoaReveal>
      <DashboardLayout
        title="إدارة الأوضاع المالية"
        tabs={tabItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        <UnifiedTabContent value="overview">
          <SoaReveal delay={0.1}>
            <OverviewTab />
          </SoaReveal>
        </UnifiedTabContent>

        <UnifiedTabContent value="budgets">
          <SoaReveal delay={0.1}>
            <BudgetsTab />
          </SoaReveal>
        </UnifiedTabContent>

        <UnifiedTabContent value="transactions">
          <SoaReveal delay={0.1}>
            <TransactionsTab />
          </SoaReveal>
        </UnifiedTabContent>

        <UnifiedTabContent value="invoices">
          <SoaReveal delay={0.1}>
            <InvoicesTab />
          </SoaReveal>
        </UnifiedTabContent>

        <UnifiedTabContent value="analysis">
          <SoaReveal delay={0.1}>
            <AnalysisTab />
          </SoaReveal>
        </UnifiedTabContent>

        <UnifiedTabContent value="settings">
          <SoaReveal delay={0.1}>
            <SettingsTab />
          </SoaReveal>
        </UnifiedTabContent>

        <UnifiedTabContent value="templates">
          <SoaReveal delay={0.1}>
            <TemplatesTab />
          </SoaReveal>
        </UnifiedTabContent>

        <UnifiedTabContent value="reports">
          <SoaReveal delay={0.1}>
            <ReportsTab />
          </SoaReveal>
        </UnifiedTabContent>
      </DashboardLayout>
    </SoaReveal>
  );
};