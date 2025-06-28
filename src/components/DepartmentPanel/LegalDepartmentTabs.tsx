
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const LEGAL_TABS = [
  { value: 'contracts', label: 'العقود' },
  { value: 'compliance', label: 'الامتثال' },
  { value: 'litigation', label: 'القضايا' },
  { value: 'policies', label: 'السياسات' }
];

export const LegalDepartmentTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('contracts');

  return (
    <div className="h-full p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl" className="h-full">
        <TabsList className="grid w-full grid-cols-4 mb-6 bg-white/20 backdrop-blur-sm">
          {LEGAL_TABS.map((tab) => (
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
          {LEGAL_TABS.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="h-full">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 h-full">
                <h3 className="text-xl font-arabic font-semibold mb-4">{tab.label}</h3>
                <p className="text-gray-600">محتوى {tab.label} قيد التطوير...</p>
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};
