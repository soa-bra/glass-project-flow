
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { OverviewTab } from './OverviewTab';
import { ContractsTab } from './ContractsTab';
import { ComplianceTab } from './ComplianceTab';
import { RisksTab } from './RisksTab';
import { LicensesTab } from './LicensesTab';
import { TemplatesTab } from './TemplatesTab';
import { ReportsTab } from './ReportsTab';

export const LegalDashboard: React.FC = () => {
  const tabs = [
    { key: 'overview', label: 'النظرة العامة', component: OverviewTab },
    { key: 'contracts', label: 'العقود والاتفاقيات', component: ContractsTab },
    { key: 'compliance', label: 'الامتثال', component: ComplianceTab },
    { key: 'risks', label: 'المخاطر والنزاعات', component: RisksTab },
    { key: 'licenses', label: 'التراخيص والملكية الفكرية', component: LicensesTab },
    { key: 'templates', label: 'النماذج والقوالب', component: TemplatesTab },
    { key: 'reports', label: 'التقارير', component: ReportsTab }
  ];

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-medium text-black font-arabic text-3xl">
          إدارة الأحوال القانونية
        </h2>
        <div className="w-fit">
          <Tabs defaultValue="overview" dir="rtl" className="w-full">
            <TabsList className="grid w-full bg-transparent rounded-full p-1" style={{
              gridTemplateColumns: `repeat(${tabs.length}, 1fr)`
            }}>
              {tabs.map(tab => (
                <TabsTrigger 
                  key={tab.key} 
                  value={tab.key} 
                  className="text-sm font-arabic rounded-full py-2 px-4 transition-all duration-300 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-700 data-[state=inactive]:border data-[state=inactive]:border-black hover:bg-gray-100 hover:text-gray-800 whitespace-nowrap data-[state=active]:bg-black"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Tab Content */}
            <div className="mt-6">
              {tabs.map(tab => {
                const TabComponent = tab.component;
                return (
                  <TabsContent key={tab.key} value={tab.key} className="h-full mt-0">
                    <TabComponent />
                  </TabsContent>
                );
              })}
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
