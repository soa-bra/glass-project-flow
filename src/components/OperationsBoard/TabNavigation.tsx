
import React from 'react';
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
    <div className="border-b border-gray-200/30 min-h-[80px] flex items-center px-4 bg-white/20 backdrop-blur-sm">
      <div className="w-full flex items-center gap-2 overflow-x-auto">
        {tabItems.map(item => (
          <button 
            key={item.value} 
            onClick={() => onTabChange(item.value)} 
            className="flex items-center justify-center px-3 py-2 transition-all duration-300 ease-in-out group relative min-w-fit"
          >
            <div className={`
              min-w-[130px] h-[45px] flex items-center justify-center transition-all duration-300 ease-out flex-shrink-0 border-2 rounded-full relative overflow-hidden
              ${activeTab === item.value 
                ? 'border-[#3e494c]/50 bg-white/50 shadow-lg backdrop-blur-md' 
                : 'border-[#3e494c]/25 bg-white/20 group-hover:border-[#3e494c]/40 group-hover:bg-white/30'}
              group-hover:scale-105 group-active:scale-95 group-hover:shadow-md
            `}>
              <div className={`
                absolute inset-0 rounded-full transition-all duration-300 ease-out
                ${activeTab === item.value 
                  ? 'bg-gradient-to-r from-white/30 to-white/10 opacity-100' 
                  : 'bg-gradient-to-r from-white/20 to-white/5 opacity-0 group-hover:opacity-100'}
              `} />
              
              <span className={`
                tracking-wide text-sm transition-all duration-300 ease-out font-arabic whitespace-nowrap relative z-10
                ${activeTab === item.value 
                  ? 'text-[#3e494c] font-semibold' 
                  : 'text-[#3e494c]/75 group-hover:text-[#3e494c] group-hover:font-medium'}
              `}>
                {item.label}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
