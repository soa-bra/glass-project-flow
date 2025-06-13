
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
    <TabsList className="grid w-full grid-cols-6 bg-white/20 backdrop-blur-sm rounded-lg p-1 mx-4 mt-2 mb-4">
      {tabItems.map((tab) => (
        <TabsTrigger
          key={tab.value}
          value={tab.value}
          className="text-sm font-arabic data-[state=active]:bg-white/80 data-[state=active]:text-gray-800 text-gray-600 hover:text-gray-800 transition-all"
        >
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};
