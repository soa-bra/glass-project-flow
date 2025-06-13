
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
  return (
    <div className="px-6">
      <TabsList className="flex w-auto bg-transparent gap-1 h-auto py-0 px-0 my-0">
        {tabItems.map(tab => (
          <TabsTrigger 
            key={tab.value} 
            value={tab.value} 
            className="text-sm font-arabic rounded-full transition-all duration-300 data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600 data-[state=inactive]:border data-[state=inactive]:border-gray-400 hover:bg-gray-100 whitespace-nowrap py-[15px] px-[25px]"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
};
