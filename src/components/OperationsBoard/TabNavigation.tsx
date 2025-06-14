
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
    <TabsList className="gap-2 bg-transparent flex-row-reverse py-1 px-3 justify-start border-b border-white/10 mb-2 rounded-t-[26px]">
      {tabItems.map(tab => (
        <TabsTrigger
          key={tab.value}
          value={tab.value}
          className={`
            font-arabic text-base rounded-xl px-5 py-2 select-none
            transition-all duration-250 border-2
            border-transparent
            data-[state=active]:bg-[#23456d]/90 data-[state=active]:border-[#23456d]/90 data-[state=active]:text-white
            data-[state=inactive]:bg-white/10 data-[state=inactive]:text-gray-800/85 data-[state=inactive]:hover:bg-white/50
            shadow-sm data-[state=active]:shadow-md
          `}
        >
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};
