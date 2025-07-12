
import React from 'react';
import { cn } from '@/lib/utils';

interface TabItem {
  value: string;
  label: string;
}

interface AnimatedTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

export const AnimatedTabs: React.FC<AnimatedTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className
}) => {
  return (
    <div className={cn("flex bg-white/20 backdrop-blur-sm rounded-2xl p-1 gap-1", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={cn(
            "relative px-6 py-3 text-lg font-medium font-arabic transition-all duration-300 rounded-xl whitespace-nowrap",
            activeTab === tab.value
              ? "bg-white text-black shadow-lg"
              : "text-black hover:bg-white/30"
          )}
          style={{ fontSize: '1.3rem' }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
