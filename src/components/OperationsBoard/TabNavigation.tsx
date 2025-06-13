
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
    <div className="px-6 pt-4 pb-2">
      <TabsList className="grid w-full grid-cols-6 bg-white/20 backdrop-blur-sm rounded-full p-1 gap-1">
        {tabItems.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            className="rounded-full px-4 py-2 text-sm font-arabic font-medium transition-all duration-300 data-[state=active]:bg-white/80 data-[state=active]:text-gray-800 data-[state=active]:shadow-lg text-gray-600 hover:text-gray-800 hover:bg-white/40"
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
};
