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
  return <div className="border-b border-gray-200/30 h-[120px] flex items-center px-0">
      <div className="w-full flex items-center gap-0 overflow-x-auto">
        {tabItems.map(item => {
        return <button key={item.value} onClick={() => onTabChange(item.value)} className="flex items-center justify-center px-2.5 py-2.5 transition-all duration-400 ease-in-out group relative min-w-fit">
              {/* إطار النص مع التأثيرات اللونية داخل الحدود */}
              <div className={`
                min-w-[120px] h-[60px] flex items-center justify-center transition-all duration-300 ease-out flex-shrink-0 border-2 rounded-full relative overflow-hidden
                ${activeTab === item.value ? 'border-[#3e494c]/40 bg-white/30' : 'border-[#3e494c]/30 group-hover:border-[#3e494c]/50'}
                group-hover:scale-105 group-active:scale-95
              `}>
                {/* خلفية التأثير للهوفر - داخل الإطار */}
                <div className={`
                  absolute inset-0 rounded-full transition-all duration-300 ease-out
                  ${activeTab === item.value ? 'bg-white/20 opacity-100' : 'bg-white/0 group-hover:bg-white/10 opacity-0 group-hover:opacity-100'}
                `} />
                
                {/* النص */}
                <span className={`
                  tracking-wide text-sm transition-all duration-300 ease-out font-arabic whitespace-nowrap relative z-10
                  ${activeTab === item.value ? 'text-[#3e494c] font-medium' : 'text-[#3e494c]/70 group-hover:text-[#3e494c] group-hover:font-medium'}
                `}>
                  {item.label}
                </span>
              </div>
            </button>;
      })}
      </div>
    </div>;
};