import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { AnimatedTabs } from '@/components/ui/AnimatedTabs';
import { OverviewTab } from './OverviewTab';
import { ContractsTab } from './ContractsTab';
import { ComplianceTab } from './ComplianceTab';
import { RisksTab } from './RisksTab';
import { LicensesTab } from './LicensesTab';
import { TemplatesTab } from './TemplatesTab';
import { ReportsTab } from './ReportsTab';
export const LegalDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const tabItems = [{
    value: 'overview',
    label: 'النظرة العامة'
  }, {
    value: 'contracts',
    label: 'العقود والاتفاقيات'
  }, {
    value: 'compliance',
    label: 'الامتثال'
  }, {
    value: 'risks',
    label: 'المخاطر والنزاعات'
  }, {
    value: 'licenses',
    label: 'التراخيص والملكية الفكرية'
  }, {
    value: 'templates',
    label: 'النماذج والقوالب'
  }, {
    value: 'reports',
    label: 'التقارير'
  }];
  return <div className="h-full flex flex-col bg-transparent">
      {/* Header with Title and Tabs */}
      <div className="flex items-center justify-between my-0 py-0 px-0">
        <h2 className="font-medium text-black font-arabic text-3xl whitespace-nowrap px-0">
          إدارة الأحوال القانونية
        </h2>
        <div className="w-fit">
          <AnimatedTabs tabs={tabItems} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto pb-6 px-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
          <TabsContent value="overview" className="space-y-6">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="contracts" className="space-y-6">
            <ContractsTab />
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <ComplianceTab />
          </TabsContent>

          <TabsContent value="risks" className="space-y-6">
            <RisksTab />
          </TabsContent>

          <TabsContent value="licenses" className="space-y-6">
            <LicensesTab />
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <TemplatesTab />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <ReportsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>;
};