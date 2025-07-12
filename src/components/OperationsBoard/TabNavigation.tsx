import React from 'react';
import { AnimatedTabs } from '@/components/ui/AnimatedTabs';
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
  return <div dir="rtl" className="w-full overflow-x-auto overflow-y-hidden no-scrollbar mx-0 px-[550px]">
      
      
      <style>{`
        .no-scrollbar {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
      `}</style>
    </div>;
};