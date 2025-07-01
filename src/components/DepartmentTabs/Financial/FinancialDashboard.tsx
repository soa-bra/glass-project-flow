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
      <div className="flex items-center justify-between px-0 py-[10px] my-[25px]">
        <h2 className="font-medium text-black font-arabic text-3xl whitespace-nowrap px-[10px]">
          إدارة الأوضاع المالية
        </h2>
        <div className="w-fit">
          <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl" className="w-full">
            <TabsList className="grid w-full bg-transparent rounded-full p-1" style={{
            gridTemplateColumns: `repeat(${tabItems.length}, 1fr)`
          }}>
              {tabItems.map(tab => <TabsTrigger key={tab.value} value={tab.value} className="text-sm font-arabic rounded-full transition-all duration-300 data-[state=active]:text-white data-[state=inactive]:text-gray-700 data-[state=inactive]:border data-[state=inactive]:border-black hover:text-gray-800 whitespace-nowrap px-[10px] py-[8px] ">
                  {tab.label}
                </TabsTrigger>)}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto pb-6 px-0 my-[25px]">
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