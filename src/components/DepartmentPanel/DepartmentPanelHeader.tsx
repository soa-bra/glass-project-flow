
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DepartmentPanelHeaderProps {
  title: string;
  tabs: string[];
}

export const DepartmentPanelHeader: React.FC<DepartmentPanelHeaderProps> = ({ title, tabs }) => {
  return (
    <div className="flex items-center justify-between px-6 py-[24px] my-[24px]">
      <h2 className="font-medium text-black font-arabic text-3xl whitespace-nowrap px-[24px]">
        {title}
      </h2>
      <div className="w-fit">
        <Tabs defaultValue={tabs[0]} dir="rtl" className="w-full">
          <TabsList className="grid w-full bg-transparent rounded-full p-1" style={{
            gridTemplateColumns: `repeat(${tabs.length}, 1fr)`
          }}>
            {tabs.map(tab => (
              <TabsTrigger 
                key={tab} 
                value={tab} 
                className="text-sm font-arabic rounded-full py-2 px-6 transition-all duration-300 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-700 data-[state=inactive]:border data-[state=inactive]:border-black hover:bg-gray-100 hover:text-gray-800 whitespace-nowrap data-[state=active]:bg-black"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};
