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
  return <TabsList className="flex w-auto bg-transparent gap-1 h-auto py-0 px my-0">
      {tabItems.map(tab => <TabsTrigger key={tab.value} value={tab.value} className="text-sm font-arabic rounded-full px-6 py-3 transition-all duration-300 data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600 data-[state=inactive]:border data-[state=inactive]:border-gray-400 hover:bg-gray-100 whitespace-nowrap">
          {tab.label}
        </TabsTrigger>)}
    </TabsList>;
};