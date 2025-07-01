import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const tabItems = [{
    value: 'overview',
    label: 'نظرة عامة'
  }, {
    value: 'budgets',
    label: 'الميزانيات'
  }, {
    value: 'transactions',
    label: 'النفقات والإيرادات'
  }, {
    value: 'invoices',
    label: 'الفواتير والمدفوعات'
  }, {
    value: 'analysis',
    label: 'التحليل والتقارير'
  }, {
    value: 'settings',
    label: 'الضبط'
  }, {
    value: 'templates',
    label: 'النماذج والقوالب'
  }, {
    value: 'reports',
    label: 'التقارير'
  }];
  return <div className="h-full flex flex-col bg-transparent">
      {/* Header with Title and Tabs */}
      <div className="flex items-center justify-between my-[10px] py-[25px] px-0">
        <h2 className="font-medium text-black font-arabic text-3xl whitespace-nowrap px-[24px]">
          إدارة الأوضاع المالية
        </h2>
        <div className="w-fit">
          <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl" className="w-full">
            <TabsList style={{
            gridTemplateColumns: `repeat(${tabItems.length}, 1fr)`
          }} className="grid w-full bg-transparent p-1 mx-[240px] py-0 px-[40px] rounded-none">
              {tabItems.map(tab => <TabsTrigger key={tab.value} value={tab.value} className="text-sm font-arabic rounded-full py-2 transition-all duration-300 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-700 data-[state=inactive]:border data-[state=inactive]:border-black hover:bg-gray-100 hover:text-gray-800 whitespace-nowrap data-[state=active]:bg-black px-[10px]">
                  {tab.label}
                </TabsTrigger>)}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="w-full h-full overflow-auto p-4 m-0 py-[15px] px-px">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
          <TabsContent value="overview" className="space-y-6">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="budgets" className="space-y-6">
            <BudgetsTab />
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <TransactionsTab />
          </TabsContent>

          <TabsContent value="invoices" className="space-y-6">
            <InvoicesTab />
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <AnalysisTab />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SettingsTab />
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