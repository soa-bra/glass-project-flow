
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
    <div className="h-[120px] flex items-center justify-center px-6">
      {/* خلفية شريط التبويب مع glassmorphism */}
      <div className="relative rounded-2xl backdrop-blur-xl bg-gradient-to-r from-white/20 via-white/15 to-white/20 border border-white/25 shadow-xl shadow-black/5 p-2">
        {/* خلفية إضافية للتأثير */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-black/5" />
        
        {/* أزرار التبويب */}
        <div className="relative flex items-center gap-1">
          {tabItems.map((item) => {
            const isActive = activeTab === item.value;
            
            return (
              <button
                key={item.value}
                onClick={() => onTabChange(item.value)}
                className={`
                  relative px-6 py-3 rounded-xl transition-all duration-300 ease-out
                  ${isActive 
                    ? 'bg-white/40 text-[#2A3437] font-semibold shadow-lg shadow-black/10 border border-white/30' 
                    : 'text-[#3e494c]/70 hover:bg-white/20 hover:text-[#2A3437] hover:border border-transparent hover:border-white/20'
                  }
                  backdrop-blur-sm
                `}
              >
                {/* خلفية نشطة مع تأثير إضافي */}
                {isActive && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/30 via-white/20 to-white/10" />
                )}
                
                {/* النص */}
                <span className="relative text-sm font-arabic tracking-wide whitespace-nowrap">
                  {item.label}
                </span>
                
                {/* نقطة المؤشر للعنصر النشط */}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#2A3437] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
