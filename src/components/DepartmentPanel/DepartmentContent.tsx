
import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';

interface DepartmentContentProps {
  tabs: string[];
  renderTabContent: (tab: string) => React.ReactNode;
}

export const DepartmentContent: React.FC<DepartmentContentProps> = ({ tabs, renderTabContent }) => {
  return (
    <Tabs defaultValue={tabs[0]} className="flex-1 flex flex-col px-0 mx-0" dir="rtl">
      <div className="px-0 my-0">
        {tabs.map(tab => (
          <TabsContent key={tab} value={tab} className="flex-1 mt-0 overflow-auto px-0 mx-0">
            <div className="h-full mx-6 mb-6 rounded-2xl overflow-hidden bg-transparent">
              {renderTabContent(tab)}
            </div>
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
};
