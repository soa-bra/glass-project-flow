import React, { useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { UnifiedTabContent } from '@/components/shared/UnifiedTabContent';
import { SoaReveal } from '@/components/ui';
import { OverviewTab } from './OverviewTab';
import { ContractsTab } from './ContractsTab';
import { ComplianceTab } from './ComplianceTab';
import { RisksTab } from './RisksTab';
import { LicensesTab } from './LicensesTab';
import { TemplatesTab } from './TemplatesTab';
import { ReportsTab } from './ReportsTab';

export const LegalDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const tabItems = [
    { value: 'overview', label: 'النظرة العامة' },
    { value: 'contracts', label: 'العقود والاتفاقيات' },
    { value: 'compliance', label: 'الامتثال' },
    { value: 'risks', label: 'المخاطر والنزاعات' },
    { value: 'licenses', label: 'التراخيص والملكية الفكرية' },
    { value: 'templates', label: 'النماذج والقوالب' },
    { value: 'reports', label: 'التقارير' }
  ];

  return (
    <SoaReveal>
      <DashboardLayout
        title="إدارة الأحوال القانونية"
        tabs={tabItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        <UnifiedTabContent value="overview">
          <SoaReveal delay={0.1}>
            <OverviewTab />
          </SoaReveal>
        </UnifiedTabContent>

        <UnifiedTabContent value="contracts">
          <SoaReveal delay={0.1}>
            <ContractsTab />
          </SoaReveal>
        </UnifiedTabContent>

        <UnifiedTabContent value="compliance">
          <SoaReveal delay={0.1}>
            <ComplianceTab />
          </SoaReveal>
        </UnifiedTabContent>

        <UnifiedTabContent value="risks">
          <SoaReveal delay={0.1}>
            <RisksTab />
          </SoaReveal>
        </UnifiedTabContent>

        <UnifiedTabContent value="licenses">
          <SoaReveal delay={0.1}>
            <LicensesTab />
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