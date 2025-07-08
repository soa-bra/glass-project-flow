
import React from 'react';
import { ScrollableAnimatedTabs } from '@/components/ui/ScrollableAnimatedTabs';
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
  const animatedTabItems = tabItems.map(tab => ({
    value: tab.value,
    label: tab.label
  }));

  return (
    <div className="w-full" dir="rtl">
      <ScrollableAnimatedTabs 
        tabs={animatedTabItems}
        activeTab={activeTab}
        onTabChange={onTabChange}
        className="mx-auto"
      />
    </div>
  );
};
