
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
    <TabsList className="grid w-full grid-cols-6 bg-transparent backdrop-blur-sm rounded-full p-2 mx-4 mt-2 mb-4 border border-white/20">
      {tabItems.map((tab) => (
        <TabsTrigger
          key={tab.value}
          value={tab.value}
          className="text-sm font-arabic rounded-full px-4 py-2 transition-all duration-300 
                     data-[state=active]:bg-gray-800/90 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border-transparent
                     data-[state=inactive]:border data-[state=inactive]:border-white/30
                     text-gray-600 hover:text-gray-800 hover:bg-white/20 border border-white/30"
        >
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};
