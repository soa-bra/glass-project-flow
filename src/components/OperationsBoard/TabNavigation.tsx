
import React from 'react';
import { AnimatedTabs } from '@/components/ui/AnimatedTabs';
import { TabItem } from './types';
import { RefreshCw, Settings } from 'lucide-react';
import { CircularIconButton } from '@/components/ui/CircularIconButton';

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
        <CircularIconButton 
          icon={RefreshCw} 
          size="sm"
          variant="default"
          onClick={() => window.location.reload()}
        />
        <CircularIconButton 
          icon={Settings} 
          size="sm"
          variant="default"
          onClick={() => console.log('Settings clicked')}
        />
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
