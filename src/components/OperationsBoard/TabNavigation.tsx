import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabItem } from './types';
interface TabNavigationProps {
  tabItems: TabItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}
export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabItems,
  activeTab,
  onTabChange
}) => {
  return <div
  // منع التمرير الأفقي نهائياً (overflow-x-hidden)
  dir="rtl" style={{
    marginBottom: 2
  }} className="w-full overflow-x-hidden px-0 py-[3px]">
      <TabsList className="
          gap-1 justify-start mr-[20px] bg-transparent
          min-w-max
          flex-nowrap
        " style={{
      direction: "rtl",
      width: "fit-content"
    }}>
        {tabItems.map(tab => <TabsTrigger key={tab.value} value={tab.value} className="text-sm font-arabic rounded-full py-3 transition-all duration-300 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-700 data-[state=inactive]:border data-[state=inactive]:border-gray-400 hover:bg-gray-100 hover:text-gray-800 whitespace-nowrap px-[30px] data-[state=active]:bg-black">
            {tab.label}
          </TabsTrigger>)}
      </TabsList>
    </div>;
};