
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const FINANCIAL_TABS = [
  { value: 'budgets', label: 'الميزانيات' },
  { value: 'expenses', label: 'المصروفات' },
  { value: 'revenues', label: 'الإيرادات' },
  { value: 'reports', label: 'التقارير المالية' },
  { value: 'forecasting', label: 'التنبؤات المالية' }
];

export const FinancialDepartmentTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('budgets');

  return (
    <div className="h-full p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl" className="h-full">
        <TabsList className="grid w-full grid-cols-5 mb-6 bg-white/20 backdrop-blur-sm">
          {FINANCIAL_TABS.map((tab) => (
            <TabsTrigger 
              key={tab.value} 
              value={tab.value}
              className="text-sm font-arabic data-[state=active]:bg-white/40 data-[state=active]:text-gray-800"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="h-[calc(100%-80px)] overflow-y-auto">
          <TabsContent value="budgets" className="h-full">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 h-full">
              <h3 className="text-xl font-arabic font-semibold mb-4">إدارة الميزانيات</h3>
              <p className="text-gray-600">محتوى إدارة الميزانيات قيد التطوير...</p>
            </div>
          </TabsContent>

          <TabsContent value="expenses" className="h-full">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 h-full">
              <h3 className="text-xl font-arabic font-semibold mb-4">المصروفات</h3>
              <p className="text-gray-600">محتوى المصروفات قيد التطوير...</p>
            </div>
          </TabsContent>

          <TabsContent value="revenues" className="h-full">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 h-full">
              <h3 className="text-xl font-arabic font-semibold mb-4">الإيرادات</h3>
              <p className="text-gray-600">محتوى الإيرادات قيد التطوير...</p>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="h-full">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 h-full">
              <h3 className="text-xl font-arabic font-semibold mb-4">التقارير المالية</h3>
              <p className="text-gray-600">محتوى التقارير المالية قيد التطوير...</p>
            </div>
          </TabsContent>

          <TabsContent value="forecasting" className="h-full">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 h-full">
              <h3 className="text-xl font-arabic font-semibold mb-4">التنبؤات المالية</h3>
              <p className="text-gray-600">محتوى التنبؤات المالية قيد التطوير...</p>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
