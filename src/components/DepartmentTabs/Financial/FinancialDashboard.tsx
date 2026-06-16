import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { BaseTabContent } from '@/components/shared';
import { OverviewTab } from './OverviewTab';
import { BudgetsTab } from './BudgetsTab';
import { TransactionsTab } from './TransactionsTab';
import { InvoicesTab } from './InvoicesTab';
import { AnalysisTab } from './AnalysisTab';
import { TemplatesTab } from './TemplatesTab';
import { ReportsTab } from './ReportsTab';
import { getDepartmentTabDefinition } from '@/features/ai/context/departmentRegistry';
import { registerAIContextSource } from '@/features/ai/context/projectContextBuilder';
import { LinkIndicator } from '@/components/shared/LinkIndicator';

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

  useEffect(() => {
    const tabDefinition = getDepartmentTabDefinition('financial', activeTab);
    return registerAIContextSource({
      id: 'financial-dashboard-active-tab',
      kind: 'financial',
      data: {
        active_department: { id: 'financial', label: 'إدارة العمليات المالية', category: 'financial' },
        active_tab: { id: activeTab, label: tabDefinition?.label ?? activeTab, departmentId: 'financial' },
        visible_boxes: tabDefinition?.boxKeys ?? [],
        financial_snapshot: { activeView: activeTab },
      },
      permission_scope: { role: 'editor', allowed: true, canViewFinancial: true },
    });
  }, [activeTab]);

  return (
    <DashboardLayout
      title="إدارة العمليات المالية"
      tabs={tabItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <div className="mb-4 flex justify-end"><LinkIndicator projectId="financial-dashboard" /></div>
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