
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

  return (
    <div className="w-full overflow-x-auto overflow-y-hidden no-scrollbar px-0 flex items-center justify-between" dir="rtl">
      <div className="flex gap-2">
        <button className="w-8 h-8 rounded-full border border-black/20 flex items-center justify-center hover:bg-black/10">
          <span className="text-sm text-black">🔄</span>
        </button>
        <button className="w-8 h-8 rounded-full border border-black/20 flex items-center justify-center hover:bg-black/10">
          <span className="text-sm text-black">🎨</span>
        </button>
      </div>
      
      <AnimatedTabs 
        tabs={animatedTabItems}
        activeTab={activeTab}
        onTabChange={onTabChange}
        className="mx-auto"
      />
      
      <style>{`
        .no-scrollbar {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
      `}</style>
    </div>
  );
};
